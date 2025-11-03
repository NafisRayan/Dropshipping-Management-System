import { IsString, IsEnum, IsBoolean, IsOptional } from 'class-validator';
import { AddressType } from '@/common/enums/address-type.enum';

export class CreateAddressDto {
  @IsEnum(AddressType)
  type: AddressType;

  @IsString()
  street: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  postalCode: string;

  @IsString()
  country: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}