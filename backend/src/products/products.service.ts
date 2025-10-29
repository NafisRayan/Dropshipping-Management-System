import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { Supplier } from '../entities/supplier.entity';
import { Category } from '../entities/category.entity';
import { ProductVariant } from '../entities/product-variant.entity';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Supplier)
    private supplierRepository: Repository<Supplier>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(ProductVariant)
    private productVariantRepository: Repository<ProductVariant>,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productRepository.find({ relations: ['supplier', 'category', 'variants'] });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['supplier', 'category', 'variants'],
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const supplier = await this.supplierRepository.findOne({
      where: { id: createProductDto.supplierId },
    });
    if (!supplier) {
      throw new NotFoundException(`Supplier with ID ${createProductDto.supplierId} not found`);
    }
    let category: Category | null = null;
    if (createProductDto.categoryId) {
      category = await this.categoryRepository.findOne({
        where: { id: createProductDto.categoryId },
      });
      if (!category) {
        throw new NotFoundException(`Category with ID ${createProductDto.categoryId} not found`);
      }
    }
    const { supplierId, categoryId, variants, ...productData } = createProductDto;
    const product = this.productRepository.create({
      ...productData,
      supplier,
      category: category || undefined,
    });
    const savedProduct = await this.productRepository.save(product);

    if (variants && variants.length > 0) {
      const variantEntities = variants.map(variant =>
        this.productVariantRepository.create({
          ...variant,
          product: savedProduct,
        })
      );
      await this.productVariantRepository.save(variantEntities);
    }

    return this.findOne(savedProduct.id);
  }

  async update(id: number, updateProductDto: Partial<CreateProductDto>): Promise<Product> {
    const product = await this.findOne(id);
    if (updateProductDto.supplierId) {
      const supplier = await this.supplierRepository.findOne({
        where: { id: updateProductDto.supplierId },
      });
      if (!supplier) {
        throw new NotFoundException(`Supplier with ID ${updateProductDto.supplierId} not found`);
      }
      product.supplier = supplier;
    }
    if (updateProductDto.categoryId !== undefined) {
      if (updateProductDto.categoryId) {
        const category = await this.categoryRepository.findOne({
          where: { id: updateProductDto.categoryId },
        });
        if (!category) {
          throw new NotFoundException(`Category with ID ${updateProductDto.categoryId} not found`);
        }
        product.category = category;
      } else {
        (product.category as any) = null;
      }
    }
    const { supplierId, categoryId, variants, ...productData } = updateProductDto;
    Object.assign(product, productData);

    // Handle variants: delete existing and create new ones
    if (variants !== undefined) {
      await this.productVariantRepository.delete({ product: { id } });
      if (variants.length > 0) {
        const variantEntities = variants.map(variant =>
          this.productVariantRepository.create({
            ...variant,
            product,
          })
        );
        await this.productVariantRepository.save(variantEntities);
      }
    }

    return this.productRepository.save(product);
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }

  async updateStock(id: number, stock: number): Promise<Product> {
    const product = await this.findOne(id);
    product.stock = stock;
    return this.productRepository.save(product);
  }
}
