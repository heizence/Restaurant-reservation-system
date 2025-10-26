import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Customer } from './customer.entity';
import { Restaurant } from './restaurant.entity';
import { ReservationMenu } from './reservation-menu.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('reservations')
export class Reservation {
  @ApiProperty({ description: '예약 고유 ID', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '예약 시작 시각' })
  @Column({ type: 'datetime', comment: '예약 시작 시각' })
  start_time: Date;

  @ApiProperty({ description: '예약 종료 시각' })
  @Column({ type: 'datetime', comment: '예약 종료 시각' })
  end_time: Date;

  @ApiProperty({ description: '예약 인원수', example: 2 })
  @Column({ type: 'int', comment: '예약 인원수' })
  party_size: number;

  @ApiProperty({ description: '예약된 식당 ID', example: 1 })
  @Column()
  restaurant_id: number;

  @ApiProperty({ description: '예약한 고객 ID', example: 1 })
  @Column()
  customer_id: number;

  @ApiProperty()
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updated_at: Date;

  @ApiProperty({ type: () => Customer })
  @ManyToOne(() => Customer, (customer) => customer.reservations, {
    onDelete: 'CASCADE', // 고객 데이터 삭제 시 예약 내역도 삭제
  })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @ApiProperty({ type: () => Restaurant })
  @ManyToOne(() => Restaurant, (restaurant) => restaurant.reservations, {
    onDelete: 'CASCADE', // 식당 데이터 삭제 시 예약 내역도 삭제
  })
  @JoinColumn({ name: 'restaurant_id' })
  restaurant: Restaurant;

  // [관계 설정] Reservation(1) : ReservationMenu(N)
  // 하나의 예약은 여러 개의 메뉴 항목(ReservationMenu)을 가짐
  @ApiProperty({ type: () => [ReservationMenu] })
  @OneToMany(
    () => ReservationMenu,
    (reservationMenu) => reservationMenu.reservation,
  )
  reservationMenus: ReservationMenu[];
}
