import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const authCookie = request.cookies.get('token');
  const isLoginPage = request.nextUrl.pathname === '/login';

  // If the user doesn't have an auth cookie and is trying to access any page other than login,
  // redirect them to the login page.
  if (!authCookie?.value && !isLoginPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If the user already has an auth cookie and is trying to access the login page,
  // redirect them to the dashboard.
  if (authCookie?.value && isLoginPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Apply middleware to all routes except api, _next/static, _next/image, and specific assets
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|Logo.png|.*\\.png$).*)'],
};
