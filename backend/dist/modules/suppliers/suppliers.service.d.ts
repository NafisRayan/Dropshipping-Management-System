import { Repository } from 'typeorm';
import { Supplier } from './entities/supplier.entity';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
export declare class SuppliersService {
    private supplierRepository;
    constructor(supplierRepository: Repository<Supplier>);
    create(createSupplierDto: CreateSupplierDto): Promise<Supplier>;
    findAll(): Promise<Supplier[]>;
    findById(id: string): Promise<Supplier>;
    update(id: string, updateSupplierDto: UpdateSupplierDto): Promise<Supplier>;
    remove(id: string): Promise<void>;
    syncInventory(id: string): Promise<void>;
    count(): Promise<number>;
}
