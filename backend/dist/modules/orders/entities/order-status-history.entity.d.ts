import { Order } from './order.entity';
import { OrderStatus } from '@/common/enums/order-status.enum';
export declare class OrderStatusHistory {
    id: string;
    order: Order;
    status: OrderStatus;
    notes: string;
    createdAt: Date;
}
