import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '@/modules/users/entities/user.entity';
import { Customer } from '@/modules/customers/entities/customer.entity';
import { Address } from '@/modules/customers/entities/address.entity';
import { Product } from '@/modules/products/entities/product.entity';
import { Order } from '@/modules/orders/entities/order.entity';
import { OrderItem } from '@/modules/orders/entities/order-item.entity';
import { OrderStatusHistory } from '@/modules/orders/entities/order-status-history.entity';
import { InventoryLog } from '@/modules/inventory/entities/inventory-log.entity';
import { Supplier } from '@/modules/suppliers/entities/supplier.entity';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'sqlite',
  database: 'database.sqlite',
  entities: [
    User,
    Customer,
    Address,
    Product,
    Order,
    OrderItem,
    OrderStatusHistory,
    InventoryLog,
    Supplier,
  ],
  synchronize: true,
  logging: process.env.NODE_ENV === 'development',
};