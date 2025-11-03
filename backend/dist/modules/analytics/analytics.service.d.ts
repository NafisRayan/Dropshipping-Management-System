import { Repository } from 'typeorm';
import { Order } from '@/modules/orders/entities/order.entity';
import { Product } from '@/modules/products/entities/product.entity';
import { Customer } from '@/modules/customers/entities/customer.entity';
import { User } from '@/modules/users/entities/user.entity';
export declare class AnalyticsService {
    private orderRepository;
    private productRepository;
    private customerRepository;
    private userRepository;
    constructor(orderRepository: Repository<Order>, productRepository: Repository<Product>, customerRepository: Repository<Customer>, userRepository: Repository<User>);
    getDashboardMetrics(): Promise<{
        totalOrders: number;
        totalProducts: number;
        totalCustomers: number;
        totalUsers: number;
        totalRevenue: number;
        recentOrders: Order[];
        ordersByStatus: any[];
    }>;
    getRevenueAnalytics(days?: number): Promise<{
        date: any;
        revenue: number;
    }[]>;
    getProductAnalytics(): Promise<{
        topProducts: any[];
        lowStockProducts: Product[];
    }>;
    getCustomerAnalytics(): Promise<{
        topCustomers: any[];
        newCustomers: number;
    }>;
}
