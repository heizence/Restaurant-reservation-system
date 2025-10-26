// 인증 관련 컴포넌트들을 하나로 묶어서 관리하는 모듈
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { CustomersModule } from '../customers/customers.module';
import { RestaurantsModule } from '../restaurants/restaurants.module';

@Module({
  imports: [
    CustomersModule,
    RestaurantsModule,
    PassportModule, // passport 기능을 사용하기 위해 import

    // JWT 모듈을 비동기로 등록
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService], // useFactory 에 ConfigService 주입
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET_KEY'),
        signOptions: { expiresIn: '1h' }, // 토큰 만료 시간 : 1시간
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
