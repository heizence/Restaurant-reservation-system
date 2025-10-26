// 메뉴 생성 시 데이터 형식을 정의하고 검사하는 dto
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, Min, IsOptional, IsEnum } from 'class-validator';

export enum MenuCategory {
  KOREAN = '한식',
  CHINESE = '중식',
  JAPANESE = '일식',
  WESTERN = '양식',
  ETC = '기타',
}

export class CreateMenuDto {
  @ApiProperty({
    example: '오늘의 파스타',
    description: '메뉴 이름',
  })
  @IsString()
  name: string;

  @ApiProperty({ example: 15000, description: '메뉴 가격', minimum: 0 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: '양식', description: '카테고리' })
  @IsEnum(MenuCategory)
  category: MenuCategory;

  @ApiProperty({
    example: '메뉴 설명(optional)',
    description: '메뉴에 대한 설명',
  })
  @IsString()
  @IsOptional()
  description?: string;
}
