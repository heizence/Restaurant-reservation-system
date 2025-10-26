// 메뉴 관련 API 요청을 받는 엔드포인트를 정의
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Query,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { MenusService } from './menus.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.enum';
import { QueryMenuDto } from './dto/query-menu.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseDto } from '../common/dto/response.dto';
import { Menu } from '../entities/menu.entity';
import { User } from '../common/decorators/user.decorator';
import { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import {
  MenuDeleteResponseDto,
  MenuListResponseDto,
  MenuResponseDto,
} from './dto/menu-response.dto';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';

@ApiTags('Menus (식당)') // Swagger UI에서 'Menus (식당)' 그룹
@ApiBearerAuth() // 해당 컨트롤러의 모든 API에 자물쇠 아이콘 추가
@Controller('menus') // '/menus' 경로
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  @Post()
  @ApiOperation({
    summary: '메뉴 생성',
    description: '식당 주인이 새로운 메뉴를 등록합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '메뉴 생성 성공',
    type: MenuResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: '인증 실패',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: '권한 없음',
    type: ErrorResponseDto,
  })
  @UseGuards(JwtAuthGuard, RolesGuard) // 보안 : 1. 토큰 검사 -> 2. 역할 검사
  @Roles(Role.Restaurant)
  async create(
    @Body() createMenuDto: CreateMenuDto,
    @User() user: AuthenticatedUser,
  ): Promise<ResponseDto<Menu>> {
    const restaurantId = user.userId;
    const menu = await this.menusService.create(createMenuDto, restaurantId);
    return ResponseDto.success(menu, '메뉴가 성공적으로 생성되었습니다.', 201);
  }

  @Get()
  @ApiOperation({
    summary: '메뉴 목록 조회',
    description: '자신의 가게 메뉴 목록을 필터링하여 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '메뉴 목록 조회 성공',
    type: MenuListResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: '권한 없음',
    type: ErrorResponseDto,
  })
  @ApiQuery({
    name: 'name',
    required: false,
    description: '메뉴 이름 (부분 일치)',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Restaurant)
  async findAll(
    @Query() queryMenuDto: QueryMenuDto,
    @User() user: AuthenticatedUser,
  ): Promise<ResponseDto<Menu[]>> {
    const restaurantId = user.userId;
    const menus = await this.menusService.findAllByRestaurant(
      restaurantId,
      queryMenuDto,
    );
    return ResponseDto.success(menus, '메뉴 목록 조회 성공');
  }

  @Delete(':id')
  @ApiOperation({ summary: '메뉴 삭제' })
  @ApiResponse({
    status: 200,
    description: '메뉴 삭제 성공',
    type: MenuDeleteResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: '권한 없음',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: '메뉴를 찾을 수 없음',
    type: ErrorResponseDto,
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Restaurant)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @User() user: AuthenticatedUser,
  ): Promise<ResponseDto<null>> {
    const restaurantId = user.userId;
    await this.menusService.remove(id, restaurantId);
    return ResponseDto.successWithoutData('메뉴가 성공적으로 삭제되었습니다.');
  }
}
