import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Order, OrderStatus } from '../orders/order.entity';
import { Product } from '../products/product.entity';
import { Customer } from '../customers/customer.entity';
import { Supplier } from '../suppliers/supplier.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Customer)
    private customersRepository: Repository<Customer>,
    @InjectRepository(Supplier)
    private suppliersRepository: Repository<Supplier>,
  ) {}

  async getDashboardStats() {
    const [
      totalOrders,
      totalRevenue,
      totalProducts,
      totalCustomers,
      totalSuppliers,
      pendingOrders,
      lowStockProducts,
      recentOrders,
    ] = await Promise.all([
      this.ordersRepository.count(),
      this.ordersRepository
        .createQueryBuilder('order')
        .select('SUM(order.totalAmount)', 'total')
        .where('order.status != :status', { status: OrderStatus.CANCELLED })
        .getRawOne(),
      this.productsRepository.count({ where: { isActive: true } }),
      this.customersRepository.count({ where: { isActive: true } }),
      this.suppliersRepository.count({ where: { isActive: true } }),
      this.ordersRepository.count({ where: { status: OrderStatus.PENDING } }),
      this.productsRepository.count({ where: { isLowStock: true } }),
      this.ordersRepository.find({
        take: 5,
        order: { createdAt: 'DESC' },
        relations: ['customer', 'orderItems'],
      }),
    ]);

    return {
      totalOrders,
      totalRevenue: parseFloat(totalRevenue?.total || '0'),
      totalProducts,
      totalCustomers,
      totalSuppliers,
      pendingOrders,
      lowStockProducts,
      recentOrders,
    };
  }

  async getSalesReport(startDate: Date, endDate: Date) {
    const orders = await this.ordersRepository.find({
      where: {
        createdAt: Between(startDate, endDate),
        status: OrderStatus.DELIVERED,
      },
      relations: ['orderItems', 'orderItems.product'],
    });

    const totalSales = orders.reduce((sum, order) => sum + parseFloat(order.totalAmount.toString()), 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

    // Group by date
    const salesByDate = orders.reduce((acc, order) => {
      const date = order.createdAt.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { date, sales: 0, orders: 0 };
      }
      acc[date].sales += parseFloat(order.totalAmount.toString());
      acc[date].orders += 1;
      return acc;
    }, {});

    return {
      totalSales,
      totalOrders,
      averageOrderValue,
      salesByDate: Object.values(salesByDate),
    };
  }

  async getInventoryReport() {
    const products = await this.productsRepository.find({
      where: { isActive: true },
      relations: ['supplier'],
    });

    const totalProducts = products.length;
    const lowStockProducts = products.filter(p => p.isLowStock).length;
    const outOfStockProducts = products.filter(p => p.stock === 0).length;
    const totalInventoryValue = products.reduce((sum, product) => {
      return sum + (parseFloat(product.cost.toString()) * product.stock);
    }, 0);

    return {
      totalProducts,
      lowStockProducts,
      outOfStockProducts,
      totalInventoryValue,
      products: products.map(p => ({
        id: p.id,
        name: p.name,
        sku: p.sku,
        stock: p.stock,
        lowStockThreshold: p.lowStockThreshold,
        isLowStock: p.isLowStock,
        supplier: p.supplier?.name,
        value: parseFloat(p.cost.toString()) * p.stock,
      })),
    };
  }

  async getSupplierPerformance() {
    const suppliers = await this.suppliersRepository.find({
      relations: ['products', 'products.orderItems', 'products.orderItems.order'],
    });

    return suppliers.map(supplier => {
      const products = supplier.products || [];
      const totalProducts = products.length;
      
      const orderItems = products.flatMap(p => p.orderItems || []);
      const totalSales = orderItems.reduce((sum, item) => {
        return sum + (parseFloat(item.price.toString()) * item.quantity);
      }, 0);

      const deliveredOrders = orderItems.filter(item => 
        item.order?.status === OrderStatus.DELIVERED
      ).length;

      return {
        id: supplier.id,
        name: supplier.name,
        email: supplier.email,
        totalProducts,
        totalSales,
        deliveredOrders,
        isActive: supplier.isActive,
      };
    });
  }
}