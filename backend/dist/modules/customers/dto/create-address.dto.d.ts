import { AddressType } from '@/common/enums/address-type.enum';
export declare class CreateAddressDto {
    type: AddressType;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault?: boolean;
}
