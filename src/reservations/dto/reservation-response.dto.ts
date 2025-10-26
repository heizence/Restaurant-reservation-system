import { ApiProperty } from '@nestjs/swagger';
import { ResponseDto } from '../../common/dto/response.dto';
import { Reservation } from '../../entities/reservation.entity';

/**
 * 예약 1개 조회/생성/수정 응답 DTO
 */
export class ReservationResponseDto extends ResponseDto<Reservation> {
  @ApiProperty({ type: Reservation })
  declare data: Reservation;
}

/**
 * 예약 목록 조회 응답 DTO
 */
export class ReservationListResponseDto extends ResponseDto<Reservation[]> {
  @ApiProperty({ isArray: true, type: Reservation })
  declare data: Reservation[];
}

/**
 * 예약 취소 응답 DTO (데이터 없음)
 */
export class ReservationCancelResponseDto extends ResponseDto<null> {
  @ApiProperty({ example: 200 })
  declare code: number;

  @ApiProperty({ example: '예약이 성공적으로 취소되었습니다.' })
  declare message: string;

  @ApiProperty({ example: null, nullable: true })
  declare data: null;
}
