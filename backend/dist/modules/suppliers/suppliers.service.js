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
exports.SuppliersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const supplier_entity_1 = require("./entities/supplier.entity");
let SuppliersService = class SuppliersService {
    constructor(supplierRepository) {
        this.supplierRepository = supplierRepository;
    }
    async create(createSupplierDto) {
        const existingSupplier = await this.supplierRepository.findOne({
            where: { name: createSupplierDto.name },
        });
        if (existingSupplier) {
            throw new common_1.ConflictException('Supplier with this name already exists');
        }
        const supplier = this.supplierRepository.create(createSupplierDto);
        return this.supplierRepository.save(supplier);
    }
    async findAll() {
        return this.supplierRepository.find({
            order: {
                name: 'ASC',
            },
        });
    }
    async findById(id) {
        const supplier = await this.supplierRepository.findOne({ where: { id } });
        if (!supplier) {
            throw new common_1.NotFoundException(`Supplier with ID ${id} not found`);
        }
        return supplier;
    }
    async update(id, updateSupplierDto) {
        const supplier = await this.findById(id);
        if (updateSupplierDto.name && updateSupplierDto.name !== supplier.name) {
            const existingSupplier = await this.supplierRepository.findOne({
                where: { name: updateSupplierDto.name },
            });
            if (existingSupplier) {
                throw new common_1.ConflictException('Supplier with this name already exists');
            }
        }
        Object.assign(supplier, updateSupplierDto);
        return this.supplierRepository.save(supplier);
    }
    async remove(id) {
        const supplier = await this.findById(id);
        await this.supplierRepository.remove(supplier);
    }
    async syncInventory(id) {
        const supplier = await this.findById(id);
        supplier.lastSyncAt = new Date();
        await this.supplierRepository.save(supplier);
    }
    async count() {
        return this.supplierRepository.count();
    }
};
exports.SuppliersService = SuppliersService;
exports.SuppliersService = SuppliersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(supplier_entity_1.Supplier)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SuppliersService);
//# sourceMappingURL=suppliers.service.js.map