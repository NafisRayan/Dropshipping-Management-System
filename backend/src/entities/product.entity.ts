import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Supplier } from './supplier.entity';

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

  @ManyToOne(() => Supplier, supplier => supplier.products)
  supplier: Supplier;
}