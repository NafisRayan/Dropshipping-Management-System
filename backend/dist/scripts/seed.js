"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../src/entities/user.entity");
const product_entity_1 = require("../src/entities/product.entity");
const order_entity_1 = require("../src/entities/order.entity");
async function run() {
    const dataSource = new typeorm_1.DataSource({
        type: 'sqlite',
        database: 'database.sqlite',
        synchronize: true,
        logging: false,
        entities: [user_entity_1.User, product_entity_1.Product, order_entity_1.Order],
    });
    await dataSource.initialize();
    console.log('DataSource initialized');
    const userRepo = dataSource.getRepository(user_entity_1.User);
    const productRepo = dataSource.getRepository(product_entity_1.Product);
    const orderRepo = dataSource.getRepository(order_entity_1.Order);
    await orderRepo.clear();
    await productRepo.clear();
    await userRepo.clear();
    const admin = userRepo.create({ email: 'admin@example.com', password: '$2b$10$k1a2b3c4d5e6f7g8h9i0j', role: user_entity_1.Role.ADMIN });
    const user = userRepo.create({ email: 'user@example.com', password: '$2b$10$k1a2b3c4d5e6f7g8h9i0j', role: user_entity_1.Role.USER });
    await userRepo.save([admin, user]);
    const products = [
        productRepo.create({ name: 'Wireless Mouse', description: 'Ergonomic wireless mouse', price: 19.99, stock: 120, supplierId: 'supplier_1' }),
        productRepo.create({ name: 'Mechanical Keyboard', description: 'RGB mechanical keyboard', price: 89.99, stock: 60, supplierId: 'supplier_1' }),
        productRepo.create({ name: 'USB-C Cable', description: '1.5m USB-C cable', price: 7.5, stock: 300, supplierId: 'supplier_2' }),
    ];
    await productRepo.save(products);
    const orders = [
        orderRepo.create({ customerId: 'cust_1', productId: products[0].id, quantity: 2, status: order_entity_1.OrderStatus.PENDING }),
        orderRepo.create({ customerId: 'cust_2', productId: products[1].id, quantity: 1, status: order_entity_1.OrderStatus.SHIPPED }),
    ];
    await orderRepo.save(orders);
    console.log('Seed complete: users, products, orders created');
    await dataSource.destroy();
}
run().catch((err) => {
    console.error('Seed failed', err);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map