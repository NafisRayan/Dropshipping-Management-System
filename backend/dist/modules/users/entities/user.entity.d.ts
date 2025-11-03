import { UserRole } from '@/common/enums/user-role.enum';
import { Order } from '@/modules/orders/entities/order.entity';
import { Customer } from '@/modules/customers/entities/customer.entity';
export declare class User {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    role: UserRole;
    isActive: boolean;
    lastLoginAt: Date;
    orders: Order[];
    customers: Customer[];
    createdAt: Date;
    updatedAt: Date;
    hashPassword(): Promise<void>;
    validatePassword(password: string): Promise<boolean>;
}
