import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';

import { DashboardOverview, DashboardUser } from './dto/dashboard-overview.dto.js';
import { Order, SalesChannel } from '../orders/entities/order.entity.js';
import { OrderItem } from '../orders/entities/order-item.entity.js';
import { Product } from '../products/entities/product.entity.js';
import { Supplier } from '../suppliers/entities/supplier.entity.js';
import { User, UserRole } from '../users/entities/user.entity.js';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderItem) private readonly orderItemRepo: Repository<OrderItem>,
    @InjectRepository(Product) private readonly productRepo: Repository<Product>,
    @InjectRepository(Supplier) private readonly supplierRepo: Repository<Supplier>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async getOverview(): Promise<DashboardOverview> {
    const [orders, users, products, suppliers] = await Promise.all([
      this.orderRepo.find({ order: { orderDate: 'ASC' } }),
      this.userRepo.find(),
      this.productRepo.find(),
      this.supplierRepo.find(),
    ]);

    const userStats = this.computeUserStats(users);
    const monthlyPerformance = this.computeMonthlyPerformance(orders, users);
    const summary = this.computeSummary(monthlyPerformance);
    const channelPerformance = this.computeChannelPerformance(orders);
    const topProducts = await this.computeTopProducts();
    const recentActivities = this.buildRecentActivities(orders, suppliers);
    const teamFocus = this.buildTeamFocus(userStats, suppliers, products);

    const dashboardUsers: DashboardUser[] = users.map((user) => ({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt?.toISOString?.() ?? new Date(user.createdAt).toISOString(),
      updatedAt: user.updatedAt?.toISOString?.() ?? new Date(user.updatedAt).toISOString(),
      fullName: `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || user.email,
    }));

    return {
      summary,
      userStats,
      monthlyPerformance,
      channelPerformance,
      topProducts,
      recentActivities,
      teamFocus,
      users: dashboardUsers,
    } satisfies DashboardOverview;
  }

  private computeUserStats(users: User[]) {
    const totalUsers = users.length;
    const activeUsers = users.filter((user) => user.isActive).length;
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const newUsers30d = users.filter((user) => new Date(user.createdAt) >= thirtyDaysAgo).length;

    const roleCounts = users.reduce(
      (acc, user) => {
        if (user.role === UserRole.ADMIN) acc.admin += 1;
        else if (user.role === UserRole.MANAGER) acc.manager += 1;
        else acc.customer += 1;
        return acc;
      },
      { admin: 0, manager: 0, customer: 0 },
    );

    return {
      totalUsers,
      activeUsers,
      newUsers30d,
      adminUsers: roleCounts.admin,
      managerUsers: roleCounts.manager,
      customerUsers: roleCounts.customer,
    };
  }

  private computeMonthlyPerformance(orders: Order[], users: User[]) {
    const result: {
      month: string;
      revenue: number;
      orders: number;
      profitMargin: number;
      newUsers: number;
      monthStart: Date;
    }[] = [];

    const now = new Date();
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - i, 1);
      const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0, 23, 59, 59, 999);

      const monthOrders = orders.filter(
        (order) => new Date(order.orderDate) >= monthStart && new Date(order.orderDate) <= monthEnd,
      );

      const revenue = monthOrders.reduce((sum, order) => sum + (order.totalAmount ?? 0), 0);
      const profit = monthOrders.reduce((sum, order) => sum + (order.profitMargin ?? 0), 0);
      const monthUsers = users.filter(
        (user) => new Date(user.createdAt) >= monthStart && new Date(user.createdAt) <= monthEnd,
      );

      result.push({
        month: monthStart.toLocaleDateString('en-US', { month: 'short' }),
        revenue,
        orders: monthOrders.length,
        profitMargin: monthOrders.length ? Number(((profit / revenue) * 100 || 0).toFixed(1)) : 0,
        newUsers: monthUsers.length,
        monthStart,
      });
    }

    return result.map(({ month, revenue, orders, profitMargin, newUsers }) => ({
      month,
      revenue,
      orders,
      profitMargin,
      newUsers,
    }));
  }

  private computeSummary(monthlyPerformance: ReturnType<typeof this.computeMonthlyPerformance>) {
    const latest = monthlyPerformance.at(-1) ?? { revenue: 0, orders: 0, profitMargin: 0, newUsers: 0 };
    const previous = monthlyPerformance.at(-2) ?? { revenue: 0, orders: 0, profitMargin: 0, newUsers: 0 };

    const averageOrderValue = latest.orders ? latest.revenue / latest.orders : 0;
    const previousAOV = previous.orders ? previous.revenue / previous.orders : 0;

    return {
      revenue: latest.revenue,
      revenueChange: this.percentageChange(previous.revenue, latest.revenue),
      orders: latest.orders,
      ordersChange: this.percentageChange(previous.orders, latest.orders),
      averageOrderValue: Math.round(averageOrderValue),
      averageOrderValueChange: this.percentageChange(previousAOV, averageOrderValue),
      retentionRate: Number((72 + latest.newUsers * 0.4).toFixed(1)),
      retentionRateChange: Number((latest.newUsers - previous.newUsers).toFixed(1)),
    };
  }

  private computeChannelPerformance(orders: Order[]) {
    const channelTotals = new Map<SalesChannel, { revenue: number; count: number }>();

    orders.forEach((order) => {
      const entry = channelTotals.get(order.channel) ?? { revenue: 0, count: 0 };
      entry.revenue += order.totalAmount ?? 0;
      entry.count += 1;
      channelTotals.set(order.channel, entry);
    });

    const totalRevenue = Array.from(channelTotals.values()).reduce((sum, entry) => sum + entry.revenue, 0) || 1;

    return Array.from(channelTotals.entries()).map(([channel, data]) => ({
      channel,
      revenue: Math.round(data.revenue),
      percentage: Number(((data.revenue / totalRevenue) * 100).toFixed(1)),
    }));
  }

  private async computeTopProducts() {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const items = await this.orderItemRepo.find({
      relations: { order: true, product: true },
      where: {
        order: {
          orderDate: Between(sixMonthsAgo, new Date()),
        },
      },
    });

    const productStats = new Map<string, { name: string; orders: number; revenue: number }>();

    items.forEach((item) => {
      const key = item.product?.sku ?? 'unknown';
      const entry = productStats.get(key) ?? {
        name: item.product?.name ?? 'Unknown Product',
        orders: 0,
        revenue: 0,
      };

      entry.orders += item.quantity;
      entry.revenue += item.totalPrice ?? item.quantity * (item.unitPrice ?? 0);
      productStats.set(key, entry);
    });

    return Array.from(productStats.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 4)
      .map((product) => ({
        name: product.name,
        orders: product.orders,
        revenue: Math.round(product.revenue),
        conversionRate: Number((Math.min(product.orders / 50, 1) * 8).toFixed(1)),
      }));
  }

  private buildRecentActivities(orders: Order[], suppliers: Supplier[]) {
    const orderActivities = orders
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(0, 4)
      .map((order) => ({
        title: `Order ${order.orderNumber}`,
        description: `${order.channel} · ${order.status}`,
        timestamp: order.updatedAt.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }),
        status: (order.status === 'delayed' || order.status === 'cancelled' ? 'warning' : 'success') as
          | 'success'
          | 'warning',
      }));

    const supplierActivity = suppliers
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(0, 2)
      .map((supplier) => ({
        title: `Supplier ${supplier.name}`,
        description: `Reliability ${supplier.reliabilityScore}% · SLA ${supplier.fulfillmentSLA}%`,
        timestamp: supplier.updatedAt.toLocaleString('en-US', { month: 'short', day: 'numeric' }),
        status: (supplier.reliabilityScore > 90 ? 'success' : 'info') as 'success' | 'info',
      }));

    return [...orderActivities, ...supplierActivity].slice(0, 6);
  }

  private buildTeamFocus(
    userStats: ReturnType<typeof this.computeUserStats>,
    suppliers: Supplier[],
    products: Product[],
  ) {
    const supplyHealth = suppliers.length
      ? suppliers.reduce((sum, supplier) => sum + supplier.reliabilityScore, 0) / suppliers.length
      : 0;

    const opsScore = Number((userStats.activeUsers / Math.max(userStats.totalUsers, 1) * 100).toFixed(1));
    const inStockShare = products.length
      ? (products.filter((product) => product.stock > product.reorderPoint).length / products.length) * 100
      : 0;

    return [
      {
        name: 'Operations',
        role: 'Fulfilment SLAs',
        avatarFallback: 'OP',
        metric: `${Math.round(supplyHealth)}% supplier reliability`,
        trend: Number((supplyHealth / 10).toFixed(1)),
      },
      {
        name: 'Support',
        role: 'Customer Happiness',
        avatarFallback: 'CS',
        metric: `${opsScore}% active users`,
        trend: Number(((userStats.newUsers30d / Math.max(userStats.totalUsers, 1)) * 100).toFixed(1)),
      },
      {
        name: 'Automation',
        role: 'Catalog Health',
        avatarFallback: 'AI',
        metric: `${Math.round(inStockShare)}% in-stock SKUs`,
        trend: Number((suppliers.length * 2).toFixed(1)),
      },
    ];
  }

  private percentageChange(previous: number, current: number) {
    if (!previous) return current ? 100 : 0;
    return Number((((current - previous) / previous) * 100).toFixed(1));
  }
}
