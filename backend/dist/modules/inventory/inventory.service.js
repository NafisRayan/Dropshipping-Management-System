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
exports.InventoryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const inventory_log_entity_1 = require("./entities/inventory-log.entity");
const products_service_1 = require("../products/products.service");
const inventory_change_type_enum_1 = require("../../common/enums/inventory-change-type.enum");
let InventoryService = class InventoryService {
    constructor(inventoryLogRepository, productsService) {
        this.inventoryLogRepository = inventoryLogRepository;
        this.productsService = productsService;
    }
    async logInventoryChange(productId, changeType, quantityChange, referenceId, notes) {
        const product = await this.productsService.findById(productId);
        const log = this.inventoryLogRepository.create({
            product,
            changeType,
            quantityChange,
            previousQuantity: product.quantity,
            newQuantity: product.quantity + quantityChange,
            referenceId,
            notes,
        });
        return this.inventoryLogRepository.save(log);
    }
    async getInventoryLogs(productId) {
        const where = productId ? { product: { id: productId } } : {};
        return this.inventoryLogRepository.find({
            where,
            relations: ['product'],
            order: {
                createdAt: 'DESC',
            },
        });
    }
    async adjustInventory(productId, adjustment, reason, userId) {
        const product = await this.productsService.findById(productId);
        await this.productsService.update(productId, {
            quantity: product.quantity + adjustment,
        });
        return this.logInventoryChange(productId, inventory_change_type_enum_1.InventoryChangeType.ADJUSTMENT, adjustment, undefined, `Inventory adjustment: ${reason} by user ${userId}`);
    }
    async receiveInventory(productId, quantity, referenceId, notes) {
        const product = await this.productsService.findById(productId);
        await this.productsService.update(productId, {
            quantity: product.quantity + quantity,
        });
        return this.logInventoryChange(productId, inventory_change_type_enum_1.InventoryChangeType.RECEIPT, quantity, referenceId, notes || 'Inventory received');
    }
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(inventory_log_entity_1.InventoryLog)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        products_service_1.ProductsService])
], InventoryService);
//# sourceMappingURL=inventory.service.js.map