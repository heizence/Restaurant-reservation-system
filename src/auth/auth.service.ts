// 실제 로그인 로직을 처리하는 service
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CustomersService } from '../customers/customers.service';
import { RestaurantsService } from '../restaurants/restaurants.service';
import * as bcrypt from 'bcrypt'; // 비밀번호 해시/비교를 위한 bcrypt
import { LoginDto } from './dto/login.dto';
import { Customer } from '../entities/customer.entity';
import { Restaurant } from '../entities/restaurant.entity';
import { Role } from './roles.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly customersService: CustomersService,
    private readonly restaurantsService: RestaurantsService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto, role: Role.Customer | Role.Restaurant) {
    const { login_id, password } = loginDto;

    let user: Customer | Restaurant | null;
    // 전달받은 role에 따라 적절한 서비스의 메소드를 호출
    if (role === Role.Customer) {
      user = await this.customersService.findByLoginId(login_id);
    } else {
      user = await this.restaurantsService.findByLoginId(login_id);
    }

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException(
        '아이디 또는 비밀번호가 일치하지 않습니다.',
      );
    }

    const payload = {
      login_id: user.login_id,
      sub: user.id,
      role,
    };

    // payload를 기반으로 JWT 토큰(access_token)을 생성
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
