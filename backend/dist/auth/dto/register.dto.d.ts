import { Role } from '../../entities/user.entity';
export declare class RegisterDto {
    email: string;
    password: string;
    role?: Role;
}
