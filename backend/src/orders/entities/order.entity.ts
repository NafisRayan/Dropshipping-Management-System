import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { OrderItem } from './order-item.entity.js';

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  FULFILLED = 'fulfilled',
  DELAYED = 'delayed',
  CANCELLED = 'cancelled',
}

export enum SalesChannel {
  DIRECT = 'Direct Store',
  MARKETPLACE = 'Marketplaces',
  AFFILIATE = 'Affiliate Partners',
  SOCIAL = 'Paid Social',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ unique: true })
  orderNumber: string;

  @Column({ type: 'text' })
  customerName: string;

  @Column({ type: 'text', default: OrderStatus.PENDING })
  status: OrderStatus;

  @Column({ type: 'text', default: SalesChannel.DIRECT })
  channel: SalesChannel;

  @Column({ type: 'real', default: 0 })
  subtotal: number;

  @Column({ type: 'real', default: 0 })
  shippingCost: number;

  @Column({ type: 'real', default: 0 })
  tax: number;

  @Column({ type: 'real', default: 0 })
  totalAmount: number;

  @Column({ type: 'real', default: 0 })
  profitMargin: number;

  @Column({ type: 'datetime' })
  orderDate: Date;

  @Column({ type: 'text', nullable: true })
  trackingNumber?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => OrderItem, (orderItem: OrderItem) => orderItem.order, {
    cascade: true,
    eager: true,
  })
  items: OrderItem[];
}
