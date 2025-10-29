import { IsString, IsNumber } from 'class-validator';

export class CreateProductVariantDto {
  @IsString()
  name: string;

  @IsString()
  value: string;

  @IsNumber()
  priceModifier: number;

  @IsNumber()
  stock: number;
}