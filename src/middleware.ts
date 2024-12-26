import { withMiddlewareAuthRequired } from '@auth0/nextjs-auth0/edge';

export default withMiddlewareAuthRequired();

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
