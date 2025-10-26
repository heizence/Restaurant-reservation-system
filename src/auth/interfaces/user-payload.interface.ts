// JWT 토큰의 payload와 req.user 객체의 타입을 정의하는 인터페이스
import { Role } from '../roles.enum';

export interface UserPayload {
  sub: number;
  login_id: string;
  role: Role;
}
