import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '@/modules/orders/entities/order.entity';
import { Product } from '@/modules/products/entities/product.entity';
import { Customer } from '@/modules/customers/entities/customer.entity';
import { User } from '@/modules/users/entities/user.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getDashboardMetrics() {
    const totalOrders = await this.orderRepository.count();
    const totalProducts = await this.productRepository.count();
    const totalCustomers = await this.customerRepository.count();
    const totalUsers = await this.userRepository.count();

    const totalRevenue = await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.totalAmount)', 'total')
      .where('order.status IN (:...statuses)', {
        statuses: ['delivered', 'shipped'],
      })
      .getRawOne();

    const recentOrders = await this.orderRepository.find({
      order: { createdAt: 'DESC' },
      take: 5,
      relations: ['customer'],
    });

    const ordersByStatus = await this.orderRepository
      .createQueryBuilder('order')
      .select('order.status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('order.status')
      .getRawMany();

    return {
      totalOrders,
      totalProducts,
      totalCustomers,
      totalUsers,
      totalRevenue: parseFloat(totalRevenue?.total || 0),
      recentOrders,
      ordersByStatus,
    };
  }

  async getRevenueAnalytics(days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const revenueData = await this.orderRepository
      .createQueryBuilder('order')
      .select('DATE(order.createdAt)', 'date')
      .addSelect('SUM(order.totalAmount)', 'revenue')
      .where('order.createdAt >= :startDate', { startDate })
      .andWhere('order.status IN (:...statuses)', {
        statuses: ['delivered', 'shipped'],
      })
      .groupBy('DATE(order.createdAt)')
      .orderBy('date', 'ASC')
      .getRawMany();

    return revenueData.map(item => ({
      date: item.date,
      revenue: parseFloat(item.revenue),
    }));
  }

  async getProductAnalytics() {
    const topProducts = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoin('order.items', 'item')
      .select('item.productId', 'productId')
      .addSelect('SUM(item.quantity)', 'totalSold')
      .addSelect('SUM(item.totalPrice)', 'totalRevenue')
      .where('order.status IN (:...statuses)', {
        statuses: ['delivered', 'shipped'],
      })
      .groupBy('item.productId')
      .orderBy('totalSold', 'DESC')
      .limit(10)
      .getRawMany();

    const lowStockProducts = await this.productRepository.find({
      where: {
        quantity: 10,
        isActive: true,
      },
      order: {
        quantity: 'ASC',
      },
    });

    return {
      topProducts,
      lowStockProducts,
    };
  }

  async getCustomerAnalytics() {
    const topCustomers = await this.orderRepository
      .createQueryBuilder('order')
      .select('order.customerId', 'customerId')
      .addSelect('COUNT(*)', 'orderCount')
      .addSelect('SUM(order.totalAmount)', 'totalSpent')
      .where('order.status IN (:...statuses)', {
        statuses: ['delivered', 'shipped'],
      })
      .groupBy('order.customerId')
      .orderBy('totalSpent', 'DESC')
      .limit(10)
      .getRawMany();

    const newCustomers = await this.customerRepository.count({
      where: {
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
      },
    });

    return {
      topCustomers,
      newCustomers,
    };
  }
}