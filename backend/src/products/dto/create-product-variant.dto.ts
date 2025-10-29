import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateProductVariantDto {
  @IsString()
  @IsOptional()
  size?: string;

  @IsString()
  @IsOptional()
  color?: string;

  @IsNumber()
  @IsOptional()
  additionalPrice?: number;

  @IsNumber()
  @IsOptional()
  stock?: number;
}