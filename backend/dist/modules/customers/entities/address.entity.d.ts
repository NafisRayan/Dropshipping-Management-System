import { Customer } from './customer.entity';
import { AddressType } from '@/common/enums/address-type.enum';
export declare class Address {
    id: string;
    customer: Customer;
    type: AddressType;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
    createdAt: Date;
    get fullAddress(): string;
}
