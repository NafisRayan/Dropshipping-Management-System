import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Supplier } from '../suppliers/entities/supplier.entity.js';
import { Product } from '../products/entities/product.entity.js';
import { Order, OrderStatus, SalesChannel } from '../orders/entities/order.entity.js';
import { OrderItem } from '../orders/entities/order-item.entity.js';
import { User, UserRole } from '../users/entities/user.entity.js';

@Injectable()
export class DashboardSeedService implements OnModuleInit {
  private readonly logger = new Logger(DashboardSeedService.name);

  constructor(
    @InjectRepository(Supplier) private readonly supplierRepo: Repository<Supplier>,
    @InjectRepository(Product) private readonly productRepo: Repository<Product>,
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderItem) private readonly orderItemRepo: Repository<OrderItem>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async onModuleInit(): Promise<void> {
    try {
      await this.seed();
    } catch (error) {
      this.logger.error('Dashboard seed failed', error instanceof Error ? error.stack : String(error));
    }
  }

  async seed(): Promise<void> {
    const hasData = await this.orderRepo.count();
    if (hasData > 0) {
      this.logger.log('Dashboard seed skipped (existing data found).');
      return;
    }

    const suppliers = await this.seedSuppliers();
    const products = await this.seedProducts(suppliers);
    await this.seedUsers();
    await this.seedOrders(products);

    this.logger.log('Dashboard seed completed.');
  }

  private async seedSuppliers(): Promise<Supplier[]> {
    const supplierData = [
      {
        name: 'Shenzhen Lighting Co.',
        contactEmail: 'ops@shenzhenlighting.com',
        leadTimeDays: 14,
        reliabilityScore: 92,
        fulfillmentSLA: 95,
      },
      {
        name: 'Northwind Home Goods',
        contactEmail: 'hello@northwindhome.com',
        leadTimeDays: 9,
        reliabilityScore: 88,
        fulfillmentSLA: 90,
      },
      {
        name: 'Atlas Manufacturing',
        contactEmail: 'sales@atlasmfg.com',
        leadTimeDays: 18,
        reliabilityScore: 85,
        fulfillmentSLA: 88,
      },
    ];

    const suppliers = supplierData.map((data) => this.supplierRepo.create(data));
    return this.supplierRepo.save(suppliers);
  }

  private async seedProducts(suppliers: Supplier[]): Promise<Product[]> {
    const supplierMap = new Map(suppliers.map((supplier) => [supplier.name, supplier]));

    const productData = [
      {
        sku: 'ECO-DESK-01',
        name: 'EcoFlex Standing Desk',
        category: 'Workstations',
        price: 349,
        cost: 210,
        stock: 120,
        reorderPoint: 40,
        supplier: supplierMap.get('Northwind Home Goods') ?? null,
      },
      {
        sku: 'ERG-CHAIR-02',
        name: 'ErgoMesh Office Chair',
        category: 'Seating',
        price: 229,
        cost: 134,
        stock: 180,
        reorderPoint: 60,
        supplier: supplierMap.get('Atlas Manufacturing') ?? null,
      },
      {
        sku: 'LED-STRIP-03',
        name: 'AmbientPro LED Strip',
        category: 'Lighting',
        price: 79,
        cost: 32,
        stock: 240,
        reorderPoint: 90,
        supplier: supplierMap.get('Shenzhen Lighting Co.') ?? null,
      },
      {
        sku: 'MON-ARM-04',
        name: 'FocusLite Monitor Arm',
        category: 'Accessories',
        price: 119,
        cost: 48,
        stock: 160,
        reorderPoint: 55,
        supplier: supplierMap.get('Atlas Manufacturing') ?? null,
      },
    ];

    const products = productData.map((data) => this.productRepo.create(data));
    return this.productRepo.save(products);
  }

