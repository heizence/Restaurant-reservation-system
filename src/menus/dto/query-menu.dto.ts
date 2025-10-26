// 메뉴 조회 시 데이터 형식을 정의하고 검사하는 dto
import {
  IsString,
  IsNumberString,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class QueryMenuDto {
  @ApiProperty({ required: false, description: '메뉴 이름 필터' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false, description: '최소 가격 필터' })
  @IsNumberString()
  @IsOptional()
  minPrice?: number;

  @ApiProperty({ required: false, description: '최대 가격 필터' })
  @Type(() => Number) // 쿼리 파라미터(string)를 number로 변환
  @IsNumber()
  @IsOptional()
  maxPrice?: string;
}
