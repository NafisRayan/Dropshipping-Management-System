import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity('product_variants')
export class ProductVariant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // e.g., "Size", "Color"

  @Column()
  value: string; // e.g., "Large", "Red"

  @Column({ unique: true })
  sku: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  priceAdjustment: number; // Additional cost for this variant

  @Column({ default: 0 })
  stock: number;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Product, product => product.variants)
  product: Product;

  @Column()
  productId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}