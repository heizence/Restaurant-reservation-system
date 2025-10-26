// JwtAuthGuard 통과 후, API에 설정된 역할과 사용자의 역할이 맞는지 확인하는 가드.
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './roles.enum';
import { ROLES_KEY } from './roles.decorator'; // @Roles() 데코레이터에서 사용한 메타데이터 키
import { UserPayload } from './interfaces/user-payload.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  // Reflector 서비스 주입
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // @Roles() 데코레이터로 설정된 역할(메타데이터)을 가져온다.
    // getAllAndOverride: 핸들러(메소드)와 클래스 레벨의 메타데이터를 모두 확인하고 병합/재정의
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // 만약 API에 필요한 역할이 설정되어 있지 않다면, 누구나 접근 가능
    // '모든 역할' 또는 '인증만 되면' 접근 가능한 API 로 간주하여 true 반환
    if (!requiredRoles) {
      return true;
    }

    // ExecutionContext에서 HTTP 요청(request) 객체를 가져옴
    const user: UserPayload = context.switchToHttp().getRequest().user;

    // (방어 코드) request.user 객체나 user.role이 없다면 거부
    // (이 가드는 항상 JwtAuthGuard *이후에* 실행되어야 함을 의미)
    if (!user || !user.role) {
      return false;
    }
    // 사용자가 필요한 역할 중 하나라도 가지고 있는지 확인
    return requiredRoles.some((role) => user.role === role);
  }
}
