// 고객 정보를 불러오는 service
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../entities/customer.entity';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customersRepository: Repository<Customer>,
  ) {}

  async findByLoginId(login_id: string): Promise<Customer | null> {
    return this.customersRepository.findOne({
      where: { login_id },
      select: ['id', 'login_id', 'password'],
    });
  }
}
