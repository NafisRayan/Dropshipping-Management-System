import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './customer.entity';
import { CreateCustomerDto, UpdateCustomerDto } from './dto/customer.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private customersRepository: Repository<Customer>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    const customer = this.customersRepository.create(createCustomerDto);
    return this.customersRepository.save(customer);
  }

  async findAll(): Promise<Customer[]> {
    return this.customersRepository.find({
      relations: ['orders'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Customer> {
    const customer = await this.customersRepository.findOne({
      where: { id },
      relations: ['orders', 'orders.orderItems', 'orders.orderItems.product'],
    });
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    return customer;
  }

  async findByEmail(email: string): Promise<Customer | undefined> {
    return this.customersRepository.findOne({ 
      where: { email },
      relations: ['orders'],
    });
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
    await this.customersRepository.update(id, updateCustomerDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.customersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
  }

  async getCustomerStats(id: number) {
    const customer = await this.findOne(id);
    const orders = customer.orders || [];
    
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, order) => sum + parseFloat(order.totalAmount.toString()), 0);
    const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;
    
    return {
      customer,
      stats: {
        totalOrders,
        totalSpent,
        averageOrderValue,
        lastOrderDate: orders.length > 0 ? orders[0].createdAt : null,
      },
    };
  }
}