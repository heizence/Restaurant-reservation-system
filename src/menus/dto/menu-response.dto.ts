import { ApiProperty } from '@nestjs/swagger';
import { ResponseDto } from '../../common/dto/response.dto';
import { Menu } from '../../entities/menu.entity';

/**
 * 메뉴 1개 조회/생성 응답 DTO
 */
export class MenuResponseDto extends ResponseDto<Menu> {
  @ApiProperty({ type: Menu }) // [중요] data의 타입을 엔티티로 명시
  declare data: Menu;
}

/**
 * 메뉴 목록 조회 응답 DTO
 */
export class MenuListResponseDto extends ResponseDto<Menu[]> {
  @ApiProperty({ isArray: true, type: Menu }) // [중요] data가 배열임을 명시
  declare data: Menu[];
}

/**
 * 메뉴 삭제 응답 DTO (데이터 없음)
 */
export class MenuDeleteResponseDto extends ResponseDto<null> {
  @ApiProperty({ example: 200 })
  declare code: number;

  @ApiProperty({ example: '메뉴가 성공적으로 삭제되었습니다.' })
  declare message: string;

  @ApiProperty({ example: null, nullable: true })
  declare data: null;
}
