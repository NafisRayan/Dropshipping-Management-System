import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';

export class CreateSupplierDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  contact: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  apiUrl?: string;

  @IsString()
  @IsOptional()
  apiKey?: string;
}