import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Order } from '../entities/order.entity';
import { Product } from '../entities/product.entity';
import { Customer } from '../entities/customer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Product, Customer]), HttpModule],
  controllers: [OrdersController],
  providers: [OrdersService]
})
export class OrdersModule {}
