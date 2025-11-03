import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { Product } from '../../products/entities/product.entity.js';

@Entity('suppliers')
export class Supplier {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  contactEmail: string;

  @Column({ type: 'int', default: 0 })
  leadTimeDays: number;

  @Column({ type: 'real', default: 0 })
  reliabilityScore: number;

  @Column({ type: 'real', default: 0 })
  fulfillmentSLA: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Product, (product: Product) => product.supplier)
  products: Product[];
}
