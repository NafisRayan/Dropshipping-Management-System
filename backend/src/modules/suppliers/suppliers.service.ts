import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Supplier } from './entities/supplier.entity';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';

@Injectable()
export class SuppliersService {
  constructor(
    @InjectRepository(Supplier)
    private supplierRepository: Repository<Supplier>,
  ) {}

  async create(createSupplierDto: CreateSupplierDto): Promise<Supplier> {
    const existingSupplier = await this.supplierRepository.findOne({
      where: { name: createSupplierDto.name },
    });

    if (existingSupplier) {
      throw new ConflictException('Supplier with this name already exists');
    }

    const supplier = this.supplierRepository.create(createSupplierDto);
    return this.supplierRepository.save(supplier);
  }

  async findAll(): Promise<Supplier[]> {
    return this.supplierRepository.find({
      order: {
        name: 'ASC',
      },
    });
  }

  async findById(id: string): Promise<Supplier> {
    const supplier = await this.supplierRepository.findOne({ where: { id } });
    if (!supplier) {
      throw new NotFoundException(`Supplier with ID ${id} not found`);
    }
    return supplier;
  }

  async update(id: string, updateSupplierDto: UpdateSupplierDto): Promise<Supplier> {
    const supplier = await this.findById(id);

    // Check if name is being changed and if it's already taken
    if (updateSupplierDto.name && updateSupplierDto.name !== supplier.name) {
      const existingSupplier = await this.supplierRepository.findOne({
        where: { name: updateSupplierDto.name },
      });
      if (existingSupplier) {
        throw new ConflictException('Supplier with this name already exists');
      }
    }

    Object.assign(supplier, updateSupplierDto);
    return this.supplierRepository.save(supplier);
  }

  async remove(id: string): Promise<void> {
    const supplier = await this.findById(id);
    await this.supplierRepository.remove(supplier);
  }

  async syncInventory(id: string): Promise<void> {
    const supplier = await this.findById(id);
    
    // Update last sync time
    supplier.lastSyncAt = new Date();
    await this.supplierRepository.save(supplier);

    // In a real implementation, this would connect to the supplier's API
    // and sync inventory data
  }

  async count(): Promise<number> {
    return this.supplierRepository.count();
  }
}