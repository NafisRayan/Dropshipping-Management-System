import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, IsEmail, IsEnum, IsBoolean } from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import { UserRole } from '@/common/enums/user-role.enum';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}