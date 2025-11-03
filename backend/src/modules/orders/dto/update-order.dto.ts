import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsString } from 'class-validator';
import { CreateOrderDto } from './create-order.dto';
import { OrderStatus } from '@/common/enums/order-status.enum';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @IsOptional()
  @IsString()
  trackingNumber?: string;

  @IsOptional()
  @IsString()
  shippingCarrier?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}