import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { OrderStatusHistory } from './entities/order-status-history.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderStatusDto } from './dto/order-status.dto';
import { OrderStatus } from '@/common/enums/order-status.enum';
import { Customer } from '@/modules/customers/entities/customer.entity';
import { Product } from '@/modules/products/entities/product.entity';
import { User } from '@/modules/users/entities/user.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(OrderStatusHistory)
    private orderStatusHistoryRepository: Repository<OrderStatusHistory>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createOrderDto: CreateOrderDto, userId: string): Promise<Order> {
    // Validate customer exists
    const customer = await this.customerRepository.findOne({
      where: { id: createOrderDto.customerId },
    });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    // Validate all products exist and have sufficient stock
    const productIds = createOrderDto.items.map(item => item.productId);
    const products = await this.productRepository.findBy({ id: In(productIds) });
    
    if (products.length !== productIds.length) {
      throw new BadRequestException('Some products not found');
    }

    // Check stock availability
    for (const item of createOrderDto.items) {
      const product = products.find(p => p.id === item.productId);
      if (product.availableQuantity < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for product ${product.name}. Available: ${product.availableQuantity}, Requested: ${item.quantity}`,
        );
      }
    }

    // Get the user who created the order
    const user = await this.userRepository.findOne({ where: { id: userId } });

    // Calculate totals
    let subtotal = 0;
    const orderItems: OrderItem[] = [];

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

    // Create order
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

    // Save order and order items
    const savedOrder = await this.orderRepository.save(order);

    // Update product quantities (reserve stock)
    for (const item of orderItems) {
      await this.productRepository.update(item.product.id, {
        reservedQuantity: () => `reservedQuantity + ${item.quantity}`,
      });
    }

    // Create initial status history
    const statusHistory = this.orderStatusHistoryRepository.create({
      order: savedOrder,
      status: OrderStatus.PENDING,
      notes: 'Order created',
    });
    await this.orderStatusHistoryRepository.save(statusHistory);

    return this.orderRepository.findOne({
      where: { id: savedOrder.id },
      relations: ['customer', 'items', 'items.product', 'statusHistory'],
    });
  }

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find({
      relations: ['customer', 'items', 'items.product', 'statusHistory'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findById(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['customer', 'items', 'items.product', 'statusHistory'],
    });
    
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    
    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findById(id);

    // If status is being updated, create status history
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

  async updateStatus(id: string, statusDto: OrderStatusDto): Promise<Order> {
    const order = await this.findById(id);

    // Create status history
    const statusHistory = this.orderStatusHistoryRepository.create({
      order,
      status: statusDto.status,
      notes: statusDto.notes || `Status changed to ${statusDto.status}`,
    });
    await this.orderStatusHistoryRepository.save(statusHistory);

    order.status = statusDto.status;
    
    // If order is cancelled or refunded, release reserved stock
    if (statusDto.status === OrderStatus.CANCELLED || statusDto.status === OrderStatus.REFUNDED) {
      for (const item of order.items) {
        await this.productRepository.update(item.product.id, {
          reservedQuantity: () => `reservedQuantity - ${item.quantity}`,
          quantity: () => `quantity + ${item.quantity}`,
        });
      }
    }

    return this.orderRepository.save(order);
  }

  async remove(id: string): Promise<void> {
    const order = await this.findById(id);
    
    // Release reserved stock
    for (const item of order.items) {
      await this.productRepository.update(item.product.id, {
        reservedQuantity: () => `reservedQuantity - ${item.quantity}`,
      });
    }
    
    await this.orderRepository.remove(order);
  }

  async getOrdersByStatus(status: OrderStatus): Promise<Order[]> {
    return this.orderRepository.find({
      where: { status },
      relations: ['customer', 'items', 'items.product'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async getOrdersByCustomer(customerId: string): Promise<Order[]> {
    return this.orderRepository.find({
      where: { customer: { id: customerId } },
      relations: ['customer', 'items', 'items.product'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async count(): Promise<number> {
    return this.orderRepository.count();
  }

  async countByStatus(): Promise<{ status: string; count: number }[]> {
    return this.orderRepository
      .createQueryBuilder('order')
      .select('order.status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('order.status')
      .getRawMany();
  }
}