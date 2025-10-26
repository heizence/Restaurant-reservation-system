// 예약 기능에 관련된 비즈니스 로직을 처리하는 service
import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, LessThan, MoreThan, Repository } from 'typeorm';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { Reservation } from '../entities/reservation.entity';
import { ReservationMenu } from '../entities/reservation-menu.entity';
import { QueryReservationDto } from './dto/query-reservation.dto';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationsRepository: Repository<Reservation>,
    @InjectRepository(ReservationMenu)
    private readonly reservationMenusRepository: Repository<ReservationMenu>,
    private readonly dataSource: DataSource, // 트랜잭션 처리를 위해 DataSource 주입
  ) {}

  // 예약 생성 (트랜잭션 적용)
  async create(createReservationDto: CreateReservationDto, customerId: number) {
    const { restaurantId, startTime, endTime, menus, partySize } =
      createReservationDto;

    // 1. 현재 시간과 예약 시작 시간을 비교
    const now = new Date();
    if (new Date(startTime) < now) {
      throw new BadRequestException(
        '지난 날짜 및 시간에는 예약할 수 없습니다.',
      );
    }

    // 2. 종료 시간이 시작 시간보다 빠르거나 같은지 확인
    if (new Date(endTime) <= new Date(startTime)) {
      throw new BadRequestException(
        '예약 종료 시간은 시작 시간보다 이후여야 합니다.',
      );
    }

    // 3. 예약 시간 중복 확인
    const existingReservation = await this.reservationsRepository.findOne({
      where: {
        restaurant_id: restaurantId,
        start_time: LessThan(endTime),
        end_time: MoreThan(startTime),
      },
    });

    if (existingReservation) {
      throw new ConflictException('해당 시간에 이미 예약이 존재합니다.');
    }

    // 4. 트랜잭션 시작
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE'); // 격리 수준을 'SERIALIZABLE'로 설정

    try {
      // 예약 중복 확인
      const existingReservation = await queryRunner.manager.findOne(
        Reservation,
        {
          where: {
            restaurant_id: restaurantId,
            start_time: LessThan(endTime),
            end_time: MoreThan(startTime),
          },
        },
      );

      if (existingReservation) {
        throw new ConflictException('해당 시간에 이미 예약이 존재합니다.');
      }

      // DTO의 camelCase 속성을 Entity의 snake_case 속성으로 명시적으로 매핑
      const reservationData = {
        restaurant_id: restaurantId,
        customer_id: customerId,
        start_time: startTime, // startTime -> start_time
        end_time: endTime, // endTime ->
        party_size: partySize,
      };

      // 4-1. 예약 정보 저장
      const reservation = queryRunner.manager.create(
        Reservation,
        reservationData,
      );
      const savedReservation = await queryRunner.manager.save(reservation);

      // 4-2. 예약 메뉴 정보 저장
      const reservationMenus = menus.map((menu) =>
        queryRunner.manager.create(ReservationMenu, {
          reservation_id: savedReservation.id,
          menu_id: menu.menuId,
          quantity: menu.quantity,
        }),
      );
      await queryRunner.manager.save(reservationMenus);

      // 4-3. 트랜잭션 커밋
      await queryRunner.commitTransaction();
      return savedReservation;
    } catch (err) {
      // 에러 발생 시 롤백
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      // 쿼리 러너 해제
      await queryRunner.release();
    }
  }

  // 고객 ID로 모든 예약 조회
  findAllByCustomer(customerId: number) {
    return this.reservationsRepository.find({
      where: { customer_id: customerId },
      relations: ['restaurant', 'reservationMenus', 'reservationMenus.menu'], // 관련된 정보 함께 로드
    });
  }

  // 식당 ID로 모든 예약 조회 (필터링 기능 포함)
  findAllByRestaurant(restaurantId: number, query: QueryReservationDto) {
    const queryBuilder = this.reservationsRepository
      .createQueryBuilder('reservation')
      .leftJoinAndSelect('reservation.customer', 'customer')
      .leftJoinAndSelect('reservation.reservationMenus', 'reservationMenus')
      .leftJoinAndSelect('reservationMenus.menu', 'menu')
      .where('reservation.restaurant_id = :restaurantId', { restaurantId });

    if (query.phoneNumber) {
      queryBuilder.andWhere('customer.phone_number LIKE :phoneNumber', {
        phoneNumber: `%${query.phoneNumber}%`,
      });
    }
    if (query.reservationDate) {
      // 날짜의 시작과 끝으로 범위 검색
      const startOfDay = new Date(query.reservationDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(query.reservationDate);
      endOfDay.setHours(23, 59, 59, 999);
      queryBuilder.andWhere('reservation.start_time BETWEEN :start AND :end', {
        start: startOfDay,
        end: endOfDay,
      });
    }
    if (query.minPartySize) {
      queryBuilder.andWhere('reservation.party_size >= :minPartySize', {
        minPartySize: query.minPartySize,
      });
    }
    if (query.menuName) {
      queryBuilder.andWhere('menu.name LIKE :menuName', {
        menuName: `%${query.menuName}%`,
      });
    }

    return queryBuilder.getMany();
  }

  // 예약 수정
  async update(
    id: number,
    updateReservationDto: UpdateReservationDto,
    customerId: number,
  ) {
    const reservation = await this.reservationsRepository.findOne({
      where: { id },
    });

    if (!reservation) {
      throw new NotFoundException(`Reservation with ID ${id} not found.`);
    }
    // 소유권 확인
    if (reservation.customer_id !== customerId) {
      throw new ForbiddenException(
        'You do not have permission to update this reservation.',
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 인원수 업데이트
      if (updateReservationDto.partySize) {
        reservation.party_size = updateReservationDto.partySize;
        await queryRunner.manager.save(reservation);
      }

      // 메뉴 업데이트 (기존 메뉴 삭제 후 새로 추가)
      if (updateReservationDto.menus) {
        // 1. 기존 메뉴 삭제
        await queryRunner.manager.delete(ReservationMenu, {
          reservation_id: id,
        });

        // 2. 새 메뉴 추가
        const newMenus = updateReservationDto.menus.map((menu) =>
          queryRunner.manager.create(ReservationMenu, {
            reservation_id: id,
            menu_id: menu.menuId,
            quantity: menu.quantity,
          }),
        );
        await queryRunner.manager.save(newMenus);
      }

      await queryRunner.commitTransaction();
      return this.reservationsRepository.findOne({
        where: { id },
        relations: ['reservationMenus', 'reservationMenus.menu'],
      });
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  // 예약 취소
  async remove(id: number, customerId: number): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let affectedRows = 0;

    try {
      // 1. [선행] 자식 테이블(reservation_menus)의 데이터를 먼저 삭제
      await queryRunner.manager.delete(ReservationMenu, {
        reservation_id: id,
      });

      // 2. [후행] 부모 테이블(reservations)의 데이터를 삭제 (소유권 검증 포함)
      const deleteResult = await queryRunner.manager.delete(Reservation, {
        id,
        customer_id: customerId, // id와 customer_id가 모두 일치해야 삭제
      });

      affectedRows = deleteResult.affected || 0;

      // 3. 트랜잭션 커밋
      await queryRunner.commitTransaction();
    } catch (err) {
      // 4. 에러 시 롤백
      await queryRunner.rollbackTransaction();
      throw err; // HttpExceptionFilter가 처리하도록 에러를 다시 던짐
    } finally {
      // 5. 쿼리 러너 해제
      await queryRunner.release();
    }

    if (affectedRows === 0) {
      throw new NotFoundException(
        `Reservation with ID ${id} not found or you don't have permission.`,
      );
    }
  }
}
