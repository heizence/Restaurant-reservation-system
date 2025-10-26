import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn, // 외래 키(FK) 컬럼 지정
} from 'typeorm';
import { Restaurant } from './restaurant.entity';
import { MenuCategory } from '../menus/dto/create-menu.dto';
import { ApiProperty } from '@nestjs/swagger';

@Entity('menus')
export class Menu {
  @ApiProperty({ description: '메뉴 고유 ID', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '메뉴 이름', example: '오늘의 파스타' })
  @Column({ type: 'varchar', length: 100, comment: '메뉴 이름' })
  name: string;

  @ApiProperty({ description: '메뉴 가격', example: 15000 })
  @Column({ type: 'int', comment: '가격' })
  price: number;

  @ApiProperty({
    description: '카테고리',
    example: '양식',
    enum: MenuCategory,
  })
  @Column({
    type: 'enum',
    enum: MenuCategory,
    comment: '일식, 중식, 양식 등',
  })
  category: MenuCategory;

  @ApiProperty({
    description: '메뉴 설명',
    example: '신선한 재료로 만든 파스타',
    nullable: true,
  })
  @Column({ type: 'text', nullable: true, comment: '메뉴 설명' })
  description: string;

  @ApiProperty({ description: '메뉴가 속한 식당 ID', example: 1 })
  @Column({ type: 'int', comment: '메뉴가 있는 식당의 id' })
  restaurant_id: number;

  @ApiProperty()
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updated_at: Date;

  // [관계 설정] Menu(N) : Restaurant(1)
  // 여러 개의 메뉴는 하나의 식당에 속함
  @ManyToOne(() => Restaurant, (restaurant) => restaurant.menus, {
    onDelete: 'CASCADE', // 식당이 삭제되면 메뉴도 함께 삭제됨
  })
  @JoinColumn({ name: 'restaurant_id' })
  restaurant: Restaurant;
}
