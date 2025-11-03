import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { InventoryLog } from './entities/inventory-log.entity';
import { ProductsModule } from '@/modules/products/products.module';

@Module({
  imports: [TypeOrmModule.forFeature([InventoryLog]), ProductsModule],
  controllers: [InventoryController],
  providers: [InventoryService],
  exports: [InventoryService],
})
export class InventoryModule {}