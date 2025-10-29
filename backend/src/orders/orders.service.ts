import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './order.entity';
import { OrderItem } from './order-item.entity';
import { CreateOrderDto, UpdateOrderDto } from './dto/order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const orderNumber = `ORD-${Date.now()}`;
    
    const order = this.ordersRepository.create({
      ...createOrderDto,
      orderNumber,
    });
    
    const savedOrder = await this.ordersRepository.save(order);

    // Create order items
    if (createOrderDto.orderItems && createOrderDto.orderItems.length > 0) {
      const orderItems = createOrderDto.orderItems.map(item => 
        this.orderItemsRepository.create({
          ...item,
          orderId: savedOrder.id,
        })
      );
      await this.orderItemsRepository.save(orderItems);
    }

    return this.findOne(savedOrder.id);
  }

  async findAll(): Promise<Order[]> {
    return this.ordersRepository.find({
      relations: ['user', 'orderItems', 'orderItems.product'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['user', 'orderItems', 'orderItems.product'],
    });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    await this.ordersRepository.update(id, updateOrderDto);
    return this.findOne(id);
  }

  async updateStatus(id: number, status: OrderStatus): Promise<Order> {
    await this.ordersRepository.update(id, { status });
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.ordersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
  }

  async findByUser(userId: number): Promise<Order[]> {
    return this.ordersRepository.find({
      where: { userId },
      relations: ['orderItems', 'orderItems.product'],
      order: { createdAt: 'DESC' },
    });
  }
}