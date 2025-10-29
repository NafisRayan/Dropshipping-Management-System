import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Order } from './order.entity';
import { Product } from '../products/product.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @ManyToOne(() => Order, order => order.orderItems)
  order: Order;

  @Column()
  orderId: number;

  @ManyToOne(() => Product, product => product.orderItems)
  product: Product;

  @Column()
  productId: number;
}