export class JwtPayloadDto {
  sub: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}