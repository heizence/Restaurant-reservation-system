// 예약 관련 API 요청을 받는 엔드포인트를 정의
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.enum';
import { QueryReservationDto } from './dto/query-reservation.dto';
import { ResponseDto } from '../common/dto/response.dto';
import { Reservation } from '../entities/reservation.entity';
import { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { User } from '../common/decorators/user.decorator';
import {
  ReservationCancelResponseDto,
  ReservationListResponseDto,
  ReservationResponseDto,
} from './dto/reservation-response.dto';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';

@ApiTags('Reservations (예약)')
@ApiBearerAuth() // 이 컨트롤러의 모든 API는 인증 토큰이 필요함을 명시
@UseGuards(JwtAuthGuard, RolesGuard) // 이 컨트롤러의 모든 API에 가드 2개(인증, 인가)를 적용
@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  // 고객: 예약 생성
  @Post()
  @Roles(Role.Customer) // '고객' 역할만 이 API를 호출할 수 있음
  @ApiOperation({
    summary: '예약 생성 (고객용)',
    description: '고객이 식당에 예약을 생성합니다.',
  })
  @ApiResponse({ status: 201, description: '예약 생성 성공' })
  @ApiResponse({ status: 401, description: '인증 실패' })
  @ApiResponse({
    status: 409,
    description: '예약 시간 중복',
    type: ReservationResponseDto,
  })
  async create(
    @Body() createReservationDto: CreateReservationDto,
    @User() user: AuthenticatedUser,
  ): Promise<ResponseDto<Reservation>> {
    const customerId = user.userId;
    const reservation = await this.reservationsService.create(
      createReservationDto,
      customerId,
    );
    return ResponseDto.success(
      reservation,
      '예약이 성공적으로 생성되었습니다.',
      201,
    );
  }

  // 고객: 자신의 예약 목록 조회
  @Get('customer')
  @Roles(Role.Customer)
  @ApiOperation({
    summary: '나의 예약 목록 조회 (고객용)',
    description: '고객이 자신의 예약 내역을 모두 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '조회 성공',
    type: ReservationListResponseDto,
  })
  async findMyReservations(
    @User() user: AuthenticatedUser,
  ): Promise<ResponseDto<Reservation[]>> {
    const customerId = user.userId;
    const reservations =
      await this.reservationsService.findAllByCustomer(customerId);
    return ResponseDto.success(reservations, '나의 예약 목록 조회 성공');
  }

  // 식당: 자신의 가게 예약 목록 조회 (필터링 포함)
  @Get('restaurant')
  @Roles(Role.Restaurant)
  @ApiOperation({
    summary: '가게 예약 목록 조회 (식당용)',
    description: '식당 주인이 자신의 가게 예약 내역을 필터링하여 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '조회 성공',
    type: ReservationListResponseDto,
  })
  async findRestaurantReservations(
    @Query() query: QueryReservationDto,
    @User() user: AuthenticatedUser,
  ): Promise<ResponseDto<Reservation[]>> {
    const restaurantId = user.userId;
    const reservations = await this.reservationsService.findAllByRestaurant(
      restaurantId,
      query,
    );
    return ResponseDto.success(reservations, '가게 예약 목록 조회 성공');
  }

  // 고객: 자신의 예약 수정
  @Patch(':id')
  @Roles(Role.Customer)
  @ApiOperation({
    summary: '예약 수정 (고객용)',
    description: '고객이 자신의 예약을 수정합니다 (인원수, 메뉴).',
  })
  @ApiResponse({
    status: 200,
    description: '수정 성공',
    type: ReservationResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: '권한 없음',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: '예약을 찾을 수 없음',
    type: ErrorResponseDto,
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReservationDto: UpdateReservationDto,
    @User() user: AuthenticatedUser,
  ): Promise<ResponseDto<Reservation>> {
    const customerId = user.userId;
    const updatedReservation = await this.reservationsService.update(
      id,
      updateReservationDto,
      customerId,
    );

    return ResponseDto.success(
      updatedReservation!,
      '예약이 성공적으로 수정되었습니다.',
    );
  }

  // 고객: 자신의 예약 취소
  @Delete(':id')
  @Roles(Role.Customer)
  @ApiOperation({
    summary: '예약 취소 (고객용)',
    description: '고객이 자신의 예약을 취소합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '취소 성공',
    type: ReservationCancelResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: '권한 없음',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: '예약을 찾을 수 없음',
    type: ErrorResponseDto,
  })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @User() user: AuthenticatedUser,
  ): Promise<ResponseDto<null>> {
    const customerId = user.userId;
    await this.reservationsService.remove(id, customerId);
    return ResponseDto.successWithoutData('예약이 성공적으로 취소되었습니다.');
  }
}
