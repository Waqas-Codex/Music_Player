import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  const { pathname } = request.nextUrl;

  // already logged in
  if (
    token &&
    (pathname === '/login' || pathname === '/register')
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // protected routes
  if (
    !token &&
    (
      pathname.startsWith('/dashboard') ||
      pathname.startsWith('/playlists') ||
      pathname.startsWith('/songs') ||
      pathname.startsWith('/upload')
    )
  ) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/login',
    '/register',
    '/dashboard/:path*',
    '/playlists/:path*',
    '/songs/:path*',
    '/upload/:path*',
  ],
};