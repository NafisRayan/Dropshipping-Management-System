import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class ProductVariant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productId: number;

  @ManyToOne(() => Product, product => product.variants, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column()
  name: string;

  @Column()
  value: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  priceModifier: number;

  @Column({ default: 0 })
  stock: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}