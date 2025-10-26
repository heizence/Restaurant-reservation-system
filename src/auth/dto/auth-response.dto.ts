import { ApiProperty } from '@nestjs/swagger';
import { ResponseDto } from '../../common/dto/response.dto';

class LoginDataDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT Access Token',
  })
  access_token: string;
}

/**
 * 로그인 성공 응답 DTO
 */
export class LoginResponseDto extends ResponseDto<LoginDataDto> {
  @ApiProperty({ type: LoginDataDto })
  declare data: LoginDataDto;
}
