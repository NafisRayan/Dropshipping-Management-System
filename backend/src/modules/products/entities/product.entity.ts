import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';
import { OrderItem } from '@/modules/orders/entities/order-item.entity';
import { InventoryLog } from '@/modules/inventory/entities/inventory-log.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column()
  sku: string;

  @Column('decimal', { precision: 10, scale: 2 })
  costPrice: number;

  @Column('decimal', { precision: 10, scale: 2 })
  sellingPrice: number;

  @Column({ default: 0 })
  quantity: number;

  @Column({ default: 0 })
  reservedQuantity: number;

  @Column({ nullable: true })
  weight: number;

  @Column({ nullable: true })
  dimensions: string;

  @Column({ nullable: true })
  category: string;

  @Column({ nullable: true })
  brand: string;

  @Column({ nullable: true })
  supplierId: string;

  @Column({ nullable: true })
  supplierProductId: string;

  @Column('simple-array', { nullable: true })
  images: string[];

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => OrderItem, orderItem => orderItem.product)
  orderItems: OrderItem[];

  @OneToMany(() => InventoryLog, inventoryLog => inventoryLog.product)
  inventoryLogs: InventoryLog[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  get availableQuantity(): number {
    return this.quantity - this.reservedQuantity;
  }

  get profitMargin(): number {
    if (this.sellingPrice === 0) return 0;
    return ((this.sellingPrice - this.costPrice) / this.sellingPrice) * 100;
  }

  get isInStock(): boolean {
    return this.availableQuantity > 0;
  }

  get isLowStock(): boolean {
    return this.availableQuantity <= 5 && this.availableQuantity > 0;
  }

  get isOutOfStock(): boolean {
    return this.availableQuantity <= 0;
  }
}