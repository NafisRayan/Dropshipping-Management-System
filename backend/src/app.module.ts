import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { CustomersModule } from './customers/customers.module';
import { ReportsModule } from './reports/reports.module';
import { NotificationsModule } from './notifications/notifications.module';
import { SeederModule } from './seeder/seeder.module';
import { User } from './users/user.entity';
import { Customer } from './customers/customer.entity';
import { Supplier } from './suppliers/supplier.entity';
import { Product } from './products/product.entity';
import { InventoryLog } from './products/inventory-log.entity';
import { ProductVariant } from './products/product-variant.entity';
import { Order } from './orders/order.entity';
import { OrderItem } from './orders/order-item.entity';
import { Shipment } from './orders/shipment.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'dropshipping.db',
      entities: [
        User,
        Customer,
        Supplier,
        Product,
        InventoryLog,
        ProductVariant,
        Order,
        OrderItem,
        Shipment,
      ],
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    ProductsModule,
    OrdersModule,
    SuppliersModule,
    CustomersModule,
    ReportsModule,
    NotificationsModule,
    SeederModule,
  ],
})
export class AppModule {}