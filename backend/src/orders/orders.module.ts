import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { Shipment } from './shipment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem, Shipment])],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}