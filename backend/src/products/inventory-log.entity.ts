import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Product } from './product.entity';
import { User } from '../users/user.entity';

export enum InventoryAction {
  STOCK_IN = 'stock_in',
  STOCK_OUT = 'stock_out',
  ADJUSTMENT = 'adjustment',
  SYNC = 'sync',
  SALE = 'sale',
  RETURN = 'return',
}

@Entity('inventory_logs')
export class InventoryLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'simple-enum',
    enum: InventoryAction,
  })
  action: InventoryAction;

  @Column()
  quantity: number;

  @Column()
  previousStock: number;

  @Column()
  newStock: number;

  @Column('text', { nullable: true })
  reason: string;

  @Column('text', { nullable: true })
  notes: string;

  @ManyToOne(() => Product, product => product.inventoryLogs)
  product: Product;

  @Column()
  productId: number;

  @ManyToOne(() => User, { nullable: true })
  user: User;

  @Column({ nullable: true })
  userId: number;

  @CreateDateColumn()
  createdAt: Date;
}