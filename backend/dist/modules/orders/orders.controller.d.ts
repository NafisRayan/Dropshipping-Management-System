import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderStatusDto } from './dto/order-status.dto';
import { User } from '@/modules/users/entities/user.entity';
import { OrderStatus } from '@/common/enums/order-status.enum';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(createOrderDto: CreateOrderDto, user: User): Promise<import("./entities/order.entity").Order>;
    findAll(): Promise<import("./entities/order.entity").Order[]>;
    getOrdersByStatus(status: OrderStatus): Promise<import("./entities/order.entity").Order[]>;
    getOrdersByCustomer(customerId: string): Promise<import("./entities/order.entity").Order[]>;
    findOne(id: string): Promise<import("./entities/order.entity").Order>;
    update(id: string, updateOrderDto: UpdateOrderDto): Promise<import("./entities/order.entity").Order>;
    updateStatus(id: string, statusDto: OrderStatusDto): Promise<import("./entities/order.entity").Order>;
    remove(id: string): Promise<void>;
}
