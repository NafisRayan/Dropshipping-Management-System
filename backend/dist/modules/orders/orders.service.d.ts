import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { OrderStatusHistory } from './entities/order-status-history.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderStatusDto } from './dto/order-status.dto';
import { OrderStatus } from '@/common/enums/order-status.enum';
import { Customer } from '@/modules/customers/entities/customer.entity';
import { Product } from '@/modules/products/entities/product.entity';
import { User } from '@/modules/users/entities/user.entity';
export declare class OrdersService {
    private orderRepository;
    private orderItemRepository;
    private orderStatusHistoryRepository;
    private customerRepository;
    private productRepository;
    private userRepository;
    constructor(orderRepository: Repository<Order>, orderItemRepository: Repository<OrderItem>, orderStatusHistoryRepository: Repository<OrderStatusHistory>, customerRepository: Repository<Customer>, productRepository: Repository<Product>, userRepository: Repository<User>);
    create(createOrderDto: CreateOrderDto, userId: string): Promise<Order>;
    findAll(): Promise<Order[]>;
    findById(id: string): Promise<Order>;
    update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order>;
    updateStatus(id: string, statusDto: OrderStatusDto): Promise<Order>;
    remove(id: string): Promise<void>;
    getOrdersByStatus(status: OrderStatus): Promise<Order[]>;
    getOrdersByCustomer(customerId: string): Promise<Order[]>;
    count(): Promise<number>;
    countByStatus(): Promise<{
        status: string;
        count: number;
    }[]>;
}
