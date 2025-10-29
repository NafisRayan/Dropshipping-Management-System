import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './product.entity';
import { ProductVariant } from './product-variant.entity';
import { InventoryLog } from './inventory-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductVariant, InventoryLog])],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}