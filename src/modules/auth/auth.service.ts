import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async logIn(
    email: string,
    pass: string,
  ): Promise<{ token: string } | HttpException> {
    const user = await this.userService.findByEmail(email);

    if (user == null) {
      return new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'email / password invalid',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const isPasswordMatching = await bcrypt.compare(pass, user.password);
    if (!isPasswordMatching) {
      return new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'email / password invalid',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const payload = { sub: user.id, email: user.email, role: user.role };

    return {
      token: await this.jwtService.signAsync(payload),
    };
  }
}
