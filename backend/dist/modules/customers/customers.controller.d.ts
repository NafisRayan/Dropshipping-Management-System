import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CreateAddressDto } from './dto/create-address.dto';
import { User } from '@/modules/users/entities/user.entity';
export declare class CustomersController {
    private readonly customersService;
    constructor(customersService: CustomersService);
    create(createCustomerDto: CreateCustomerDto, user: User): Promise<import("./entities/customer.entity").Customer>;
    findAll(): Promise<import("./entities/customer.entity").Customer[]>;
    search(query: string): Promise<import("./entities/customer.entity").Customer[]>;
    findOne(id: string): Promise<import("./entities/customer.entity").Customer>;
    update(id: string, updateCustomerDto: UpdateCustomerDto): Promise<import("./entities/customer.entity").Customer>;
    remove(id: string): Promise<void>;
    addAddress(customerId: string, createAddressDto: CreateAddressDto): Promise<import("./entities/address.entity").Address>;
    updateAddress(customerId: string, addressId: string, updateAddressDto: any): Promise<import("./entities/address.entity").Address>;
    removeAddress(customerId: string, addressId: string): Promise<void>;
}
