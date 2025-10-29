import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Product } from '../products/product.entity';

@Entity('suppliers')
export class Supplier {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column('text', { nullable: true })
  address: string;

  @Column({ nullable: true })
  website: string;

  @Column('text', { nullable: true })
  notes: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Product, product => product.supplier)
  products: Product[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}