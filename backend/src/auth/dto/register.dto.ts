import { IsEmail, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { Role } from '../../entities/user.entity';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}