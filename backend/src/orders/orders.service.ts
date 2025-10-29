import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { Order, OrderStatus } from '../entities/order.entity';
import { Product } from '../entities/product.entity';
import { Customer } from '../entities/customer.entity';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    private readonly httpService: HttpService,
  ) {}

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find({ relations: ['product', 'customer'] });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['product', 'customer'],
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
    let customer: Customer | null = null;
    if (createOrderDto.customerId) {
      customer = await this.customerRepository.findOne({
        where: { id: createOrderDto.customerId },
      });
      if (!customer) {
        throw new NotFoundException(`Customer with ID ${createOrderDto.customerId} not found`);
      }
    }
    const { customerId, ...orderData } = createOrderDto;
    const order = this.orderRepository.create({
      ...orderData,
      product,
      customer: customer || undefined,
      status: OrderStatus.PENDING,
    });
    await this.orderRepository.save(order);
    product.stock -= createOrderDto.quantity;
    await this.productRepository.save(product);

    // Auto-forward order to supplier if supplier has API details
    if (product.supplier && product.supplier.apiUrl && product.supplier.apiKey) {
      await this.forwardOrderToSupplier(order, product.supplier);
    }

    return order;
  }

  async update(id: number, updateOrderDto: Partial<CreateOrderDto & { status: OrderStatus; trackingNumber?: string }>): Promise<Order> {
    const order = await this.findOne(id);
    if (updateOrderDto.customerId !== undefined) {
      if (updateOrderDto.customerId) {
        const customer = await this.customerRepository.findOne({
          where: { id: updateOrderDto.customerId },
        });
        if (!customer) {
          throw new NotFoundException(`Customer with ID ${updateOrderDto.customerId} not found`);
        }
        order.customer = customer;
      } else {
        (order.customer as any) = null;
      }
    }
    const { customerId, status, trackingNumber, ...orderData } = updateOrderDto;

    // Handle status transitions
    if (status && status !== order.status) {
      if (status === OrderStatus.SHIPPED) {
        order.shippedAt = new Date();
      } else if (status === OrderStatus.DELIVERED) {
        if (order.status !== OrderStatus.SHIPPED) {
          throw new BadRequestException('Order must be shipped before it can be delivered');
        }
        order.deliveredAt = new Date();
      }
      order.status = status;
    }

    // Update tracking number if provided
    if (trackingNumber !== undefined) {
      order.trackingNumber = trackingNumber;
    }

    Object.assign(order, orderData);
    return this.orderRepository.save(order);
  }

  async remove(id: number): Promise<void> {
    const order = await this.findOne(id);
    await this.orderRepository.remove(order);
  }

  private async forwardOrderToSupplier(order: Order, supplier: any): Promise<void> {
    try {
      const payload = {
        orderId: order.id,
        productId: order.product.id,
        quantity: order.quantity,
        customerEmail: order.customer?.email,
        customerAddress: order.customer?.address,
        // Add other necessary fields
      };

      await this.httpService.post(`${supplier.apiUrl}/orders`, payload, {
        headers: {
          'Authorization': `Bearer ${supplier.apiKey}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error(`Failed to forward order ${order.id} to supplier ${supplier.name}:`, error.message);
      // Optionally, you could throw an error or handle it differently
    }
  }
}
