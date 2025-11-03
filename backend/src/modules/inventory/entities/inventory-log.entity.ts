import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn
} from 'typeorm';
import { Product } from '@/modules/products/entities/product.entity';
import { InventoryChangeType } from '@/common/enums/inventory-change-type.enum';

@Entity('inventory_logs')
export class InventoryLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Product, product => product.inventoryLogs)
  product: Product;

  @Column({ type: 'enum', enum: InventoryChangeType })
  changeType: InventoryChangeType;

  @Column()
  quantityChange: number;

  @Column()
  previousQuantity: number;

  @Column()
  newQuantity: number;

  @Column({ nullable: true })
  referenceId: string;

  @Column({ nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;
}