import { Order } from './order.entity';
import { Product } from '@/modules/products/entities/product.entity';
export declare class OrderItem {
    id: string;
    order: Order;
    product: Product;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    supplierOrderItemId: string;
    get productName(): string;
    get productSku(): string;
}
