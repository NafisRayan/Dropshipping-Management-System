export declare class CreateProductDto {
    name: string;
    description: string;
    sku: string;
    costPrice: number;
    sellingPrice: number;
    quantity?: number;
    weight?: number;
    dimensions?: string;
    category?: string;
    brand?: string;
    supplierId?: string;
    supplierProductId?: string;
    images?: string[];
    isActive?: boolean;
}
