import { OrderItem } from '@/modules/orders/entities/order-item.entity';
import { InventoryLog } from '@/modules/inventory/entities/inventory-log.entity';
export declare class Product {
    id: string;
    name: string;
    description: string;
    sku: string;
    costPrice: number;
    sellingPrice: number;
    quantity: number;
    reservedQuantity: number;
    weight: number;
    dimensions: string;
    category: string;
    brand: string;
    supplierId: string;
    supplierProductId: string;
    images: string[];
    isActive: boolean;
    orderItems: OrderItem[];
    inventoryLogs: InventoryLog[];
    createdAt: Date;
    updatedAt: Date;
    get availableQuantity(): number;
    get profitMargin(): number;
    get isInStock(): boolean;
    get isLowStock(): boolean;
    get isOutOfStock(): boolean;
}
