import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { Address } from './entities/address.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CreateAddressDto } from './dto/create-address.dto';
export declare class CustomersService {
    private customerRepository;
    private addressRepository;
    constructor(customerRepository: Repository<Customer>, addressRepository: Repository<Address>);
    create(createCustomerDto: CreateCustomerDto, userId: string): Promise<Customer>;
    findAll(): Promise<Customer[]>;
    findById(id: string): Promise<Customer>;
    update(id: string, updateCustomerDto: UpdateCustomerDto): Promise<Customer>;
    remove(id: string): Promise<void>;
    addAddress(customerId: string, createAddressDto: CreateAddressDto): Promise<Address>;
    updateAddress(addressId: string, updateAddressDto: any): Promise<Address>;
    removeAddress(addressId: string): Promise<void>;
    count(): Promise<number>;
    search(query: string): Promise<Customer[]>;
}
