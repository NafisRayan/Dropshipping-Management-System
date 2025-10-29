import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Order } from './order.entity';

export enum ShipmentStatus {
  PENDING = 'pending',
  PICKED_UP = 'picked_up',
  IN_TRANSIT = 'in_transit',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered',
  FAILED = 'failed',
  RETURNED = 'returned',
}

@Entity('shipments')
export class Shipment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  trackingNumber: string;

  @Column()
  carrier: string; // UPS, FedEx, DHL, etc.

  @Column({
    type: 'simple-enum',
    enum: ShipmentStatus,
    default: ShipmentStatus.PENDING,
  })
  status: ShipmentStatus;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  shippingCost: number;

  @Column({ nullable: true })
  estimatedDeliveryDate: Date;

  @Column({ nullable: true })
  actualDeliveryDate: Date;

  @Column('text', { nullable: true })
  shippingAddress: string;

  @Column('text', { nullable: true })
  notes: string;

  @Column('json', { nullable: true })
  trackingEvents: any[]; // Store tracking history

  @ManyToOne(() => Order, order => order.shipments)
  order: Order;

  @Column()
  orderId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}