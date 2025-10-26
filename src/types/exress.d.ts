import { UserPayload } from '../auth/interfaces/user-payload.interface';

declare global {
  namespace Express {
    // 기존 Express의 User 인터페이스를 확장
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    export type User = UserPayload;
  }
}
