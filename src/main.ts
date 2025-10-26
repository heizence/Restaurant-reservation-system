// 애플리케이션 진입점
import { NestFactory } from '@nestjs/core'; // NestJS 애플리케이션 인스턴스를 생성하는 NestFactory
import { AppModule } from './app.module'; // 모든 모듈을 통합하는 root module(AppModule)
import { ValidationPipe } from '@nestjs/common'; // 요청 데이터 유효성 검사를 위한 ValidationPipe
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'; // API 문서 자동화를 위한 swagger
import { ConfigService } from '@nestjs/config'; // 환경 변수 관리 모듈
import { HttpExceptionFilter } from './common/http-exception.filter'; // 전역 HttpException 필터

async function bootstrap() {
  const app = await NestFactory.create(AppModule); // AppModule 을 기반으로 NestJS 애플리케이션 인스턴스를 생성
  const configService = app.get(ConfigService);

  // 애플리케이션 전역에 적용될 글로벌 파이프 설정
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에 정의되지 않은 속성은 자동으로 제거
      forbidNonWhitelisted: true, // DTO에 정의되지 않은 속성이 들어오면 400 bad request 에러 발생
      transform: true, // 들어오는 데이터를 DTO 클래스 타입으로 변환
    }),
  );

  // 전역 예외처리 필터 등록
  // 모든 컨트롤러에서 throw new HttpException()은 자동으로 ResponseDto.fail() 형식으로 변환된다.
  app.useGlobalFilters(new HttpExceptionFilter());

  // Swagger 설정을 위한 DocumentBuilder 생성
  const config = new DocumentBuilder()
    .setTitle('식당 예약 시스템 API')
    .setDescription('NestJS 기반 식당 예약 시스템 API 명세서')
    .setVersion('1.0')
    .addBearerAuth() // JWT 인증을 위한 BearerAuth 추가
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // 'api' 경로에 Swagger UI 생성

  const port = configService.get<number>('SERVER_PORT', 8000);

  app.setGlobalPrefix('api/v1'); // 모든 API 경로가 /api/v1/... 로 시작됨
  app.enableShutdownHooks(); // 정상 종료 훅 활성화
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`); // 실행 중인 URL 로깅
}
// 애플리케이션 실행
bootstrap();
