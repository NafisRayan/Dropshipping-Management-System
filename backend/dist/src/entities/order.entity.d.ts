export declare enum OrderStatus {
    PENDING = "pending",
    SHIPPED = "shipped",
    DELIVERED = "delivered",
    CANCELLED = "cancelled"
}
export declare class Order {
    id: number;
    customerId: string;
    productId: number;
    quantity: number;
    status: OrderStatus;
    createdAt: Date;
}
