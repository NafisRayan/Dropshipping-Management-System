import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Supplier } from '../suppliers/supplier.entity';
import { OrderItem } from '../orders/order-item.entity';
import { ProductVariant } from './product-variant.entity';
import { InventoryLog } from './inventory-log.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column({ unique: true })
  sku: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('decimal', { precision: 10, scale: 2 })
  cost: number;

  @Column({ default: 0 })
  stock: number;

  @Column({ default: 10 })
  lowStockThreshold: number;

  @Column({ nullable: true })
  imageUrl: string;

  @Column('simple-array', { nullable: true })
  imageUrls: string[];

  @Column()
  category: string;

  @Column({ nullable: true })
  brand: string;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  weight: number;

  @Column('text', { nullable: true })
  dimensions: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isLowStock: boolean;

  @Column({ nullable: true })
  supplierProductId: string;

  @Column({ nullable: true })
  supplierSku: string;

  @ManyToOne(() => Supplier, supplier => supplier.products)
  supplier: Supplier;

  @Column()
  supplierId: number;

  @OneToMany(() => OrderItem, orderItem => orderItem.product)
  orderItems: OrderItem[];

  @OneToMany(() => ProductVariant, variant => variant.product, { cascade: true })
  variants: ProductVariant[];

  @OneToMany(() => InventoryLog, log => log.product)
  inventoryLogs: InventoryLog[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}