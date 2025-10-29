import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../entities/customer.entity';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  async create(createCustomerDto: { firstName: string; lastName: string; email: string; phone?: string; address?: string }): Promise<Customer> {
    const customer = this.customerRepository.create(createCustomerDto);
    return this.customerRepository.save(customer);
  }

  async findAll(): Promise<Customer[]> {
    return this.customerRepository.find({ relations: ['orders'] });
  }

  async findOne(id: number): Promise<Customer | null> {
    return this.customerRepository.findOne({ where: { id }, relations: ['orders'] });
  }

  async update(id: number, updateCustomerDto: Partial<{ firstName: string; lastName: string; email: string; phone?: string; address?: string }>): Promise<Customer | null> {
    await this.customerRepository.update(id, updateCustomerDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.customerRepository.delete(id);
  }
}