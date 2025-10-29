import { IsString, IsNotEmpty, IsEmail, IsNumber, Min } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @IsEmail()
  customerEmail: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNumber()
  productId: number;
}