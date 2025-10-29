import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import { SuppliersService } from './suppliers/suppliers.service';
import { CategoriesService } from './categories/categories.service';
import { ProductsService } from './products/products.service';
import { CustomersService } from './customers/customers.service';
import { OrdersService } from './orders/orders.service';
import { UserRole } from './entities/user.entity';
import { OrderStatus } from './entities/order.entity';
import { Customer } from './entities/customer.entity';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const usersService = app.get(UsersService);
  const suppliersService = app.get(SuppliersService);
  const categoriesService = app.get(CategoriesService);
  const productsService = app.get(ProductsService);
  const customersService = app.get(CustomersService);
  const ordersService = app.get(OrdersService);

  console.log('🌱 Starting comprehensive database seeding...');

  // Create demo user with provided credentials
  console.log('👤 Creating demo users...');
  await usersService.create({
    email: 'demo@example.com',
    password: 'demo123',
    firstName: 'Demo',
    lastName: 'User',
    role: UserRole.ADMIN,
  });

  // Create additional users with different roles
  await usersService.create({
    email: 'admin@example.com',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'User',
    role: UserRole.ADMIN,
  });

  await usersService.create({
    email: 'seller@example.com',
    password: 'seller123',
    firstName: 'John',
    lastName: 'Seller',
    role: UserRole.SELLER,
  });

  await usersService.create({
    email: 'staff@example.com',
    password: 'staff123',
    firstName: 'Jane',
    lastName: 'Staff',
    role: UserRole.STAFF,
  });

  // Create suppliers with API credentials for demo
  console.log('🏭 Creating suppliers...');
  const supplier1 = await suppliersService.create({
    name: 'TechHub Electronics',
    contact: 'Mike Johnson',
    email: 'mike@techhub.com',
    apiUrl: 'https://api.techhub-demo.com',
    apiKey: 'techhub_demo_key_12345',
  });

  const supplier2 = await suppliersService.create({
    name: 'Fashion Forward',
    contact: 'Sarah Wilson',
    email: 'sarah@fashionforward.com',
    apiUrl: 'https://api.fashion-demo.com',
    apiKey: 'fashion_demo_key_67890',
  });

  const supplier3 = await suppliersService.create({
    name: 'Home & Garden Supplies',
    contact: 'David Brown',
    email: 'david@homegarden.com',
    apiUrl: 'https://api.homegarden-demo.com',
    apiKey: 'home_demo_key_11111',
  });

  const supplier4 = await suppliersService.create({
    name: 'Sports Equipment Co',
    contact: 'Lisa Davis',
    email: 'lisa@sportsco.com',
  });

  // Create categories
  console.log('📂 Creating categories...');
  const electronics = await categoriesService.create({
    name: 'Electronics',
    description: 'Electronic gadgets, devices, and accessories',
  });

  const clothing = await categoriesService.create({
    name: 'Clothing',
    description: 'Fashion apparel, shoes, and accessories',
  });

  const homeGarden = await categoriesService.create({
    name: 'Home & Garden',
    description: 'Home improvement, furniture, and garden supplies',
  });

  const sports = await categoriesService.create({
    name: 'Sports & Outdoors',
    description: 'Sports equipment, outdoor gear, and fitness products',
  });

  const books = await categoriesService.create({
    name: 'Books & Media',
    description: 'Books, movies, music, and digital media',
  });

  // Create products with variants
  console.log('📦 Creating products with variants...');

  // Electronics products
  const iphone = await productsService.create({
    name: 'iPhone 15 Pro',
    description: 'Latest iPhone with advanced camera system and A17 Pro chip',
    price: 999.99,
    stock: 25,
    supplierId: supplier1.id,
    categoryId: electronics.id,
    variants: [
      { name: 'Storage', value: '128GB', priceModifier: 0, stock: 10 },
      { name: 'Storage', value: '256GB', priceModifier: 100, stock: 10 },
      { name: 'Storage', value: '512GB', priceModifier: 300, stock: 10 },
      { name: 'Color', value: 'Natural Titanium', priceModifier: 0, stock: 10 },
      { name: 'Color', value: 'Blue Titanium', priceModifier: 0, stock: 10 },
      { name: 'Color', value: 'White Titanium', priceModifier: 0, stock: 10 },
      { name: 'Color', value: 'Black Titanium', priceModifier: 0, stock: 10 },
    ],
  });

  const macbook = await productsService.create({
    name: 'MacBook Pro 16"',
    description: 'Powerful laptop for professionals with M3 Max chip',
    price: 2499.99,
    stock: 15,
    supplierId: supplier1.id,
    categoryId: electronics.id,
    variants: [
      { name: 'Storage', value: '512GB', priceModifier: 0, stock: 10 },
      { name: 'Storage', value: '1TB', priceModifier: 200, stock: 10 },
      { name: 'Storage', value: '2TB', priceModifier: 600, stock: 10 },
      { name: 'Memory', value: '16GB', priceModifier: 0, stock: 10 },
      { name: 'Memory', value: '32GB', priceModifier: 400, stock: 10 },
      { name: 'Memory', value: '64GB', priceModifier: 1000, stock: 10 },
    ],
  });

  const airpods = await productsService.create({
    name: 'AirPods Pro (2nd gen)',
    description: 'Wireless earbuds with active noise cancellation',
    price: 249.99,
    stock: 50,
    supplierId: supplier1.id,
    categoryId: electronics.id,
  });

  const ipad = await productsService.create({
    name: 'iPad Air',
    description: 'Versatile tablet perfect for work and creativity',
    price: 599.99,
    stock: 8, // Low stock for demo
    supplierId: supplier1.id,
    categoryId: electronics.id,
    variants: [
      { name: 'Storage', value: '64GB', priceModifier: 0, stock: 10 },
      { name: 'Storage', value: '256GB', priceModifier: 150, stock: 10 },
      { name: 'Color', value: 'Space Gray', priceModifier: 0, stock: 10 },
      { name: 'Color', value: 'Silver', priceModifier: 0, stock: 10 },
      { name: 'Color', value: 'Purple', priceModifier: 0, stock: 10 },
      { name: 'Color', value: 'Starlight', priceModifier: 0, stock: 10 },
    ],
  });

  // Clothing products
  const nikeShoes = await productsService.create({
    name: 'Nike Air Max 270',
    description: 'Comfortable running shoes with iconic Air Max cushioning',
    price: 150.00,
    stock: 40,
    supplierId: supplier2.id,
    categoryId: clothing.id,
    variants: [
      { name: 'Size', value: '7', priceModifier: 0, stock: 10 },
      { name: 'Size', value: '8', priceModifier: 0, stock: 10 },
      { name: 'Size', value: '9', priceModifier: 0, stock: 10 },
      { name: 'Size', value: '10', priceModifier: 0, stock: 10 },
      { name: 'Size', value: '11', priceModifier: 0, stock: 10 },
      { name: 'Size', value: '12', priceModifier: 0, stock: 10 },
      { name: 'Color', value: 'Black', priceModifier: 0, stock: 10 },
      { name: 'Color', value: 'White', priceModifier: 0, stock: 10 },
      { name: 'Color', value: 'Red', priceModifier: 0, stock: 10 },
    ],
  });

  const leviJeans = await productsService.create({
    name: 'Levi\'s 511 Slim Fit Jeans',
    description: 'Classic slim fit jeans with perfect stretch comfort',
    price: 89.99,
    stock: 35,
    supplierId: supplier2.id,
    categoryId: clothing.id,
    variants: [
      { name: 'Size', value: '28W x 30L', priceModifier: 0, stock: 10 },
      { name: 'Size', value: '29W x 30L', priceModifier: 0, stock: 10 },
      { name: 'Size', value: '30W x 30L', priceModifier: 0, stock: 10 },
      { name: 'Size', value: '31W x 30L', priceModifier: 0, stock: 10 },
      { name: 'Size', value: '32W x 30L', priceModifier: 0, stock: 10 },
      { name: 'Size', value: '33W x 30L', priceModifier: 0, stock: 10 },
      { name: 'Size', value: '34W x 30L', priceModifier: 0, stock: 10 },
      { name: 'Color', value: 'Dark Wash', priceModifier: 0, stock: 10 },
      { name: 'Color', value: 'Medium Wash', priceModifier: 0, stock: 10 },
      { name: 'Color', value: 'Light Wash', priceModifier: 0, stock: 10 },
    ],
  });

  const adidasJacket = await productsService.create({
    name: 'Adidas Ultraboost Jacket',
    description: 'Lightweight running jacket with moisture-wicking fabric',
    price: 120.00,
    stock: 3, // Very low stock for demo
    supplierId: supplier2.id,
    categoryId: clothing.id,
    variants: [
      { name: 'Size', value: 'S', priceModifier: 0, stock: 10 },
      { name: 'Size', value: 'M', priceModifier: 0, stock: 10 },
      { name: 'Size', value: 'L', priceModifier: 0, stock: 10 },
      { name: 'Size', value: 'XL', priceModifier: 0, stock: 10 },
      { name: 'Color', value: 'Black', priceModifier: 0, stock: 10 },
      { name: 'Color', value: 'Navy', priceModifier: 0, stock: 10 },
    ],
  });

  // Home & Garden products
  const dysonVacuum = await productsService.create({
    name: 'Dyson V15 Detect',
    description: 'Powerful cordless vacuum with laser dust detection',
    price: 749.99,
    stock: 12,
    supplierId: supplier3.id,
    categoryId: homeGarden.id,
  });

  const ikeaChair = await productsService.create({
    name: 'IKEA Markus Office Chair',
    description: 'Ergonomic office chair with adjustable height and lumbar support',
    price: 299.99,
    stock: 20,
    supplierId: supplier3.id,
    categoryId: homeGarden.id,
    variants: [
      { name: 'Color', value: 'Black', priceModifier: 0, stock: 10 },
      { name: 'Color', value: 'White', priceModifier: 0, stock: 10 },
      { name: 'Color', value: 'Gray', priceModifier: 0, stock: 10 },
    ],
  });

  // Sports products
  const pelotonBike = await productsService.create({
    name: 'Peloton Bike',
    description: 'Interactive exercise bike with live and on-demand classes',
    price: 2495.00,
    stock: 5,
    supplierId: supplier4.id,
    categoryId: sports.id,
  });

  const yogaMat = await productsService.create({
    name: 'Manduka PRO Yoga Mat',
    description: 'Premium yoga mat with superior grip and cushioning',
    price: 120.00,
    stock: 30,
    supplierId: supplier4.id,
    categoryId: sports.id,
    variants: [
      { name: 'Thickness', value: '4mm', priceModifier: 0, stock: 10 },
      { name: 'Thickness', value: '6mm', priceModifier: 20, stock: 10 },
      { name: 'Color', value: 'Black', priceModifier: 0, stock: 10 },
      { name: 'Color', value: 'Purple', priceModifier: 0, stock: 10 },
      { name: 'Color', value: 'Blue', priceModifier: 0, stock: 10 },
    ],
  });

  // Books
  const kindle = await productsService.create({
    name: 'Amazon Kindle Paperwhite',
    description: 'Waterproof e-reader with adjustable warm light',
    price: 139.99,
    stock: 22,
    supplierId: supplier1.id,
    categoryId: books.id,
    variants: [
      { name: 'Storage', value: '8GB', priceModifier: 0, stock: 10 },
      { name: 'Storage', value: '32GB', priceModifier: 40, stock: 10 },
    ],
  });

  // Create customers
  console.log('👥 Creating customers...');
  const customers: Customer[] = [];
  const customerData = [
    {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1-555-1001',
      address: '123 Main Street, New York, NY 10001',
    },
    {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      phone: '+1-555-1002',
      address: '456 Oak Avenue, Los Angeles, CA 90210',
    },
    {
      firstName: 'Michael',
      lastName: 'Johnson',
      email: 'michael.johnson@example.com',
      phone: '+1-555-1003',
      address: '789 Pine Road, Chicago, IL 60601',
    },
    {
      firstName: 'Emily',
      lastName: 'Davis',
      email: 'emily.davis@example.com',
      phone: '+1-555-1004',
      address: '321 Elm Street, Houston, TX 77001',
    },
    {
      firstName: 'David',
      lastName: 'Wilson',
      email: 'david.wilson@example.com',
      phone: '+1-555-1005',
      address: '654 Maple Lane, Phoenix, AZ 85001',
    },
    {
      firstName: 'Sarah',
      lastName: 'Brown',
      email: 'sarah.brown@example.com',
      phone: '+1-555-1006',
      address: '987 Cedar Court, Philadelphia, PA 19101',
    },
    {
      firstName: 'Robert',
      lastName: 'Miller',
      email: 'robert.miller@example.com',
      phone: '+1-555-1007',
      address: '147 Birch Boulevard, San Antonio, TX 78201',
    },
    {
      firstName: 'Lisa',
      lastName: 'Garcia',
      email: 'lisa.garcia@example.com',
      phone: '+1-555-1008',
      address: '258 Spruce Street, San Diego, CA 92101',
    },
  ];

  for (const customerInfo of customerData) {
    const customer = await customersService.create(customerInfo);
    customers.push(customer);
  }

  // Create orders with different statuses
  console.log('📋 Creating orders with various statuses...');

  const products = [iphone, macbook, airpods, ipad, nikeShoes, leviJeans, adidasJacket, dysonVacuum, ikeaChair, pelotonBike, yogaMat, kindle];

  // Create orders with different statuses
  const ordersData = [
    // Pending orders
    { product: iphone, quantity: 1, customer: customers[0], status: OrderStatus.PENDING },
    { product: nikeShoes, quantity: 2, customer: customers[1], status: OrderStatus.PENDING },
    { product: yogaMat, quantity: 1, customer: customers[2], status: OrderStatus.PENDING },

    // Processing orders
    { product: macbook, quantity: 1, customer: customers[3], status: OrderStatus.PROCESSING },
    { product: leviJeans, quantity: 3, customer: customers[4], status: OrderStatus.PROCESSING },

    // Shipped orders
    { product: airpods, quantity: 2, customer: customers[5], status: OrderStatus.SHIPPED, trackingNumber: 'TRK123456789' },
    { product: ikeaChair, quantity: 1, customer: customers[6], status: OrderStatus.SHIPPED, trackingNumber: 'TRK987654321' },
    { product: kindle, quantity: 1, customer: customers[7], status: OrderStatus.SHIPPED, trackingNumber: 'TRK555666777' },

    // Delivered orders
    { product: ipad, quantity: 1, customer: customers[0], status: OrderStatus.DELIVERED, trackingNumber: 'TRK111222333' },
    { product: dysonVacuum, quantity: 1, customer: customers[1], status: OrderStatus.DELIVERED, trackingNumber: 'TRK444555666' },
    { product: pelotonBike, quantity: 1, customer: customers[2], status: OrderStatus.DELIVERED, trackingNumber: 'TRK777888999' },
  ];

  for (const orderData of ordersData) {
    const order = await ordersService.create({
      productId: orderData.product.id,
      quantity: orderData.quantity,
      customerId: orderData.customer.id,
    });

    // Update status if not pending
    if (orderData.status !== OrderStatus.PENDING) {
      await ordersService.update(order.id, { status: orderData.status, trackingNumber: orderData.trackingNumber });
    }
  }

  console.log('✅ Database seeded successfully with comprehensive demo data!');
  console.log('🔐 Demo login credentials:');
  console.log('   Email: demo@example.com');
  console.log('   Password: demo123');
  console.log('   Role: Admin');
  console.log('');
  console.log('📊 Demo data includes:');
  console.log('   • 4 Users (Admin, Seller, Staff roles)');
  console.log('   • 4 Suppliers (2 with API integration)');
  console.log('   • 5 Categories');
  console.log('   • 12 Products (with variants)');
  console.log('   • 8 Customers');
  console.log('   • 11 Orders (various statuses)');
  console.log('   • Low stock alerts for some products');

  await app.close();
}

seed().catch(console.error);