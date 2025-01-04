import withMiddlewareAuthRequired from '@/middlewares/auth'
import { chain } from './middlewares/chain';
import { withLoggerMiddleware } from './middlewares/logger';

export default chain([withMiddlewareAuthRequired, withLoggerMiddleware]);

export const config = {
  matcher: [
    // '/((?!^$).*)', // 루트 경로를 제외한 모든 경로
    '/upload',
    '/image/:imageId*', 
    '/user/:path*',
    '/search/:path*',
    '/explore/:path*'
  ]
};
