import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, IsNull } from 'typeorm';
import { Product } from '../entities/product.entity';
import { Supplier } from '../entities/supplier.entity';
import axios from 'axios';

@Injectable()
export class SupplierSyncService {
  private readonly logger = new Logger(SupplierSyncService.name);

  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Supplier)
    private supplierRepository: Repository<Supplier>,
  ) {}

  async syncProductsFromSupplier(supplierId: number): Promise<void> {
    const supplier = await this.supplierRepository.findOne({
      where: { id: supplierId },
    });

    if (!supplier) {
      throw new Error(`Supplier with ID ${supplierId} not found`);
    }

    this.logger.log(`Starting sync for supplier: ${supplier.name}`);

    // Mock API call - replace with actual supplier API
    try {
      const response = await axios.get(`${supplier.apiUrl}/products`, {
        headers: {
          'Authorization': `Bearer ${supplier.apiKey}`,
        },
      });

      const externalProducts = response.data;

      for (const extProduct of externalProducts) {
        // Check if product exists
        let product = await this.productRepository.findOne({
          where: { externalId: extProduct.id, supplier: { id: supplierId } },
        });

        if (product) {
          // Update existing product
          product.name = extProduct.name;
          product.description = extProduct.description;
          product.price = extProduct.price;
          product.stock = extProduct.stock;
          product.updatedAt = new Date();
        } else {
          // Create new product
          product = this.productRepository.create({
            name: extProduct.name,
            description: extProduct.description,
            price: extProduct.price,
            stock: extProduct.stock,
            externalId: extProduct.id,
            supplier,
          });
        }

        await this.productRepository.save(product);
      }

      this.logger.log(`Synced ${externalProducts.length} products from ${supplier.name}`);
    } catch (error) {
      this.logger.error(`Failed to sync products from ${supplier.name}: ${error.message}`);
      throw error;
    }
  }

  async syncAllSuppliers(): Promise<void> {
    const suppliers = await this.supplierRepository.find({
      where: { apiUrl: Not(IsNull()) }, // Only suppliers with API URL
    });

    for (const supplier of suppliers) {
      try {
        await this.syncProductsFromSupplier(supplier.id);
      } catch (error) {
        this.logger.error(`Failed to sync supplier ${supplier.name}: ${error.message}`);
      }
    }
  }
}