import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product } from '../entities/product.entity';
import { Supplier } from '../entities/supplier.entity';
import { Category } from '../entities/category.entity';
import { ProductVariant } from '../entities/product-variant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Supplier, Category, ProductVariant])],
  controllers: [ProductsController],
  providers: [ProductsService]
})
export class ProductsModule {}
