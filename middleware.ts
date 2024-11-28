import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { validateToken } from './lib/auth';

export async function middleware(req: NextRequest) {
  const publicPaths = ['/api/auth/login'];
  
  const isPublicPath = publicPaths.some(path => 
    req.nextUrl.pathname.startsWith(path)
  );

  const token = req.cookies.get('token')?.value;

  if (isPublicPath) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  try {
    const decoded = await validateToken(token);
    
    if (!decoded) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL('/', req.url));
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/tasks/:path*', 
    '/api/:path*'
  ],
};
