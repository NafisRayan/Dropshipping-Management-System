import { InventoryService } from './inventory.service';
import { User } from '@/modules/users/entities/user.entity';
export declare class InventoryController {
    private readonly inventoryService;
    constructor(inventoryService: InventoryService);
    findAll(): Promise<import("./entities/inventory-log.entity").InventoryLog[]>;
    findByProduct(productId: string): Promise<import("./entities/inventory-log.entity").InventoryLog[]>;
    adjustInventory(body: {
        productId: string;
        adjustment: number;
        reason: string;
    }, user: User): Promise<import("./entities/inventory-log.entity").InventoryLog>;
    receiveInventory(body: {
        productId: string;
        quantity: number;
        referenceId?: string;
        notes?: string;
    }): Promise<import("./entities/inventory-log.entity").InventoryLog>;
}
