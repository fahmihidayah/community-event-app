import { NextRequest, NextResponse } from 'next/server'
import { getUserFromToken } from './lib/jwt-utils'

/**
 * Middleware to protect routes based on authentication status
 * - Redirects to /login if accessing /dashboard without payload-token
 * - Redirects to /dashboard if accessing /login or /forgot-password with payload-token
 */
export async function middleware(request: NextRequest) {
  const token = request.cookies.get('payload-token')
  const { pathname } = request.nextUrl

  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard']
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  // Auth routes that should redirect if already authenticated
  const authRoutes = ['/login', '/forgot-password']
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

  const decodedToken = await getUserFromToken(token?.value || '')

  console.log('[MIDDLEWARE] Path:', pathname, 'Has token:', !!token, 'Valid token:', !!decodedToken)

  // Redirect to login if accessing protected route without valid token (missing or expired)
  if (isProtectedRoute && !decodedToken) {
    const loginUrl = new URL('/login', request.url)
    // Include both pathname and search params in redirect
    const fullPath = pathname + request.nextUrl.search
    loginUrl.searchParams.set('redirect', fullPath)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect to dashboard if accessing auth routes with valid token
  if (isAuthRoute && decodedToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

/**
 * IMPORTANT:
 * Exclude Payload routes & Next.js internals
 */
export const config = {
  matcher: ['/((?!api|_next|payload|uploads|media|.*\\..*).*)'],
}
