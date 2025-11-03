import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { DashboardSeedService } from './dashboard.seed.service';
import { UsersModule } from '../users/users.module';
import { Order } from '../orders/entities/order.entity.js';
import { OrderItem } from '../orders/entities/order-item.entity.js';
import { Product } from '../products/entities/product.entity.js';
import { Supplier } from '../suppliers/entities/supplier.entity.js';
import { User } from '../users/entities/user.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem, Product, Supplier, User]), UsersModule],
  controllers: [DashboardController],
  providers: [DashboardService, DashboardSeedService],
  exports: [DashboardService],
})
export class DashboardModule {}
