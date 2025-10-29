import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DemoDataService } from './demo-data.service';
import { SeederController } from './seeder.controller';
import { User } from '../users/user.entity';
import { Customer } from '../customers/customer.entity';
import { Supplier } from '../suppliers/supplier.entity';
import { Product } from '../products/product.entity';
import { Order } from '../orders/order.entity';
import { OrderItem } from '../orders/order-item.entity';
import { InventoryLog } from '../products/inventory-log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Customer,
      Supplier,
      Product,
      Order,
      OrderItem,
      InventoryLog,
    ]),
  ],
  controllers: [SeederController],
  providers: [DemoDataService],
  exports: [DemoDataService],
})
export class SeederModule {}