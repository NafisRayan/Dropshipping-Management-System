import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../users/user.entity';
import { Customer } from '../customers/customer.entity';
import { Supplier } from '../suppliers/supplier.entity';
import { Product } from '../products/product.entity';
import { Order, OrderStatus, PaymentStatus } from '../orders/order.entity';
import { OrderItem } from '../orders/order-item.entity';
import { InventoryLog, InventoryAction } from '../products/inventory-log.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class DemoDataService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Customer)
    private customersRepository: Repository<Customer>,
    @InjectRepository(Supplier)
    private suppliersRepository: Repository<Supplier>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
    @InjectRepository(InventoryLog)
    private inventoryLogsRepository: Repository<InventoryLog>,
  ) {}

  async onModuleInit() {
    // Check if demo data already exists
    const userCount = await this.usersRepository.count();
    if (userCount === 0) {
      console.log('🌱 Seeding demo data...');
      await this.seedDemoData();
      console.log('✅ Demo data seeded successfully!');
    }
  }

  async seedDemoData() {
    // Create demo user
    const demoUser = await this.createDemoUser();
    
    // Create demo customers
    const customers = await this.createDemoCustomers();
    
    // Create demo suppliers
    const suppliers = await this.createDemoSuppliers();
    
    // Create demo products
    const products = await this.createDemoProducts(suppliers);
    
    // Create demo orders
    await this.createDemoOrders(customers, products, demoUser);
    
    // Create inventory logs
    await this.createInventoryLogs(products, demoUser);
  }

  private async createDemoUser() {
    const hashedPassword = await bcrypt.hash('demo123', 10);
    
    const demoUser = this.usersRepository.create({
      email: 'demo@example.com',
      password: hashedPassword,
      firstName: 'Demo',
      lastName: 'User',
      role: UserRole.ADMIN,
      isActive: true,
    });
    
    return await this.usersRepository.save(demoUser);
  }

  private async createDemoCustomers() {
    const customersData = [
      {
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@email.com',
        phone: '+1-555-0101',
        address: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
        notes: 'VIP customer, prefers express shipping',
      },
      {
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@email.com',
        phone: '+1-555-0102',
        address: '456 Oak Avenue',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90210',
        country: 'USA',
        notes: 'Frequent buyer, interested in electronics',
      },
      {
        firstName: 'Michael',
        lastName: 'Brown',
        email: 'michael.brown@email.com',
        phone: '+1-555-0103',
        address: '789 Pine Road',
        city: 'Chicago',
        state: 'IL',
        zipCode: '60601',
        country: 'USA',
        notes: 'Corporate buyer, bulk orders',
      },
      {
        firstName: 'Emily',
        lastName: 'Davis',
        email: 'emily.davis@email.com',
        phone: '+1-555-0104',
        address: '321 Elm Street',
        city: 'Miami',
        state: 'FL',
        zipCode: '33101',
        country: 'USA',
        notes: 'Fashion enthusiast, seasonal buyer',
      },
      {
        firstName: 'David',
        lastName: 'Wilson',
        email: 'david.wilson@email.com',
        phone: '+1-555-0105',
        address: '654 Maple Drive',
        city: 'Seattle',
        state: 'WA',
        zipCode: '98101',
        country: 'USA',
        notes: 'Tech professional, quality-focused',
      },
    ];

    const customers = [];
    for (const customerData of customersData) {
      const customer = this.customersRepository.create(customerData);
      customers.push(await this.customersRepository.save(customer));
    }
    
    return customers;
  }

  private async createDemoSuppliers() {
    const suppliersData = [
      {
        name: 'TechSource Electronics',
        email: 'orders@techsource.com',
        phone: '+1-800-TECH-001',
        address: '1000 Technology Blvd, Silicon Valley, CA 94000',
        website: 'https://techsource.com',
        notes: 'Reliable electronics supplier, 2-day shipping, bulk discounts available',
        isActive: true,
      },
      {
        name: 'Fashion Forward Wholesale',
        email: 'wholesale@fashionforward.com',
        phone: '+1-800-FASHION-1',
        address: '500 Fashion District, New York, NY 10018',
        website: 'https://fashionforward.com',
        notes: 'Trendy clothing and accessories, seasonal collections, fast fashion',
        isActive: true,
      },
      {
        name: 'Home & Garden Supplies Co.',
        email: 'orders@homegardenco.com',
        phone: '+1-800-HOME-123',
        address: '2000 Garden Way, Portland, OR 97201',
        website: 'https://homegardenco.com',
        notes: 'Quality home improvement and garden products, eco-friendly options',
        isActive: true,
      },
      {
        name: 'Sports & Fitness Depot',
        email: 'wholesale@sportsdepot.com',
        phone: '+1-800-SPORTS-1',
        address: '750 Athletic Avenue, Denver, CO 80202',
        website: 'https://sportsdepot.com',
        notes: 'Wide range of sports equipment and fitness gear, competitive pricing',
        isActive: true,
      },
      {
        name: 'Global Gadgets Ltd',
        email: 'sales@globalgadgets.com',
        phone: '+1-800-GADGET-1',
        address: '300 Innovation Street, Austin, TX 78701',
        website: 'https://globalgadgets.com',
        notes: 'Latest gadgets and accessories, international shipping, warranty support',
        isActive: true,
      },
    ];

    const suppliers = [];
    for (const supplierData of suppliersData) {
      const supplier = this.suppliersRepository.create(supplierData);
      suppliers.push(await this.suppliersRepository.save(supplier));
    }
    
    return suppliers;
  }

  private async createDemoProducts(suppliers: Supplier[]) {
    const productsData = [
      // Electronics
      {
        name: 'Wireless Bluetooth Headphones',
        description: 'Premium noise-canceling wireless headphones with 30-hour battery life',
        sku: 'WBH-001',
        price: 199.99,
        cost: 89.99,
        stock: 45,
        lowStockThreshold: 10,
        imageUrl: 'https://example.com/headphones.jpg',
        category: 'Electronics',
        brand: 'AudioTech',
        weight: 0.8,
        dimensions: '8x7x3 inches',
        supplierId: suppliers[0].id,
        isLowStock: false,
      },
      {
        name: 'Smartphone Case - Clear',
        description: 'Crystal clear protective case for latest smartphone models',
        sku: 'SPC-002',
        price: 24.99,
        cost: 8.99,
        stock: 8, // Low stock
        lowStockThreshold: 15,
        imageUrl: 'https://example.com/phone-case.jpg',
        category: 'Electronics',
        brand: 'ProtectPro',
        weight: 0.1,
        dimensions: '6x3x0.5 inches',
        supplierId: suppliers[0].id,
        isLowStock: true,
      },
      {
        name: 'USB-C Fast Charger',
        description: '65W fast charging adapter with multiple ports',
        sku: 'UFC-003',
        price: 49.99,
        cost: 22.99,
        stock: 120,
        lowStockThreshold: 20,
        imageUrl: 'https://example.com/charger.jpg',
        category: 'Electronics',
        brand: 'PowerMax',
        weight: 0.3,
        dimensions: '4x3x1 inches',
        supplierId: suppliers[0].id,
        isLowStock: false,
      },
      // Fashion
      {
        name: 'Cotton T-Shirt - Basic',
        description: '100% organic cotton t-shirt, available in multiple colors',
        sku: 'CTS-004',
        price: 29.99,
        cost: 12.99,
        stock: 5, // Low stock
        lowStockThreshold: 25,
        imageUrl: 'https://example.com/tshirt.jpg',
        category: 'Fashion',
        brand: 'ComfortWear',
        weight: 0.2,
        dimensions: 'Various sizes',
        supplierId: suppliers[1].id,
        isLowStock: true,
      },
      {
        name: 'Denim Jeans - Slim Fit',
        description: 'Premium denim jeans with stretch fabric for comfort',
        sku: 'DJ-005',
        price: 79.99,
        cost: 35.99,
        stock: 60,
        lowStockThreshold: 15,
        imageUrl: 'https://example.com/jeans.jpg',
        category: 'Fashion',
        brand: 'DenimCraft',
        weight: 0.7,
        dimensions: 'Various sizes',
        supplierId: suppliers[1].id,
        isLowStock: false,
      },
      // Home & Garden
      {
        name: 'LED Desk Lamp',
        description: 'Adjustable LED desk lamp with touch controls and USB charging port',
        sku: 'LDL-006',
        price: 89.99,
        cost: 39.99,
        stock: 35,
        lowStockThreshold: 10,
        imageUrl: 'https://example.com/desk-lamp.jpg',
        category: 'Home & Garden',
        brand: 'BrightLight',
        weight: 1.2,
        dimensions: '18x8x6 inches',
        supplierId: suppliers[2].id,
        isLowStock: false,
      },
      {
        name: 'Plant Pot Set - Ceramic',
        description: 'Set of 3 decorative ceramic plant pots with drainage holes',
        sku: 'PPS-007',
        price: 39.99,
        cost: 18.99,
        stock: 3, // Low stock
        lowStockThreshold: 12,
        imageUrl: 'https://example.com/plant-pots.jpg',
        category: 'Home & Garden',
        brand: 'GreenThumb',
        weight: 2.5,
        dimensions: '6x6x6 inches each',
        supplierId: suppliers[2].id,
        isLowStock: true,
      },
      // Sports & Fitness
      {
        name: 'Yoga Mat - Premium',
        description: 'Non-slip premium yoga mat with carrying strap',
        sku: 'YM-008',
        price: 59.99,
        cost: 25.99,
        stock: 80,
        lowStockThreshold: 20,
        imageUrl: 'https://example.com/yoga-mat.jpg',
        category: 'Sports & Fitness',
        brand: 'FlexFit',
        weight: 1.8,
        dimensions: '72x24x0.25 inches',
        supplierId: suppliers[3].id,
        isLowStock: false,
      },
      {
        name: 'Resistance Bands Set',
        description: 'Complete set of resistance bands with handles and door anchor',
        sku: 'RBS-009',
        price: 34.99,
        cost: 15.99,
        stock: 7, // Low stock
        lowStockThreshold: 15,
        imageUrl: 'https://example.com/resistance-bands.jpg',
        category: 'Sports & Fitness',
        brand: 'StrongFlex',
        weight: 1.0,
        dimensions: '12x8x4 inches',
        supplierId: suppliers[3].id,
        isLowStock: true,
      },
      // Gadgets
      {
        name: 'Smart Watch - Fitness Tracker',
        description: 'Advanced fitness tracker with heart rate monitor and GPS',
        sku: 'SW-010',
        price: 299.99,
        cost: 149.99,
        stock: 25,
        lowStockThreshold: 8,
        imageUrl: 'https://example.com/smart-watch.jpg',
        category: 'Electronics',
        brand: 'FitTech',
        weight: 0.15,
        dimensions: '1.5x1.5x0.5 inches',
        supplierId: suppliers[4].id,
        isLowStock: false,
      },
    ];

    const products = [];
    for (const productData of productsData) {
      const product = this.productsRepository.create(productData);
      products.push(await this.productsRepository.save(product));
    }
    
    return products;
  }

  private async createDemoOrders(customers: Customer[], products: Product[], user: User) {
    const ordersData = [
      {
        customer: customers[0],
        status: OrderStatus.DELIVERED,
        paymentStatus: PaymentStatus.PAID,
        items: [
          { product: products[0], quantity: 1, price: products[0].price },
          { product: products[2], quantity: 2, price: products[2].price },
        ],
        shippingAddress: '123 Main Street, New York, NY 10001',
        customerEmail: customers[0].email,
        customerPhone: customers[0].phone,
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
      },
      {
        customer: customers[1],
        status: OrderStatus.SHIPPED,
        paymentStatus: PaymentStatus.PAID,
        items: [
          { product: products[3], quantity: 3, price: products[3].price },
          { product: products[4], quantity: 1, price: products[4].price },
        ],
        shippingAddress: '456 Oak Avenue, Los Angeles, CA 90210',
        customerEmail: customers[1].email,
        customerPhone: customers[1].phone,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      },
      {
        customer: customers[2],
        status: OrderStatus.PROCESSING,
        paymentStatus: PaymentStatus.PAID,
        items: [
          { product: products[5], quantity: 2, price: products[5].price },
          { product: products[7], quantity: 1, price: products[7].price },
        ],
        shippingAddress: '789 Pine Road, Chicago, IL 60601',
        customerEmail: customers[2].email,
        customerPhone: customers[2].phone,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      },
      {
        customer: customers[3],
        status: OrderStatus.PENDING,
        paymentStatus: PaymentStatus.PENDING,
        items: [
          { product: products[8], quantity: 1, price: products[8].price },
          { product: products[9], quantity: 2, price: products[9].price },
        ],
        shippingAddress: '321 Elm Street, Miami, FL 33101',
        customerEmail: customers[3].email,
        customerPhone: customers[3].phone,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      },
      {
        customer: customers[4],
        status: OrderStatus.PENDING,
        paymentStatus: PaymentStatus.PAID,
        items: [
          { product: products[6], quantity: 1, price: products[6].price },
          { product: products[1], quantity: 3, price: products[1].price },
        ],
        shippingAddress: '654 Maple Drive, Seattle, WA 98101',
        customerEmail: customers[4].email,
        customerPhone: customers[4].phone,
        createdAt: new Date(), // Today
      },
    ];

    for (const orderData of ordersData) {
      const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      // Calculate totals
      const subtotal = orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const shippingCost = subtotal > 100 ? 0 : 9.99;
      const tax = subtotal * 0.08; // 8% tax
      const totalAmount = subtotal + shippingCost + tax;

      const order = this.ordersRepository.create({
        orderNumber,
        status: orderData.status,
        paymentStatus: orderData.paymentStatus,
        subtotal,
        shippingCost,
        tax,
        totalAmount,
        shippingAddress: orderData.shippingAddress,
        customerEmail: orderData.customerEmail,
        customerPhone: orderData.customerPhone,
        customer: orderData.customer,
        user: user,
        createdAt: orderData.createdAt,
      });

      const savedOrder = await this.ordersRepository.save(order);

      // Create order items
      for (const itemData of orderData.items) {
        const orderItem = this.orderItemsRepository.create({
          quantity: itemData.quantity,
          price: itemData.price,
          order: savedOrder,
          product: itemData.product,
        });
        await this.orderItemsRepository.save(orderItem);
      }
    }
  }

  private async createInventoryLogs(products: Product[], user: User) {
    const logsData = [
      {
        product: products[0],
        action: InventoryAction.STOCK_IN,
        quantity: 50,
        previousStock: 0,
        newStock: 50,
        reason: 'Initial stock',
        notes: 'First delivery from supplier',
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
      {
        product: products[0],
        action: InventoryAction.SALE,
        quantity: -5,
        previousStock: 50,
        newStock: 45,
        reason: 'Customer orders',
        notes: 'Multiple customer purchases',
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      },
      {
        product: products[1],
        action: InventoryAction.STOCK_IN,
        quantity: 25,
        previousStock: 0,
        newStock: 25,
        reason: 'Initial stock',
        notes: 'First delivery from supplier',
        createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
      },
      {
        product: products[1],
        action: InventoryAction.SALE,
        quantity: -17,
        previousStock: 25,
        newStock: 8,
        reason: 'Customer orders',
        notes: 'High demand product',
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      },
    ];

    for (const logData of logsData) {
      const log = this.inventoryLogsRepository.create({
        ...logData,
        user: user,
      });
      await this.inventoryLogsRepository.save(log);
    }
  }
}