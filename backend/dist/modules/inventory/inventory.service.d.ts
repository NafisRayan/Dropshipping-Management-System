import { Repository } from 'typeorm';
import { InventoryLog } from './entities/inventory-log.entity';
import { ProductsService } from '@/modules/products/products.service';
import { InventoryChangeType } from '@/common/enums/inventory-change-type.enum';
export declare class InventoryService {
    private inventoryLogRepository;
    private productsService;
    constructor(inventoryLogRepository: Repository<InventoryLog>, productsService: ProductsService);
    logInventoryChange(productId: string, changeType: InventoryChangeType, quantityChange: number, referenceId?: string, notes?: string): Promise<InventoryLog>;
    getInventoryLogs(productId?: string): Promise<InventoryLog[]>;
    adjustInventory(productId: string, adjustment: number, reason: string, userId: string): Promise<InventoryLog>;
    receiveInventory(productId: string, quantity: number, referenceId?: string, notes?: string): Promise<InventoryLog>;
}
