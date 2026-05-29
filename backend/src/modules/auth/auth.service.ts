import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async login(data: LoginDto) {

    const user = await this.usersService.findByEmail(data.email);

    if(!user){
        throw new UnauthorizedException('E-mail ou senha inválidos');
    }

    const passwordMatches = await bcrypt.compare(data.password, user.password);
    if(!passwordMatches) {
        throw new UnauthorizedException('E-mail ou senha inválidos');
    }

    const payload = { sub: user.id, email: user.email };

    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
        },
        backend_token: this.jwtService.sign(payload),
    };

  }
}
