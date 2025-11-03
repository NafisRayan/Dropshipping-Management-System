import { IsEnum, IsOptional, IsString } from 'class-validator';
import { OrderStatus } from '@/common/enums/order-status.enum';

export class OrderStatusDto {
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}