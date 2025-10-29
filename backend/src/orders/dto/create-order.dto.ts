import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  customerId: string;

  @IsNumber()
  productId: number;

  @IsNumber()
  quantity: number;
}