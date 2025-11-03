import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
import { UsersService } from '@/modules/users/users.service';
import { JwtPayloadDto } from '../dto/jwt-payload.dto';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private configService;
    private usersService;
    constructor(configService: ConfigService, usersService: UsersService);
    validate(payload: JwtPayloadDto): Promise<import("../../users/entities/user.entity").User>;
}
export {};
