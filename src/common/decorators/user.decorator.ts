import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedUser } from '../../auth/interfaces/authenticated-user.interface';

/**
 * 현재 요청(request) 객체에 담긴 user 정보를 반환하는 커스텀 데코레이터
 * JwtAuthGuard가 실행된 후에 사용되어야 합니다.
 *
 * @example
 * someMethod(@User() user: AuthenticatedUser) {
 * const userId = user.userId;
 * }
 */
export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): AuthenticatedUser => {
    // ExecutionContext에서 HTTP 요청 객체를 가져온다.
    const request = ctx.switchToHttp().getRequest();

    // request.user에 담긴 사용자 정보를 반환
    // (JwtStrategy의 validate() 반환 값)
    return request.user;
  },
);
