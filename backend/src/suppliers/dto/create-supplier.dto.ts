import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class CreateSupplierDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  contact: string;

  @IsEmail()
  email: string;
}