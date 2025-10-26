// 식당 정보를 불러오는 service
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant } from '../entities/restaurant.entity';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantsRepository: Repository<Restaurant>,
  ) {}

  async findByLoginId(login_id: string): Promise<Restaurant | null> {
    return this.restaurantsRepository.findOne({
      where: { login_id },
      select: ['id', 'login_id', 'password'],
    });
  }
}
