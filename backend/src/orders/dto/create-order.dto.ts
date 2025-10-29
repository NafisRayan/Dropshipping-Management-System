import { IsNumber, Min, IsOptional } from 'class-validator';

export class CreateOrderDto {
  @IsOptional()
  @IsNumber()
  customerId?: number;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNumber()
  productId: number;
}