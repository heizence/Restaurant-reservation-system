import * as dotenv from 'dotenv';
import * as path from 'path';

// Jest가 테스트를 실행하기 전에 .env 파일을 로드하여 process.env에 설정
const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envPath });
