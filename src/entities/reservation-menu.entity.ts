import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Reservation } from './reservation.entity';
import { Menu } from './menu.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('reservation_menus')
export class ReservationMenu {
  @ApiProperty()
  @PrimaryColumn()
  reservation_id: number;

  @ApiProperty()
  @PrimaryColumn()
  menu_id: number;

  @ApiProperty({ example: 2 })
  @Column({ type: 'int', default: 1, comment: '주문 수량' })
  quantity: number;

  // [관계 설정] ReservationMenu(N) : Reservation(1)
  @ManyToOne(() => Reservation, (reservation) => reservation.reservationMenus, {
    onDelete: 'RESTRICT', // 이 메뉴를 참조하는 예약 내역이 있으면 메뉴 삭제(DELETE)를 막음
  })
  @JoinColumn({ name: 'reservation_id' })
  reservation: Reservation;

  // [관계 설정] ReservationMenu(N) : Menu(1)
  @ManyToOne(() => Menu, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'menu_id' })
  menu: Menu;
}
