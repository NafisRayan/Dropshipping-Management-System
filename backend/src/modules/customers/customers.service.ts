import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { Address } from './entities/address.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CreateAddressDto } from './dto/create-address.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto, userId: string): Promise<Customer> {
    const existingCustomer = await this.customerRepository.findOne({
      where: { email: createCustomerDto.email },
    });

    if (existingCustomer) {
      throw new ConflictException('Customer with this email already exists');
    }

    const customer = this.customerRepository.create({
      ...createCustomerDto,
      createdBy: { id: userId } as any,
    });

    return this.customerRepository.save(customer);
  }

  async findAll(): Promise<Customer[]> {
    return this.customerRepository.find({
      relations: ['addresses', 'orders'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findById(id: string): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { id },
      relations: ['addresses', 'orders', 'orders.items'],
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    return customer;
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
    const customer = await this.findById(id);

    // Check if email is being changed and if it's already taken
    if (updateCustomerDto.email && updateCustomerDto.email !== customer.email) {
      const existingCustomer = await this.customerRepository.findOne({
        where: { email: updateCustomerDto.email },
      });
      if (existingCustomer) {
        throw new ConflictException('Email is already taken');
      }
    }

    Object.assign(customer, updateCustomerDto);
    return this.customerRepository.save(customer);
  }

  async remove(id: string): Promise<void> {
    const customer = await this.findById(id);
    await this.customerRepository.remove(customer);
  }

  async addAddress(customerId: string, createAddressDto: CreateAddressDto): Promise<Address> {
    const customer = await this.findById(customerId);
    
    const address = this.addressRepository.create({
      ...createAddressDto,
      customer,
    });

    // If this is the first address or isDefault is true, set it as default
    const existingAddresses = await this.addressRepository.find({
      where: { customer: { id: customerId } },
    });

    if (existingAddresses.length === 0 || createAddressDto.isDefault) {
      // Set all other addresses as non-default
      await this.addressRepository.update(
        { customer: { id: customerId } },
        { isDefault: false },
      );
      address.isDefault = true;
    }

    return this.addressRepository.save(address);
  }

  async updateAddress(addressId: string, updateAddressDto: any): Promise<Address> {
    const address = await this.addressRepository.findOne({
      where: { id: addressId },
      relations: ['customer'],
    });

    if (!address) {
      throw new NotFoundException(`Address with ID ${addressId} not found`);
    }

    if (updateAddressDto.isDefault) {
      // Set all other addresses as non-default
      await this.addressRepository.update(
        { customer: { id: address.customer.id } },
        { isDefault: false },
      );
    }

    Object.assign(address, updateAddressDto);
    return this.addressRepository.save(address);
  }

  async removeAddress(addressId: string): Promise<void> {
    const address = await this.addressRepository.findOne({
      where: { id: addressId },
    });

    if (!address) {
      throw new NotFoundException(`Address with ID ${addressId} not found`);
    }

    await this.addressRepository.remove(address);
  }

  async count(): Promise<number> {
    return this.customerRepository.count();
  }

  async search(query: string): Promise<Customer[]> {
    return this.customerRepository.find({
      where: [
        { firstName: Like(`%${query}%`) },
        { lastName: Like(`%${query}%`) },
        { email: Like(`%${query}%`) },
        { company: Like(`%${query}%`) },
      ],
      relations: ['addresses'],
      take: 10,
    });
  }
}