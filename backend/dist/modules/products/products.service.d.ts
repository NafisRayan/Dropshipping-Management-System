import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductFilterDto } from './dto/product-filter.dto';
export declare class ProductsService {
    private productRepository;
    constructor(productRepository: Repository<Product>);
    create(createProductDto: CreateProductDto): Promise<Product>;
    findAll(filterDto: ProductFilterDto): Promise<{
        data: Product[];
        total: number;
    }>;
    findById(id: string): Promise<Product>;
    findBySku(sku: string): Promise<Product>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<Product>;
    remove(id: string): Promise<void>;
    updateInventory(id: string, quantityChange: number, changeType: string): Promise<Product>;
    getLowStockProducts(): Promise<Product[]>;
    count(): Promise<number>;
    countByCategory(): Promise<{
        category: string;
        count: number;
    }[]>;
}
