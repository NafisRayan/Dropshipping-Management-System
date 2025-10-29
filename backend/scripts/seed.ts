import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User, Role } from '../src/entities/user.entity';
import { Product } from '../src/entities/product.entity';
import { Order, OrderStatus } from '../src/entities/order.entity';

async function run() {
  const dataSource = new DataSource({
    type: 'sqlite',
    database: 'database.sqlite',
    synchronize: true,
    logging: false,
    entities: [User, Product, Order],
  });

  await dataSource.initialize();
  console.log('DataSource initialized');

  const userRepo = dataSource.getRepository(User);
  const productRepo = dataSource.getRepository(Product);
  const orderRepo = dataSource.getRepository(Order);

  // Clear existing demo entries (safe for development)
  await orderRepo.clear();
  await productRepo.clear();
  await userRepo.clear();

  // Create demo users
  const admin = userRepo.create({ email: 'admin@example.com', password: '$2b$10$k1a2b3c4d5e6f7g8h9i0j', role: Role.ADMIN });
  const user = userRepo.create({ email: 'user@example.com', password: '$2b$10$k1a2b3c4d5e6f7g8h9i0j', role: Role.USER });
  // Note: passwords are placeholders (bcrypt hashes). For testing you can register via API or replace with real hashes.
  await userRepo.save([admin, user]);

  // Create demo products
  const products = [
    productRepo.create({ name: 'Wireless Mouse', description: 'Ergonomic wireless mouse', price: 19.99, stock: 120, supplierId: 'supplier_1' }),
    productRepo.create({ name: 'Mechanical Keyboard', description: 'RGB mechanical keyboard', price: 89.99, stock: 60, supplierId: 'supplier_1' }),
    productRepo.create({ name: 'USB-C Cable', description: '1.5m USB-C cable', price: 7.5, stock: 300, supplierId: 'supplier_2' }),
  ];
  await productRepo.save(products);

  // Create demo orders
  const orders = [
    orderRepo.create({ customerId: 'cust_1', productId: products[0].id, quantity: 2, status: OrderStatus.PENDING }),
    orderRepo.create({ customerId: 'cust_2', productId: products[1].id, quantity: 1, status: OrderStatus.SHIPPED }),
  ];
  await orderRepo.save(orders);

  console.log('Seed complete: users, products, orders created');
  await dataSource.destroy();
}

run().catch((err) => {
  console.error('Seed failed', err);
  process.exit(1);
});
