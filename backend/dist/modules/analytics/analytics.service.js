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
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("../orders/entities/order.entity");
const product_entity_1 = require("../products/entities/product.entity");
const customer_entity_1 = require("../customers/entities/customer.entity");
const user_entity_1 = require("../users/entities/user.entity");
let AnalyticsService = class AnalyticsService {
    constructor(orderRepository, productRepository, customerRepository, userRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.customerRepository = customerRepository;
        this.userRepository = userRepository;
    }
    async getDashboardMetrics() {
        const totalOrders = await this.orderRepository.count();
        const totalProducts = await this.productRepository.count();
        const totalCustomers = await this.customerRepository.count();
        const totalUsers = await this.userRepository.count();
        const totalRevenue = await this.orderRepository
            .createQueryBuilder('order')
            .select('SUM(order.totalAmount)', 'total')
            .where('order.status IN (:...statuses)', {
            statuses: ['delivered', 'shipped'],
        })
            .getRawOne();
        const recentOrders = await this.orderRepository.find({
            order: { createdAt: 'DESC' },
            take: 5,
            relations: ['customer'],
        });
        const ordersByStatus = await this.orderRepository
            .createQueryBuilder('order')
            .select('order.status')
            .addSelect('COUNT(*)', 'count')
            .groupBy('order.status')
            .getRawMany();
        return {
            totalOrders,
            totalProducts,
            totalCustomers,
            totalUsers,
            totalRevenue: parseFloat(totalRevenue?.total || 0),
            recentOrders,
            ordersByStatus,
        };
    }
    async getRevenueAnalytics(days = 30) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        const revenueData = await this.orderRepository
            .createQueryBuilder('order')
            .select('DATE(order.createdAt)', 'date')
            .addSelect('SUM(order.totalAmount)', 'revenue')
            .where('order.createdAt >= :startDate', { startDate })
            .andWhere('order.status IN (:...statuses)', {
            statuses: ['delivered', 'shipped'],
        })
            .groupBy('DATE(order.createdAt)')
            .orderBy('date', 'ASC')
            .getRawMany();
        return revenueData.map(item => ({
            date: item.date,
            revenue: parseFloat(item.revenue),
        }));
    }
    async getProductAnalytics() {
        const topProducts = await this.orderRepository
            .createQueryBuilder('order')
            .leftJoin('order.items', 'item')
            .select('item.productId', 'productId')
            .addSelect('SUM(item.quantity)', 'totalSold')
            .addSelect('SUM(item.totalPrice)', 'totalRevenue')
            .where('order.status IN (:...statuses)', {
            statuses: ['delivered', 'shipped'],
        })
            .groupBy('item.productId')
            .orderBy('totalSold', 'DESC')
            .limit(10)
            .getRawMany();
        const lowStockProducts = await this.productRepository.find({
            where: {
                quantity: 10,
                isActive: true,
            },
            order: {
                quantity: 'ASC',
            },
        });
        return {
            topProducts,
            lowStockProducts,
        };
    }
    async getCustomerAnalytics() {
        const topCustomers = await this.orderRepository
            .createQueryBuilder('order')
            .select('order.customerId', 'customerId')
            .addSelect('COUNT(*)', 'orderCount')
            .addSelect('SUM(order.totalAmount)', 'totalSpent')
            .where('order.status IN (:...statuses)', {
            statuses: ['delivered', 'shipped'],
        })
            .groupBy('order.customerId')
            .orderBy('totalSpent', 'DESC')
            .limit(10)
            .getRawMany();
        const newCustomers = await this.customerRepository.count({
            where: {
                createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            },
        });
        return {
            topCustomers,
            newCustomers,
        };
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(2, (0, typeorm_1.InjectRepository)(customer_entity_1.Customer)),
    __param(3, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map