import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Product } from './product.entity';
import { Customer } from './customer.entity';

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quantity: number;

  @Column({ default: OrderStatus.PENDING })
  status: OrderStatus;

  @Column({ nullable: true })
  trackingNumber: string;

  @Column({ type: 'datetime', nullable: true })
  shippedAt: Date;

  @Column({ type: 'datetime', nullable: true })
  deliveredAt: Date;

  @ManyToOne(() => Customer, customer => customer.orders, { nullable: true })
  customer: Customer;

  @ManyToOne(() => Product, product => product.id)
  product: Product;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}