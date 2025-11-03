# Database Schema Design - TypeORM Entities

## Core Entities and Relationships

### 1. User Entity
```typescript
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.STAFF })
  role: UserRole;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  lastLoginAt: Date;

  @OneToMany(() => Order, order => order.createdBy)
  orders: Order[];

  @OneToMany(() => Customer, customer => customer.createdBy)
  customers: Customer[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

### 2. Customer Entity
```typescript
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
}
```

### 3. Product Entity
```typescript
@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column()
  sku: string;

  @Column('decimal', { precision: 10, scale: 2 })
  costPrice: number;

  @Column('decimal', { precision: 10, scale: 2 })
  sellingPrice: number;

  @Column({ default: 0 })
  quantity: number;

  @Column({ default: 0 })
  reservedQuantity: number;

  @Column({ nullable: true })
  weight: number;

  @Column({ nullable: true })
  dimensions: string;

  @Column({ nullable: true })
  category: string;

  @Column({ nullable: true })
  brand: string;

  @Column({ nullable: true })
  supplierId: string;

  @Column({ nullable: true })
  supplierProductId: string;

  @Column('simple-array', { nullable: true })
  images: string[];

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => OrderItem, orderItem => orderItem.product)
  orderItems: OrderItem[];

  @OneToMany(() => InventoryLog, inventoryLog => inventoryLog.product)
  inventoryLogs: InventoryLog[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

### 4. Order Entity
```typescript
@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  orderNumber: string;

  @ManyToOne(() => Customer, customer => customer.orders)
  customer: Customer;

  @ManyToOne(() => User)
  createdBy: User;

  @Column('decimal', { precision: 10, scale: 2 })
  subtotal: number;

  @Column('decimal', { precision: 10, scale: 2 })
  shippingCost: number;

  @Column('decimal', { precision: 10, scale: 2 })
  taxAmount: number;

  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Column({ nullable: true })
  supplierOrderId: string;

  @Column({ nullable: true })
  trackingNumber: string;

  @Column({ nullable: true })
  shippingCarrier: string;

  @Column({ nullable: true })
  notes: string;

  @OneToMany(() => OrderItem, orderItem => orderItem.order, { cascade: true })
  items: OrderItem[];

  @OneToMany(() => OrderStatusHistory, statusHistory => statusHistory.order)
  statusHistory: OrderStatusHistory[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

### 5. OrderItem Entity
```typescript
@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, order => order.items)
  order: Order;

  @ManyToOne(() => Product, product => product.orderItems)
  product: Product;

  @Column()
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  unitPrice: number;

  @Column('decimal', { precision: 10, scale: 2 })
  totalPrice: number;

  @Column({ nullable: true })
  supplierOrderItemId: string;
}
```

### 6. Supplier Entity
```typescript
@Entity('suppliers')
export class Supplier {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  apiUrl: string;

  @Column()
  apiKey: string;

  @Column({ nullable: true })
  contactEmail: string;

  @Column({ nullable: true })
  contactPhone: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  lastSyncAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

### 7. Address Entity
```typescript
@Entity('addresses')
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Customer, customer => customer.addresses)
  customer: Customer;

  @Column()
  type: AddressType;

  @Column()
  street: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  postalCode: string;

  @Column()
  country: string;

  @Column({ nullable: true })
  isDefault: boolean;
}
```

### 8. InventoryLog Entity
```typescript
@Entity('inventory_logs')
export class InventoryLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Product, product => product.inventoryLogs)
  product: Product;

  @Column({ type: 'enum', enum: InventoryChangeType })
  changeType: InventoryChangeType;

  @Column()
  quantityChange: number;

  @Column()
  previousQuantity: number;

  @Column()
  newQuantity: number;

  @Column({ nullable: true })
  referenceId: string;

  @Column({ nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;
}
```

### 9. OrderStatusHistory Entity
```typescript
@Entity('order_status_history')
export class OrderStatusHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, order => order.statusHistory)
  order: Order;

  @Column({ type: 'enum', enum: OrderStatus })
  status: OrderStatus;

  @Column({ nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;
}
```

## Enums

### UserRole Enum
```typescript
export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  STAFF = 'staff'
}
```

### OrderStatus Enum
```typescript
export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded'
}
```

### AddressType Enum
```typescript
export enum AddressType {
  SHIPPING = 'shipping',
  BILLING = 'billing'
}
```

### InventoryChangeType Enum
```typescript
export enum InventoryChangeType {
  PURCHASE = 'purchase',
  SALE = 'sale',
  ADJUSTMENT = 'adjustment',
  RECEIPT = 'receipt',
  RETURN = 'return'
}
```

## Database Indexes

### Performance Indexes
- User.email (unique)
- Customer.email (unique)
- Product.sku (unique)
- Order.orderNumber (unique)
- Order.status
- Order.createdAt
- Product.isActive
- Product.category
- InventoryLog.productId
- OrderStatusHistory.orderId

## Relationships Summary

1. **User** → Orders (One-to-Many)
2. **User** → Customers (One-to-Many)
3. **Customer** → Orders (One-to-Many)
4. **Customer** → Addresses (One-to-Many)
5. **Order** → OrderItems (One-to-Many)
6. **Order** → OrderStatusHistory (One-to-Many)
7. **Product** → OrderItems (One-to-Many)
8. **Product** → InventoryLogs (One-to-Many)
9. **OrderItem** → Order (Many-to-One)
10. **OrderItem** → Product (Many-to-One)
11. **Address** → Customer (Many-to-One)
12. **InventoryLog** → Product (Many-to-One)
13. **OrderStatusHistory** → Order (Many-to-One)

This schema provides a comprehensive foundation for the dropshipping management system with proper normalization, relationships, and performance considerations.