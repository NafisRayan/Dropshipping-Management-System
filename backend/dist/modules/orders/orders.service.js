"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("./entities/order.entity");
const order_item_entity_1 = require("./entities/order-item.entity");
const order_status_history_entity_1 = require("./entities/order-status-history.entity");
const order_status_enum_1 = require("../../common/enums/order-status.enum");
const customer_entity_1 = require("../customers/entities/customer.entity");
const product_entity_1 = require("../products/entities/product.entity");
const user_entity_1 = require("../users/entities/user.entity");
let OrdersService = class OrdersService {
    constructor(orderRepository, orderItemRepository, orderStatusHistoryRepository, customerRepository, productRepository, userRepository) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.orderStatusHistoryRepository = orderStatusHistoryRepository;
        this.customerRepository = customerRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }
    async create(createOrderDto, userId) {
        const customer = await this.customerRepository.findOne({
            where: { id: createOrderDto.customerId },
        });
        if (!customer) {
            throw new common_1.NotFoundException('Customer not found');
        }
        const productIds = createOrderDto.items.map(item => item.productId);
        const products = await this.productRepository.findBy({ id: (0, typeorm_2.In)(productIds) });
        if (products.length !== productIds.length) {
            throw new common_1.BadRequestException('Some products not found');
        }
        for (const item of createOrderDto.items) {
            const product = products.find(p => p.id === item.productId);
            if (product.availableQuantity < item.quantity) {
                throw new common_1.BadRequestException(`Insufficient stock for product ${product.name}. Available: ${product.availableQuantity}, Requested: ${item.quantity}`);
            }
        }
        const user = await this.userRepository.findOne({ where: { id: userId } });
        let subtotal = 0;
        const orderItems = [];
        for (const itemDto of createOrderDto.items) {
            const product = products.find(p => p.id === itemDto.productId);
            const totalPrice = itemDto.quantity * itemDto.unitPrice;
            subtotal += totalPrice;
            const orderItem = this.orderItemRepository.create({
                product,
                quantity: itemDto.quantity,
                unitPrice: itemDto.unitPrice,
                totalPrice,
            });
            orderItems.push(orderItem);
        }
        const totalAmount = subtotal + (createOrderDto.shippingCost || 0) + (createOrderDto.taxAmount || 0);
        const order = this.orderRepository.create({
            customer,
            createdBy: user,
            subtotal,
            shippingCost: createOrderDto.shippingCost || 0,
            taxAmount: createOrderDto.taxAmount || 0,
            totalAmount,
            notes: createOrderDto.notes,
            items: orderItems,
        });
        const savedOrder = await this.orderRepository.save(order);
        for (const item of orderItems) {
            await this.productRepository.update(item.product.id, {
                reservedQuantity: () => `reservedQuantity + ${item.quantity}`,
            });
        }
        const statusHistory = this.orderStatusHistoryRepository.create({
            order: savedOrder,
            status: order_status_enum_1.OrderStatus.PENDING,
            notes: 'Order created',
        });
        await this.orderStatusHistoryRepository.save(statusHistory);
        return this.orderRepository.findOne({
            where: { id: savedOrder.id },
            relations: ['customer', 'items', 'items.product', 'statusHistory'],
        });
    }
    async findAll() {
        return this.orderRepository.find({
            relations: ['customer', 'items', 'items.product', 'statusHistory'],
            order: {
                createdAt: 'DESC',
            },
        });
    }
    async findById(id) {
        const order = await this.orderRepository.findOne({
            where: { id },
            relations: ['customer', 'items', 'items.product', 'statusHistory'],
        });
        if (!order) {
            throw new common_1.NotFoundException(`Order with ID ${id} not found`);
        }
        return order;
    }
    async update(id, updateOrderDto) {
        const order = await this.findById(id);
        if (updateOrderDto.status && updateOrderDto.status !== order.status) {
            const statusHistory = this.orderStatusHistoryRepository.create({
                order,
                status: updateOrderDto.status,
                notes: updateOrderDto.notes || `Status changed to ${updateOrderDto.status}`,
            });
            await this.orderStatusHistoryRepository.save(statusHistory);
        }
        Object.assign(order, updateOrderDto);
        return this.orderRepository.save(order);
    }
    async updateStatus(id, statusDto) {
        const order = await this.findById(id);
        const statusHistory = this.orderStatusHistoryRepository.create({
            order,
            status: statusDto.status,
            notes: statusDto.notes || `Status changed to ${statusDto.status}`,
        });
        await this.orderStatusHistoryRepository.save(statusHistory);
        order.status = statusDto.status;
        if (statusDto.status === order_status_enum_1.OrderStatus.CANCELLED || statusDto.status === order_status_enum_1.OrderStatus.REFUNDED) {
            for (const item of order.items) {
                await this.productRepository.update(item.product.id, {
                    reservedQuantity: () => `reservedQuantity - ${item.quantity}`,
                    quantity: () => `quantity + ${item.quantity}`,
                });
            }
        }
        return this.orderRepository.save(order);
    }
    async remove(id) {
        const order = await this.findById(id);
        for (const item of order.items) {
            await this.productRepository.update(item.product.id, {
                reservedQuantity: () => `reservedQuantity - ${item.quantity}`,
            });
        }
        await this.orderRepository.remove(order);
    }
    async getOrdersByStatus(status) {
        return this.orderRepository.find({
            where: { status },
            relations: ['customer', 'items', 'items.product'],
            order: {
                createdAt: 'DESC',
            },
        });
    }
    async getOrdersByCustomer(customerId) {
        return this.orderRepository.find({
            where: { customer: { id: customerId } },
            relations: ['customer', 'items', 'items.product'],
            order: {
                createdAt: 'DESC',
            },
        });
    }
    async count() {
        return this.orderRepository.count();
    }
    async countByStatus() {
        return this.orderRepository
            .createQueryBuilder('order')
            .select('order.status')
            .addSelect('COUNT(*)', 'count')
            .groupBy('order.status')
            .getRawMany();
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(order_item_entity_1.OrderItem)),
    __param(2, (0, typeorm_1.InjectRepository)(order_status_history_entity_1.OrderStatusHistory)),
    __param(3, (0, typeorm_1.InjectRepository)(customer_entity_1.Customer)),
    __param(4, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(5, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], OrdersService);
//# sourceMappingURL=orders.service.js.map