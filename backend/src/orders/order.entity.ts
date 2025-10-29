import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../users/user.entity';
import { Customer } from '../customers/customer.entity';
import { OrderItem } from './order-item.entity';
import { Shipment } from './shipment.entity';

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  orderNumber: string;

  @Column({
    type: 'simple-enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Column({
    type: 'simple-enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  paymentStatus: PaymentStatus;

  @Column('decimal', { precision: 10, scale: 2 })
  subtotal: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  shippingCost: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  tax: number;

  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount: number;

  @Column('text', { nullable: true })
  shippingAddress: string;

  @Column('text', { nullable: true })
  billingAddress: string;

  @Column({ nullable: true })
  customerEmail: string;

  @Column({ nullable: true })
  customerPhone: string;

  @Column('text', { nullable: true })
  notes: string;

  @Column('text', { nullable: true })
  internalNotes: string;

  @Column({ nullable: true })
  supplierOrderId: string;

  @Column({ default: false })
  isForwardedToSupplier: boolean;

  @ManyToOne(() => User, user => user.orders, { nullable: true })
  user: User;

  @Column({ nullable: true })
  userId: number;

  @ManyToOne(() => Customer, customer => customer.orders, { nullable: true })
  customer: Customer;

  @Column({ nullable: true })
  customerId: number;

  @OneToMany(() => OrderItem, orderItem => orderItem.order, { cascade: true })
  orderItems: OrderItem[];

  @OneToMany(() => Shipment, shipment => shipment.order, { cascade: true })
  shipments: Shipment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}