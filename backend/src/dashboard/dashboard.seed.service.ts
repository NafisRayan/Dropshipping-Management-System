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
      {
        name: 'Global Electronics Ltd.',
        contactEmail: 'contact@globalelectronics.com',
        leadTimeDays: 12,
        reliabilityScore: 91,
        fulfillmentSLA: 93,
      },
      {
        name: 'EcoFurnish Co.',
        contactEmail: 'info@ecofurnish.com',
        leadTimeDays: 16,
        reliabilityScore: 87,
        fulfillmentSLA: 89,
      },
      {
        name: 'TechGadgets Inc.',
        contactEmail: 'support@techgadgets.com',
        leadTimeDays: 10,
        reliabilityScore: 94,
        fulfillmentSLA: 96,
      },
      {
        name: 'Urban Office Supplies',
        contactEmail: 'orders@urbanoffice.com',
        leadTimeDays: 8,
        reliabilityScore: 89,
        fulfillmentSLA: 91,
      },
      {
        name: 'Premium Accessories LLC',
        contactEmail: 'sales@premiumacc.com',
        leadTimeDays: 11,
        reliabilityScore: 86,
        fulfillmentSLA: 87,
      },
      {
        name: 'SmartHome Solutions',
        contactEmail: 'hello@smarthome.com',
        leadTimeDays: 13,
        reliabilityScore: 90,
        fulfillmentSLA: 92,
      },
      {
        name: 'Comfort Seating Corp.',
        contactEmail: 'contact@comfortseating.com',
        leadTimeDays: 15,
        reliabilityScore: 83,
        fulfillmentSLA: 85,
      },
      {
        name: 'Innovative Designs Ltd.',
        contactEmail: 'info@innovativedesigns.com',
        leadTimeDays: 17,
        reliabilityScore: 88,
        fulfillmentSLA: 90,
      },
      {
        name: 'Quality Imports Inc.',
        contactEmail: 'import@qualityimports.com',
        leadTimeDays: 20,
        reliabilityScore: 82,
        fulfillmentSLA: 84,
      },
    ];

    const suppliers: Supplier[] = [];
    for (const data of supplierData) {
      const existing = await this.supplierRepo.findOne({ where: { contactEmail: data.contactEmail } });
      if (!existing) {
        suppliers.push(await this.supplierRepo.save(this.supplierRepo.create(data)));
      } else {
        suppliers.push(existing);
      }
    }
    return suppliers;
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
      {
        sku: 'WIRELESS-KB-05',
        name: 'TypeMaster Wireless Keyboard',
        category: 'Accessories',
        price: 89,
        cost: 35,
        stock: 200,
        reorderPoint: 70,
        supplier: supplierMap.get('Global Electronics Ltd.') ?? null,
      },
      {
        sku: 'ERG-MOUSE-06',
        name: 'Precision Ergonomic Mouse',
        category: 'Accessories',
        price: 65,
        cost: 25,
        stock: 300,
        reorderPoint: 100,
        supplier: supplierMap.get('TechGadgets Inc.') ?? null,
      },
      {
        sku: 'LAPTOP-STAND-07',
        name: 'CoolRise Laptop Stand',
        category: 'Accessories',
        price: 45,
        cost: 18,
        stock: 250,
        reorderPoint: 80,
        supplier: supplierMap.get('EcoFurnish Co.') ?? null,
      },
      {
        sku: 'DESK-LAMP-08',
        name: 'BrightView Desk Lamp',
        category: 'Lighting',
        price: 95,
        cost: 38,
        stock: 180,
        reorderPoint: 60,
        supplier: supplierMap.get('Shenzhen Lighting Co.') ?? null,
      },
      {
        sku: 'EXEC-CHAIR-09',
        name: 'Executive Leather Chair',
        category: 'Seating',
        price: 399,
        cost: 240,
        stock: 90,
        reorderPoint: 30,
        supplier: supplierMap.get('Comfort Seating Corp.') ?? null,
      },
      {
        sku: 'STANDING-MAT-10',
        name: 'Anti-Fatigue Standing Mat',
        category: 'Accessories',
        price: 55,
        cost: 22,
        stock: 220,
        reorderPoint: 75,
        supplier: supplierMap.get('Urban Office Supplies') ?? null,
      },
      {
        sku: 'MONITOR-RISER-11',
        name: 'StackPro Monitor Riser',
        category: 'Accessories',
        price: 35,
        cost: 14,
        stock: 350,
        reorderPoint: 120,
        supplier: supplierMap.get('Premium Accessories LLC') ?? null,
      },
      {
        sku: 'CABLE-MGMT-12',
        name: 'CordKeeper Cable Organizer',
        category: 'Accessories',
        price: 25,
        cost: 10,
        stock: 400,
        reorderPoint: 150,
        supplier: supplierMap.get('SmartHome Solutions') ?? null,
      },
      {
        sku: 'TASK-LAMP-13',
        name: 'FocusBeam Task Lamp',
        category: 'Lighting',
        price: 75,
        cost: 30,
        stock: 160,
        reorderPoint: 50,
        supplier: supplierMap.get('Innovative Designs Ltd.') ?? null,
      },
      {
        sku: 'CONFERENCE-TABLE-14',
        name: 'CollabRound Conference Table',
        category: 'Furniture',
        price: 899,
        cost: 540,
        stock: 25,
        reorderPoint: 10,
        supplier: supplierMap.get('EcoFurnish Co.') ?? null,
      },
      {
        sku: 'STORAGE-CABINET-15',
        name: 'Modular Storage Cabinet',
        category: 'Furniture',
        price: 299,
        cost: 180,
        stock: 60,
        reorderPoint: 20,
        supplier: supplierMap.get('Northwind Home Goods') ?? null,
      },
      {
        sku: 'WHITEBOARD-16',
        name: 'Magnetic Whiteboard',
        category: 'Office Supplies',
        price: 149,
        cost: 75,
        stock: 100,
        reorderPoint: 30,
        supplier: supplierMap.get('Urban Office Supplies') ?? null,
      },
      {
        sku: 'PROJECTOR-17',
        name: 'UltraClear Projector',
        category: 'Electronics',
        price: 599,
        cost: 360,
        stock: 40,
        reorderPoint: 15,
        supplier: supplierMap.get('Global Electronics Ltd.') ?? null,
      },
      {
        sku: 'SPEAKER-SYS-18',
        name: 'Conference Speaker System',
        category: 'Electronics',
        price: 249,
        cost: 125,
        stock: 80,
        reorderPoint: 25,
        supplier: supplierMap.get('TechGadgets Inc.') ?? null,
      },
      {
        sku: 'LAPTOP-DOCK-19',
        name: 'Universal Laptop Dock',
        category: 'Accessories',
        price: 129,
        cost: 52,
        stock: 140,
        reorderPoint: 45,
        supplier: supplierMap.get('Premium Accessories LLC') ?? null,
      },
      {
        sku: 'ERG-WRIST-20',
        name: 'Wrist Rest Pad',
        category: 'Accessories',
        price: 29,
        cost: 12,
        stock: 280,
        reorderPoint: 90,
        supplier: supplierMap.get('Comfort Seating Corp.') ?? null,
      },
    ];

    const products: Product[] = [];
    for (const data of productData) {
      const existing = await this.productRepo.findOne({ where: { sku: data.sku } });
      if (!existing) {
        products.push(await this.productRepo.save(this.productRepo.create(data)));
      } else {
        products.push(existing);
      }
    }
    return products;
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
        email: 'admin@atlasops.io',
        password: 'password123',
        firstName: 'Admin',
        lastName: 'User',
        role: UserRole.ADMIN,
      },
      {
        email: 'manager1@atlasops.io',
        password: 'password123',
        firstName: 'Alex',
        lastName: 'Thompson',
        role: UserRole.MANAGER,
      },
      {
        email: 'manager2@atlasops.io',
        password: 'password123',
        firstName: 'Jordan',
        lastName: 'Lee',
        role: UserRole.MANAGER,
      },
      {
        email: 'customer@example.com',
        password: 'password123',
        firstName: 'Nina',
        lastName: 'Vega',
        role: UserRole.CUSTOMER,
      },
      {
        email: 'customer2@example.com',
        password: 'password123',
        firstName: 'Carlos',
        lastName: 'Rodriguez',
        role: UserRole.CUSTOMER,
      },
      {
        email: 'customer3@example.com',
        password: 'password123',
        firstName: 'Emma',
        lastName: 'Johnson',
        role: UserRole.CUSTOMER,
      },
      {
        email: 'customer4@example.com',
        password: 'password123',
        firstName: 'David',
        lastName: 'Kim',
        role: UserRole.CUSTOMER,
      },
      {
        email: 'customer5@example.com',
        password: 'password123',
        firstName: 'Sophia',
        lastName: 'Martinez',
        role: UserRole.CUSTOMER,
      },
      {
        email: 'customer6@example.com',
        password: 'password123',
        firstName: 'Liam',
        lastName: 'Brown',
        role: UserRole.CUSTOMER,
      },
      {
        email: 'customer7@example.com',
        password: 'password123',
        firstName: 'Ava',
        lastName: 'Davis',
        role: UserRole.CUSTOMER,
      },
      {
        email: 'customer8@example.com',
        password: 'password123',
        firstName: 'Noah',
        lastName: 'Wilson',
        role: UserRole.CUSTOMER,
      },
      {
        email: 'customer9@example.com',
        password: 'password123',
        firstName: 'Mia',
        lastName: 'Garcia',
        role: UserRole.CUSTOMER,
      },
      {
        email: 'customer10@example.com',
        password: 'password123',
        firstName: 'Ethan',
        lastName: 'Miller',
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
    const customerNames = [
      'Olivia Rhodes', 'Miles Chen', 'Sara Amari', 'Nina Vega', 'Carlos Rodriguez',
      'Emma Johnson', 'David Kim', 'Sophia Martinez', 'Liam Brown', 'Ava Davis',
      'Noah Wilson', 'Mia Garcia', 'Ethan Miller', 'Isabella Anderson', 'Mason Taylor',
      'Charlotte Thomas', 'James Jackson', 'Amelia White', 'Benjamin Harris', 'Harper Martin'
    ];

    const channels = Object.values(SalesChannel);
    const statuses = Object.values(OrderStatus);

    const ordersToCreate: Array<{ order: Partial<Order>; items: Array<{ sku: string; quantity: number }> }> = [];

    // Generate orders for the last 6 months
    for (let monthOffset = 5; monthOffset >= 0; monthOffset--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - monthOffset, 1);
      const daysInMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate();
      
      // Generate 15-25 orders per month
      const ordersThisMonth = Math.floor(Math.random() * 11) + 15;
      
      for (let i = 0; i < ordersThisMonth; i++) {
        const orderDate = new Date(monthDate.getFullYear(), monthDate.getMonth(), Math.floor(Math.random() * daysInMonth) + 1);
        const customerName = customerNames[Math.floor(Math.random() * customerNames.length)];
        const channel = channels[Math.floor(Math.random() * channels.length)];
        
        // Weight statuses: most fulfilled, some processing, few delayed/cancelled
        const statusWeights = [0.7, 0.15, 0.1, 0.05]; // fulfilled, processing, delayed, cancelled
        const statusRandom = Math.random();
        let status = OrderStatus.FULFILLED;
        if (statusRandom > statusWeights[0]) status = OrderStatus.PROCESSING;
        if (statusRandom > statusWeights[0] + statusWeights[1]) status = OrderStatus.DELAYED;
        if (statusRandom > statusWeights[0] + statusWeights[1] + statusWeights[2]) status = OrderStatus.CANCELLED;

        // Generate 1-5 random items
        const itemCount = Math.floor(Math.random() * 5) + 1;
        const orderItems: Array<{ sku: string; quantity: number }> = [];
        const usedSkus = new Set<string>();
        
        for (let j = 0; j < itemCount; j++) {
          const availableProducts = products.filter(p => !usedSkus.has(p.sku));
          if (availableProducts.length === 0) break;
          
          const product = availableProducts[Math.floor(Math.random() * availableProducts.length)];
          usedSkus.add(product.sku);
          const quantity = Math.floor(Math.random() * 5) + 1;
          orderItems.push({ sku: product.sku, quantity });
        }

        // Calculate totals
        let subtotal = 0;
        for (const item of orderItems) {
          const product = productMap.get(item.sku);
          if (product) {
            subtotal += product.price * item.quantity;
          }
        }
        
        const shippingCost = Math.floor(subtotal * 0.05); // 5% shipping
        const tax = Math.floor(subtotal * 0.055); // 5.5% tax
        const totalAmount = subtotal + shippingCost + tax;
        const profitMargin = Math.floor(subtotal * 0.25); // Assume 25% margin

        const orderNumber = `ORD-${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`;

        ordersToCreate.push({
          order: {
            orderNumber,
            customerName,
            status,
            channel,
            subtotal,
            shippingCost,
            tax,
            totalAmount,
            profitMargin,
            orderDate,
          },
          items: orderItems,
        });
      }
    }

    // Add some static orders for consistency
    const staticOrders = [
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
    ];

    ordersToCreate.push(...staticOrders);

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
