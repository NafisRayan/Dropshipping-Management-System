import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Supplier } from './entities/supplier.entity';
import { Product } from './entities/product.entity';
import { Order } from './entities/order.entity';
import { ProductsModule } from './products/products.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { OrdersModule } from './orders/orders.module';

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
        entities: [Supplier, Product, Order],
        synchronize: true, // For development; disable in production
      }),
      inject: [ConfigService],
    }),
    ProductsModule,
    SuppliersModule,
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
