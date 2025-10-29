import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
export declare class OrdersService {
    private orderRepository;
    constructor(orderRepository: Repository<Order>);
    findAll(): Promise<Order[]>;
    findOne(id: number): Promise<Order | null>;
    create(createOrderDto: CreateOrderDto): Promise<Order>;
    update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order | null>;
    remove(id: number): Promise<void>;
}
