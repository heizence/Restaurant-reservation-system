import { Injectable } from '@nestjs/common';

@Injectable() // 이 클래스가 NestJS 의 DI 컨테이너에 의해 관리되는 Provider(서비스) 임을 선언한다
export class AppService {
  // 서버 상태를 확인하는 매서드
  getHealthCheck(): { status: string; message: string } {
    return { status: 'ok', message: 'Restaurant Reservation API is running!' };
  }
}
