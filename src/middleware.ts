import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  const userEmail = request.cookies.get('userEmail')?.value
  
  const protectedRoutes = ['/calculator', '/profile']
  const publicRoutes = ['/login']
  
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))
  
  if (isProtectedRoute && !userEmail) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  if (isPublicRoute && userEmail) {
    return NextResponse.redirect(new URL('/profile', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}