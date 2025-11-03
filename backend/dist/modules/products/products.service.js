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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("./entities/product.entity");
let ProductsService = class ProductsService {
    constructor(productRepository) {
        this.productRepository = productRepository;
    }
    async create(createProductDto) {
        const existingProduct = await this.productRepository.findOne({
            where: { sku: createProductDto.sku },
        });
        if (existingProduct) {
            throw new common_1.ConflictException('Product with this SKU already exists');
        }
        const product = this.productRepository.create(createProductDto);
        return this.productRepository.save(product);
    }
    async findAll(filterDto) {
        const { search, category, brand, supplierId, isActive, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC', } = filterDto;
        const queryBuilder = this.productRepository.createQueryBuilder('product');
        if (search) {
            queryBuilder.where('product.name LIKE :search OR product.description LIKE :search OR product.sku LIKE :search', { search: `%${search}%` });
        }
        if (category) {
            queryBuilder.andWhere('product.category = :category', { category });
        }
        if (brand) {
            queryBuilder.andWhere('product.brand = :brand', { brand });
        }
        if (supplierId) {
            queryBuilder.andWhere('product.supplierId = :supplierId', { supplierId });
        }
        if (isActive !== undefined) {
            queryBuilder.andWhere('product.isActive = :isActive', { isActive });
        }
        queryBuilder.orderBy(`product.${sortBy}`, sortOrder);
        queryBuilder.skip((page - 1) * limit);
        queryBuilder.take(limit);
        const [data, total] = await queryBuilder.getManyAndCount();
        return { data, total };
    }
    async findById(id) {
        const product = await this.productRepository.findOne({ where: { id } });
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        }
        return product;
    }
    async findBySku(sku) {
        const product = await this.productRepository.findOne({ where: { sku } });
        if (!product) {
            throw new common_1.NotFoundException(`Product with SKU ${sku} not found`);
        }
        return product;
    }
    async update(id, updateProductDto) {
        const product = await this.findById(id);
        if (updateProductDto.sku && updateProductDto.sku !== product.sku) {
            const existingProduct = await this.productRepository.findOne({
                where: { sku: updateProductDto.sku },
            });
            if (existingProduct) {
                throw new common_1.ConflictException('Product with this SKU already exists');
            }
        }
        Object.assign(product, updateProductDto);
        return this.productRepository.save(product);
    }
    async remove(id) {
        const product = await this.findById(id);
        await this.productRepository.remove(product);
    }
    async updateInventory(id, quantityChange, changeType) {
        const product = await this.findById(id);
        product.quantity += quantityChange;
        if (product.quantity < 0) {
            product.quantity = 0;
        }
        return this.productRepository.save(product);
    }
    async getLowStockProducts() {
        return this.productRepository.find({
            where: {
                quantity: 10,
                isActive: true,
            },
            order: {
                quantity: 'ASC',
            },
        });
    }
    async count() {
        return this.productRepository.count();
    }
    async countByCategory() {
        return this.productRepository
            .createQueryBuilder('product')
            .select('product.category')
            .addSelect('COUNT(*)', 'count')
            .where('product.category IS NOT NULL')
            .groupBy('product.category')
            .getRawMany();
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ProductsService);
//# sourceMappingURL=products.service.js.map