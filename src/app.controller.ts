import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

// '/' 경로에 대한 컨트롤러
@Controller()
export class AppController {
  // 생성자를 통해 AppService 를 주입받음(DI)
  constructor(private readonly appService: AppService) {}

  @Get()
  getHealthCheck(): { status: string; message: string } {
    return this.appService.getHealthCheck();
  }
}
