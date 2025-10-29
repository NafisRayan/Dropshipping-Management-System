import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class Supplier {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  contact: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  apiUrl: string;

  @Column({ nullable: true })
  apiKey: string;

  @OneToMany(() => Product, product => product.supplier)
  products: Product[];
}