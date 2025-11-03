import { Order } from '@/modules/orders/entities/order.entity';
import { Address } from './address.entity';
import { User } from '@/modules/users/entities/user.entity';
export declare class Customer {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    company: string;
    addresses: Address[];
    orders: Order[];
    createdBy: User;
    createdAt: Date;
    updatedAt: Date;
    get fullName(): string;
    get orderCount(): number;
    get totalSpent(): number;
}
