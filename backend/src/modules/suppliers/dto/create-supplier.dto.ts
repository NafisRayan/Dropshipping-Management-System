import { IsString, IsOptional, IsUrl } from 'class-validator';

export class CreateSupplierDto {
  @IsString()
  name: string;

  @IsUrl()
  apiUrl: string;

  @IsString()
  apiKey: string;

  @IsOptional()
  @IsString()
  contactEmail?: string;

  @IsOptional()
  @IsString()
  contactPhone?: string;
}