import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { Product } from '../entities/product.entity';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find({ relations: ['product'] });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['product'],
    });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const product = await this.productRepository.findOne({
      where: { id: createOrderDto.productId },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${createOrderDto.productId} not found`);
    }
    if (product.stock < createOrderDto.quantity) {
      throw new BadRequestException('Insufficient stock');
    }
    const order = this.orderRepository.create({
      ...createOrderDto,
      product,
      status: 'pending',
    });
    await this.orderRepository.save(order);
    product.stock -= createOrderDto.quantity;
    await this.productRepository.save(product);
    return order;
  }

  async update(id: number, updateOrderDto: Partial<CreateOrderDto & { status: string }>): Promise<Order> {
    const order = await this.findOne(id);
    Object.assign(order, updateOrderDto);
    return this.orderRepository.save(order);
  }

  async remove(id: number): Promise<void> {
    const order = await this.findOne(id);
    await this.orderRepository.remove(order);
  }
}
