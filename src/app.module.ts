import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config'; // 환경 변수 관리 모듈
import { TypeOrmModule } from '@nestjs/typeorm'; // TypeORM 연동 모듈
import * as path from 'path';
import { AppController } from './app.controller'; // root 컨트롤러
import { AppService } from './app.service'; // root 서비스
import { AuthModule } from './auth/auth.module'; // 인증 모듈
import { CustomersModule } from './customers/customers.module'; // 고객 관련 모듈
import { RestaurantsModule } from './restaurants/restaurants.module'; // 식당 관련 모듈
import { MenusModule } from './menus/menus.module'; // 메뉴 관련 모듈
import { ReservationsModule } from './reservations/reservations.module'; // 예약 관련 모듈
import * as Joi from 'joi'; // Joi 임포트

@Module({
  imports: [
    // 환경 변수 설정
    ConfigModule.forRoot({
      isGlobal: true, // ConfigModule 을 전역 모듈로 설정. 다른 모듈에서 import 를 할 필요가 없음.
      //envFilePath: '.env',
      envFilePath: path.resolve(__dirname, '..', '.env'),

      // 환경 변수 유효성 검사 스키마 추가
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        SERVER_PORT: Joi.number().default(8000),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),
        JWT_SECRET_KEY: Joi.string().required(),
      }),
    }),

    // TypeORM 모듈 비동기 설정
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // TypeORM 설정 내에서 ConfigService 를 사용하기 위해 ConfigModule 을 임포트
      inject: [ConfigService], // useFactory 에 ConfigService 를 주입
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: (configService.get<number>('DB_PORT'), 3306),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],

        // 테스트 환경일 때는 true. 실행 시마다 데이터 자동 초기화
        // 그 외 환경에서는 false. 엔티티와 DB 스키마 자동 동기화 안 함 (데이터 유실 방지)
        synchronize: true, // configService.get<string>('NODE_ENV') === 'development',

        // 실행되는 SQL 쿼리문 로깅하기. 'development' 환경일 때만 logging: true
        logging: configService.get<string>('NODE_ENV') === 'development',
      }),
    }),
    AuthModule,
    CustomersModule,
    RestaurantsModule,
    MenusModule,
    ReservationsModule,
  ],
  controllers: [AppController], // root 모듈 컨트롤러(상태 확인용)
  providers: [AppService], // root 모듈의 provider
})
export class AppModule {}
