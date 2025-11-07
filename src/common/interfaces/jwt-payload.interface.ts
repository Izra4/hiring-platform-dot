export interface JwtPayload extends Request {
  user: {
    sub: string;
    email: string;
    role: string;
    iat?: number;
    exp?: number;
  };
}
