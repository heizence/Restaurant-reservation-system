import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Menu } from './menu.entity';
import { Reservation } from './reservation.entity';

@Entity('restaurants')
export class Restaurant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true, comment: '로그인 ID' })
  login_id: string;

  @Column({
    type: 'varchar',
    length: 255,
    comment: '해시된 비밀번호',
    select: false,
  })
  password: string;

  @Column({ type: 'varchar', length: 100, comment: '식당 이름' })
  name: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // [관계 설정] Restaurant(1) : Menu(N)
  // 하나의 식당은 여러 개의 메뉴를 가질 수 있음
  @OneToMany(() => Menu, (menu) => menu.restaurant)
  menus: Menu[];

  // [관계 설정] Restaurant(1) : Reservation(N)
  // 하나의 식당은 여러 개의 예약을 가질 수 있음
  @OneToMany(() => Reservation, (reservation) => reservation.restaurant)
  reservations: Reservation[];
}
