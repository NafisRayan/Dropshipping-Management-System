import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Supplier } from './supplier.entity';
import { Category } from './category.entity';
import { ProductVariant } from './product-variant.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column('decimal')
  price: number;

  @Column()
  stock: number;

  @Column({ nullable: true })
  externalId: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ManyToOne(() => Supplier, supplier => supplier.products)
  supplier: Supplier;

  @ManyToOne(() => Category, category => category.products, { nullable: true })
  category: Category;

  @OneToMany(() => ProductVariant, variant => variant.product)
  variants: ProductVariant[];
}