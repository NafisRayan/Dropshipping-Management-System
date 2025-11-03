export declare class ProductFilterDto {
    search?: string;
    category?: string;
    brand?: string;
    supplierId?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
}
