import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductsController {
    private productsService;
    constructor(productsService: ProductsService);
    findAll(): Promise<import("../entities/product.entity").Product[]>;
    findOne(id: string): Promise<import("../entities/product.entity").Product | null>;
    create(createProductDto: CreateProductDto): Promise<import("../entities/product.entity").Product>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<import("../entities/product.entity").Product | null>;
    remove(id: string): Promise<void>;
}
