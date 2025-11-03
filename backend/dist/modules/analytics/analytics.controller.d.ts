import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    getDashboardMetrics(): Promise<{
        totalOrders: number;
        totalProducts: number;
        totalCustomers: number;
        totalUsers: number;
        totalRevenue: number;
        recentOrders: import("../orders/entities/order.entity").Order[];
        ordersByStatus: any[];
    }>;
    getRevenueAnalytics(days?: number): Promise<{
        date: any;
        revenue: number;
    }[]>;
    getProductAnalytics(): Promise<{
        topProducts: any[];
        lowStockProducts: import("../products/entities/product.entity").Product[];
    }>;
    getCustomerAnalytics(): Promise<{
        topCustomers: any[];
        newCustomers: number;
    }>;
}