  private async seedUsers(): Promise<void> {
    const serviceEmail = 'ops-monitor@example.com';
    const existingService = await this.userRepo.findOne({ where: { email: serviceEmail } });

    if (!existingService) {
      await this.userRepo.save(
        this.userRepo.create({
          email: serviceEmail,
          password: 'ChangeMe123!',
          firstName: 'Operations',
          lastName: 'Bot',
          role: UserRole.ADMIN,
          isActive: true,
        }),
      );
    }

    const sampleUsers = [
      {
        email: 'olivia@atlasops.io',
        password: 'password123',
        firstName: 'Olivia',
        lastName: 'Rhodes',
        role: UserRole.MANAGER,
      },
      {
        email: 'miles@atlasops.io',
        password: 'password123',
        firstName: 'Miles',
        lastName: 'Chen',
        role: UserRole.MANAGER,
      },
      {
        email: 'sara@atlasops.io',
        password: 'password123',
        firstName: 'Sara',
        lastName: 'Amari',
        role: UserRole.MANAGER,
      },
      {
        email: 'customer@example.com',
        password: 'password123',
        firstName: 'Nina',
        lastName: 'Vega',
        role: UserRole.CUSTOMER,
      },
    ];

    for (const data of sampleUsers) {
      const exists = await this.userRepo.findOne({ where: { email: data.email } });
      if (!exists) {
        await this.userRepo.save(this.userRepo.create({ ...data, isActive: true }));
      }
    }
  }

  private async seedOrders(products: Product[]): Promise<void> {
    const productMap = new Map(products.map((product) => [product.sku, product]));
    const now = new Date();

    const ordersToCreate: Array<{ order: Partial<Order>; items: Array<{ sku: string; quantity: number }> }> = [
      {
        order: {
          orderNumber: 'ORD-2024-1024',
          customerName: 'Olivia Rhodes',
          status: OrderStatus.FULFILLED,
          channel: SalesChannel.DIRECT,
          subtotal: 2180,
          shippingCost: 120,
          tax: 110,
          totalAmount: 2410,
          profitMargin: 640,
          orderDate: new Date(now.getFullYear(), now.getMonth() - 1, 18),
        },
        items: [
          { sku: 'ECO-DESK-01', quantity: 4 },
          { sku: 'ERG-CHAIR-02', quantity: 3 },
        ],
      },
      {
        order: {
          orderNumber: 'ORD-2024-1078',
          customerName: 'Miles Chen',
          status: OrderStatus.FULFILLED,
          channel: SalesChannel.MARKETPLACE,
          subtotal: 1580,
          shippingCost: 80,
          tax: 92,
          totalAmount: 1752,
          profitMargin: 520,
          orderDate: new Date(now.getFullYear(), now.getMonth(), 4),
        },
        items: [
          { sku: 'ERG-CHAIR-02', quantity: 5 },
          { sku: 'LED-STRIP-03', quantity: 10 },
        ],
      },
      {
        order: {
          orderNumber: 'ORD-2024-1115',
          customerName: 'Sara Amari',
          status: OrderStatus.PROCESSING,
          channel: SalesChannel.SOCIAL,
          subtotal: 980,
          shippingCost: 60,
          tax: 54,
          totalAmount: 1094,
          profitMargin: 280,
          orderDate: new Date(now.getFullYear(), now.getMonth(), 12),
        },
        items: [
          { sku: 'LED-STRIP-03', quantity: 12 },
          { sku: 'MON-ARM-04', quantity: 4 },
        ],
      },
      {
        order: {
          orderNumber: 'ORD-2024-1130',
          customerName: 'Nina Vega',
          status: OrderStatus.DELAYED,
          channel: SalesChannel.AFFILIATE,
          subtotal: 720,
          shippingCost: 45,
          tax: 36,
          totalAmount: 801,
          profitMargin: 190,
          orderDate: new Date(now.getFullYear(), now.getMonth(), 20),
        },
        items: [
          { sku: 'LED-STRIP-03', quantity: 6 },
          { sku: 'MON-ARM-04', quantity: 3 },
        ],
      },
    ];

    for (const entry of ordersToCreate) {
      const existing = await this.orderRepo.findOne({ where: { orderNumber: entry.order.orderNumber } });
      if (existing) continue;

      const order = this.orderRepo.create(entry.order);
      const savedOrder = await this.orderRepo.save(order);

      const items = entry.items.map(({ sku, quantity }) => {
        const product = productMap.get(sku) ?? null;
        return this.orderItemRepo.create({
          order: savedOrder,
          product,
          quantity,
          unitPrice: product?.price ?? 0,
          totalPrice: (product?.price ?? 0) * quantity,
        });
      });

      await this.orderItemRepo.save(items);
    }
  }
}
