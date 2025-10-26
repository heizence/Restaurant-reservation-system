import { Role } from '../roles.enum';

/**
 * JwtStrategy.validate()가 반환하는 객체의 타입.
 * req.user에 담기게 될 사용자 정보입니다.
 */
export interface AuthenticatedUser {
  userId: number;
  login_id: string;
  role: Role;
}
