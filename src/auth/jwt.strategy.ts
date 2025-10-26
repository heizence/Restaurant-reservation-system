// 요청 헤더의 JWT 토큰을 해석하고 유효성을 검증하는 파일.
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { RestaurantsService } from '../restaurants/restaurants.service';
import { CustomersService } from '../customers/customers.service';
import { ConfigService } from '@nestjs/config';
import { UserPayload } from './interfaces/user-payload.interface';
import { Role } from './roles.enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly customersService: CustomersService,
    private readonly restaurantsService: RestaurantsService,
  ) {
    super({
      // 요청 헤더의 'Authorization' 필드에서 'Bearer ' 토큰을 추출
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // 만료된 토큰을 거부 (false가 기본값이지만 명시적으로)
      ignoreExpiration: false, // 만료된 토큰은 거부
      // 토큰 검증에 사용할 비밀 키 (AuthModule의 secret과 동일해야 함)
      secretOrKey: configService.get<string>('JWT_SECRET_KEY')!,
    });
  }

  /**
   * 토큰 검증(서명, 만료시간)이 성공적으로 끝나면 실행되는 메소드
   * @param payload - 토큰 생성 시 넣었던 payload 객체
   * @returns 여기서 반환된 값은 NestJS에 의해 `request.user`에 첨부된다
   */
  async validate(payload: UserPayload) {
    let user;
    /**
     * 만약 사용자가 탈퇴하거나 관리자에 의해 계정이 정지되어도, 토큰이 만료되기 전까지는 서버 접근이 계속 가능함.
     * 이 문제를 방지하기 위해 db 재검증 로직 추가
     */
    if (payload.role === Role.Customer) {
      user = await this.customersService.findByLoginId(payload.login_id);
    } else {
      user = await this.restaurantsService.findByLoginId(payload.login_id);
    }

    // 유저가 DB에 없으면 접근 거부
    if (!user) {
      throw new UnauthorizedException('존재하지 않는 계정입니다.');
    }

    return {
      userId: payload.sub,
      login_id: payload.login_id,
      role: payload.role,
    };
  }
}
