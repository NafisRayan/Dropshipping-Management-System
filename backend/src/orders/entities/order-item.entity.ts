import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Order } from './order.entity.js';
import { Product } from '../../products/entities/product.entity.js';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, (order: Order) => order.items, { onDelete: 'CASCADE' })
  order: Order;

  @ManyToOne(() => Product, (product: Product) => product.orderItems, {
    eager: true,
    nullable: true,
    onDelete: 'SET NULL',
  })
  product: Product | null;

  @Column({ type: 'integer' })
  quantity: number;

  @Column({ type: 'real' })
  unitPrice: number;

  @Column({ type: 'real' })
  totalPrice: number;
}
