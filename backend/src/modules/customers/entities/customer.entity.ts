import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';
import { Order } from '@/modules/orders/entities/order.entity';
import { Address } from './address.entity';
import { User } from '@/modules/users/entities/user.entity';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  company: string;

  @OneToMany(() => Address, address => address.customer)
  addresses: Address[];

  @OneToMany(() => Order, order => order.customer)
  orders: Order[];

  @ManyToOne(() => User)
  createdBy: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  get orderCount(): number {
    return this.orders?.length || 0;
  }

  get totalSpent(): number {
    return this.orders?.reduce((sum, order) => sum + order.totalAmount, 0) || 0;
  }
}