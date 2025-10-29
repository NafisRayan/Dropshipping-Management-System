import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
export declare class OrdersController {
    private ordersService;
    constructor(ordersService: OrdersService);
    findAll(): Promise<import("../entities/order.entity").Order[]>;
    findOne(id: string): Promise<import("../entities/order.entity").Order | null>;
    create(createOrderDto: CreateOrderDto): Promise<import("../entities/order.entity").Order>;
    update(id: string, updateOrderDto: UpdateOrderDto): Promise<import("../entities/order.entity").Order | null>;
    remove(id: string): Promise<void>;
}
