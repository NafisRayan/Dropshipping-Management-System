import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Supplier } from './entities/supplier.entity';
import { Product } from './entities/product.entity';
import { Order } from './entities/order.entity';
import { User } from './entities/user.entity';
import { Category } from './entities/category.entity';
import { Customer } from './entities/customer.entity';
import { ProductVariant } from './entities/product-variant.entity';
import { ProductsModule } from './products/products.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { OrdersModule } from './orders/orders.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { CustomersModule } from './customers/customers.module';
import { SupplierSyncModule } from './supplier-sync/supplier-sync.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'sqlite',
        database: configService.get<string>('DATABASE_URL', 'sqlite:./database.sqlite').replace('sqlite:', ''),
        entities: [Supplier, Product, Order, User, Category, Customer, ProductVariant],
        synchronize: true, // For development; disable in production
      }),
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'defaultSecret'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
    ProductsModule,
    SuppliersModule,
    OrdersModule,
    AuthModule,
    UsersModule,
    CategoriesModule,
    CustomersModule,
    SupplierSyncModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
