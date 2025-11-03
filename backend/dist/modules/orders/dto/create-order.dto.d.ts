declare class OrderItemDto {
    productId: string;
    quantity: number;
    unitPrice: number;
}
export declare class CreateOrderDto {
    customerId: string;
    shippingCost?: number;
    taxAmount?: number;
    notes?: string;
    items: OrderItemDto[];
}
export {};
