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
exports.CustomersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const customer_entity_1 = require("./entities/customer.entity");
const address_entity_1 = require("./entities/address.entity");
let CustomersService = class CustomersService {
    constructor(customerRepository, addressRepository) {
        this.customerRepository = customerRepository;
        this.addressRepository = addressRepository;
    }
    async create(createCustomerDto, userId) {
        const existingCustomer = await this.customerRepository.findOne({
            where: { email: createCustomerDto.email },
        });
        if (existingCustomer) {
            throw new common_1.ConflictException('Customer with this email already exists');
        }
        const customer = this.customerRepository.create({
            ...createCustomerDto,
            createdBy: { id: userId },
        });
        return this.customerRepository.save(customer);
    }
    async findAll() {
        return this.customerRepository.find({
            relations: ['addresses', 'orders'],
            order: {
                createdAt: 'DESC',
            },
        });
    }
    async findById(id) {
        const customer = await this.customerRepository.findOne({
            where: { id },
            relations: ['addresses', 'orders', 'orders.items'],
        });
        if (!customer) {
            throw new common_1.NotFoundException(`Customer with ID ${id} not found`);
        }
        return customer;
    }
    async update(id, updateCustomerDto) {
        const customer = await this.findById(id);
        if (updateCustomerDto.email && updateCustomerDto.email !== customer.email) {
            const existingCustomer = await this.customerRepository.findOne({
                where: { email: updateCustomerDto.email },
            });
            if (existingCustomer) {
                throw new common_1.ConflictException('Email is already taken');
            }
        }
        Object.assign(customer, updateCustomerDto);
        return this.customerRepository.save(customer);
    }
    async remove(id) {
        const customer = await this.findById(id);
        await this.customerRepository.remove(customer);
    }
    async addAddress(customerId, createAddressDto) {
        const customer = await this.findById(customerId);
        const address = this.addressRepository.create({
            ...createAddressDto,
            customer,
        });
        const existingAddresses = await this.addressRepository.find({
            where: { customer: { id: customerId } },
        });
        if (existingAddresses.length === 0 || createAddressDto.isDefault) {
            await this.addressRepository.update({ customer: { id: customerId } }, { isDefault: false });
            address.isDefault = true;
        }
        return this.addressRepository.save(address);
    }
    async updateAddress(addressId, updateAddressDto) {
        const address = await this.addressRepository.findOne({
            where: { id: addressId },
            relations: ['customer'],
        });
        if (!address) {
            throw new common_1.NotFoundException(`Address with ID ${addressId} not found`);
        }
        if (updateAddressDto.isDefault) {
            await this.addressRepository.update({ customer: { id: address.customer.id } }, { isDefault: false });
        }
        Object.assign(address, updateAddressDto);
        return this.addressRepository.save(address);
    }
    async removeAddress(addressId) {
        const address = await this.addressRepository.findOne({
            where: { id: addressId },
        });
        if (!address) {
            throw new common_1.NotFoundException(`Address with ID ${addressId} not found`);
        }
        await this.addressRepository.remove(address);
    }
    async count() {
        return this.customerRepository.count();
    }
    async search(query) {
        return this.customerRepository.find({
            where: [
                { firstName: (0, typeorm_2.Like)(`%${query}%`) },
                { lastName: (0, typeorm_2.Like)(`%${query}%`) },
                { email: (0, typeorm_2.Like)(`%${query}%`) },
                { company: (0, typeorm_2.Like)(`%${query}%`) },
            ],
            relations: ['addresses'],
            take: 10,
        });
    }
};
exports.CustomersService = CustomersService;
exports.CustomersService = CustomersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(customer_entity_1.Customer)),
    __param(1, (0, typeorm_1.InjectRepository)(address_entity_1.Address)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], CustomersService);
//# sourceMappingURL=customers.service.js.map