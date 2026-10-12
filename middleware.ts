import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware() {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => Boolean(token),
    },
    pages: {
      signIn: '/login',
    },
  },
);

export const config = {
  matcher: ['/dashboard/:path*', '/leads/:path*', '/tasks/:path*', '/reports/:path*', '/contacts/:path*', '/companies/:path*', '/teams/:path*', '/settings/:path*'],
};
