import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { Supplier } from '../entities/supplier.entity';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Supplier)
    private supplierRepository: Repository<Supplier>,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productRepository.find({ relations: ['supplier'] });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['supplier'],
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
    const product = this.productRepository.create({
      ...createProductDto,
      supplier,
    });
    return this.productRepository.save(product);
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
    Object.assign(product, updateProductDto);
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
