// 로그인 API 엔드포인트를 정의
import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'; // ApiBody 추가
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Role } from './roles.enum';
import { ResponseDto } from '../common/dto/response.dto';
import { LoginResponseDto } from './dto/auth-response.dto';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';

@ApiTags('Auth (인증)') // swagger 에서 'Auth (인증)' 태그로 그룹화
@Controller('auth') // 이 컨트롤러의 모든 API는 '/auth' 접두사를 가짐
export class AuthController {
  // 생성자를 통해 AuthService를 주입받음 (DI)
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK) // HTTP 상태 코드를 200 으로 응답
  @Post('login/customer') // POST /auth/login/customer 엔드포인트

  // swagger 문서: 이 API 의 요약
  @ApiOperation({
    summary: '고객 로그인',
    description: '고객 계정으로 로그인하여 JWT 토큰을 발급받습니다.',
  })
  @ApiResponse({
    status: 200,
    description: '로그인 성공',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: '인증 실패',
    type: ErrorResponseDto,
  })
  // Swagger 문서: 실패 응답
  @ApiResponse({
    status: 401,
    description: '인증 실패 (계정 또는 비밀번호 불일치)',
  })
  // @Body() 데코레이터로 요청 body를 loginDto 객체로 받아옴 (ValidationPipe가 자동 검증)
  async customerLogin(
    @Body() loginDto: LoginDto,
  ): Promise<ResponseDto<{ access_token: string }>> {
    const token = await this.authService.login(loginDto, Role.Customer);
    return ResponseDto.success(token, '고객 로그인 성공');
  }

  @HttpCode(HttpStatus.OK)
  @Post('login/restaurant') // POST /auth/login/restaurant 엔드포인트
  @ApiOperation({
    summary: '식당 로그인',
    description: '식당 계정으로 로그인하여 JWT 토큰을 발급받습니다.',
  })
  @ApiResponse({ status: 200, description: '로그인 성공, JWT 토큰 반환' })
  @ApiResponse({
    status: 401,
    description: '인증 실패 (계정 또는 비밀번호 불일치)',
  })
  async restaurantLogin(
    @Body() loginDto: LoginDto,
  ): Promise<ResponseDto<{ access_token: string }>> {
    // AuthService의 login 메소드 호출 시, '식당' 역할(Role)을 명시적으로 전달
    const token = await this.authService.login(loginDto, Role.Restaurant);
    return ResponseDto.success(token, '식당 로그인 성공');
  }
}
