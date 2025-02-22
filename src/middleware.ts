import { withMiddlewareAuthRequired } from '@auth0/nextjs-auth0/edge';

export default withMiddlewareAuthRequired()
export const config = {
  matcher: [
    '/upload',
    '/image/:imageId*', 
    '/user/:path*',
    '/search/:path*',
    '/explore/:path*',
    '/manage/pictures/:path*',
    '/settings',
    '/api',
  ]
};
