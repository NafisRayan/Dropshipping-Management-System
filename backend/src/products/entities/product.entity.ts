import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Supplier } from '../../suppliers/entities/supplier.entity.js';
import { OrderItem } from '../../orders/entities/order-item.entity.js';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  sku: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  category?: string;

  @Column({ type: 'real', default: 0 })
  price: number;

  @Column({ type: 'real', default: 0 })
  cost: number;

  @Column({ type: 'integer', default: 0 })
  stock: number;

  @Column({ type: 'integer', default: 0 })
  reorderPoint: number;

  @ManyToOne(() => Supplier, (supplier: Supplier) => supplier.products, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  supplier?: Supplier | null;

  @OneToMany(() => OrderItem, (orderItem: OrderItem) => orderItem.product)
  orderItems: OrderItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
