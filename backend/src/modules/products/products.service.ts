import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductFilterDto } from './dto/product-filter.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    // Check if SKU already exists
    const existingProduct = await this.productRepository.findOne({
      where: { sku: createProductDto.sku },
    });

    if (existingProduct) {
      throw new ConflictException('Product with this SKU already exists');
    }

    const product = this.productRepository.create(createProductDto);
    return this.productRepository.save(product);
  }

  async findAll(filterDto: ProductFilterDto): Promise<{ data: Product[]; total: number }> {
    const {
      search,
      category,
      brand,
      supplierId,
      isActive,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = filterDto;

    const queryBuilder = this.productRepository.createQueryBuilder('product');

    if (search) {
      queryBuilder.where(
        'product.name LIKE :search OR product.description LIKE :search OR product.sku LIKE :search',
        { search: `%${search}%` },
      );
    }

    if (category) {
      queryBuilder.andWhere('product.category = :category', { category });
    }

    if (brand) {
      queryBuilder.andWhere('product.brand = :brand', { brand });
    }

    if (supplierId) {
      queryBuilder.andWhere('product.supplierId = :supplierId', { supplierId });
    }

    if (isActive !== undefined) {
      queryBuilder.andWhere('product.isActive = :isActive', { isActive });
    }

    queryBuilder.orderBy(`product.${sortBy}`, sortOrder);
    queryBuilder.skip((page - 1) * limit);
    queryBuilder.take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return { data, total };
  }

  async findById(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async findBySku(sku: string): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { sku } });
    if (!product) {
      throw new NotFoundException(`Product with SKU ${sku} not found`);
    }
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findById(id);

    // Check if SKU is being changed and if it's already taken
    if (updateProductDto.sku && updateProductDto.sku !== product.sku) {
      const existingProduct = await this.productRepository.findOne({
        where: { sku: updateProductDto.sku },
      });
      if (existingProduct) {
        throw new ConflictException('Product with this SKU already exists');
      }
    }

    Object.assign(product, updateProductDto);
    return this.productRepository.save(product);
  }

  async remove(id: string): Promise<void> {
    const product = await this.findById(id);
    await this.productRepository.remove(product);
  }

  async updateInventory(id: string, quantityChange: number, changeType: string): Promise<Product> {
    const product = await this.findById(id);
    
    product.quantity += quantityChange;
    
    if (product.quantity < 0) {
      product.quantity = 0;
    }

    return this.productRepository.save(product);
  }

  async getLowStockProducts(): Promise<Product[]> {
    return this.productRepository.find({
      where: {
        quantity: 10, // Products with 10 or fewer items
        isActive: true,
      },
      order: {
        quantity: 'ASC',
      },
    });
  }

  async count(): Promise<number> {
    return this.productRepository.count();
  }

  async countByCategory(): Promise<{ category: string; count: number }[]> {
    return this.productRepository
      .createQueryBuilder('product')
      .select('product.category')
      .addSelect('COUNT(*)', 'count')
      .where('product.category IS NOT NULL')
      .groupBy('product.category')
      .getRawMany();
  }
}