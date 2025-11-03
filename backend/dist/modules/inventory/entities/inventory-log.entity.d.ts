import { Product } from '@/modules/products/entities/product.entity';
import { InventoryChangeType } from '@/common/enums/inventory-change-type.enum';
export declare class InventoryLog {
    id: string;
    product: Product;
    changeType: InventoryChangeType;
    quantityChange: number;
    previousQuantity: number;
    newQuantity: number;
    referenceId: string;
    notes: string;
    createdAt: Date;
}
