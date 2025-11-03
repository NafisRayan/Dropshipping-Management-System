import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryLog } from './entities/inventory-log.entity';
import { ProductsService } from '@/modules/products/products.service';
import { InventoryChangeType } from '@/common/enums/inventory-change-type.enum';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(InventoryLog)
    private inventoryLogRepository: Repository<InventoryLog>,
    private productsService: ProductsService,
  ) {}

  async logInventoryChange(
    productId: string,
    changeType: InventoryChangeType,
    quantityChange: number,
    referenceId?: string,
    notes?: string,
  ): Promise<InventoryLog> {
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

  async getInventoryLogs(productId?: string): Promise<InventoryLog[]> {
    const where = productId ? { product: { id: productId } } : {};
    
    return this.inventoryLogRepository.find({
      where,
      relations: ['product'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async adjustInventory(
    productId: string,
    adjustment: number,
    reason: string,
    userId: string,
  ): Promise<InventoryLog> {
    const product = await this.productsService.findById(productId);
    
    // Update product quantity
    await this.productsService.update(productId, {
      quantity: product.quantity + adjustment,
    });

    // Log the adjustment
    return this.logInventoryChange(
      productId,
      InventoryChangeType.ADJUSTMENT,
      adjustment,
      undefined,
      `Inventory adjustment: ${reason} by user ${userId}`,
    );
  }

  async receiveInventory(
    productId: string,
    quantity: number,
    referenceId?: string,
    notes?: string,
  ): Promise<InventoryLog> {
    const product = await this.productsService.findById(productId);
    
    // Update product quantity
    await this.productsService.update(productId, {
      quantity: product.quantity + quantity,
    });

    // Log the receipt
    return this.logInventoryChange(
      productId,
      InventoryChangeType.RECEIPT,
      quantity,
      referenceId,
      notes || 'Inventory received',
    );
  }
}