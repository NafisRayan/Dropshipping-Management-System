import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupplierSyncService } from './supplier-sync.service';
import { SupplierSyncController } from './supplier-sync.controller';
import { Product } from '../entities/product.entity';
import { Supplier } from '../entities/supplier.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Supplier])],
  controllers: [SupplierSyncController],
  providers: [SupplierSyncService],
  exports: [SupplierSyncService],
})
export class SupplierSyncModule {}