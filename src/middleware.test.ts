import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest, NextResponse } from 'next/server'
import { middleware } from './middleware'
import * as jwtUtils from './lib/jwt-utils'

// Mock the jwt-utils module
vi.mock('./lib/jwt-utils', () => ({
  getUserFromToken: vi.fn(),
}))

describe('Middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Protected Routes (/dashboard)', () => {
    it('should redirect to login when accessing /dashboard without token', async () => {
      const request = new NextRequest('http://localhost:3000/dashboard')
      vi.mocked(jwtUtils.getUserFromToken).mockResolvedValue(null)

      const response = await middleware(request)

      expect(response.status).toBe(307) // Redirect status
      expect(response.headers.get('location')).toBe('http://localhost:3000/login?redirect=%2Fdashboard')
    })

    it('should redirect to login when accessing /dashboard with expired token', async () => {
      const request = new NextRequest('http://localhost:3000/dashboard', {
        headers: {
          cookie: 'payload-token=expired-token',
        },
      })
      // getUserFromToken returns null for expired tokens
      vi.mocked(jwtUtils.getUserFromToken).mockResolvedValue(null)

      const response = await middleware(request)

      expect(response.status).toBe(307)
      expect(response.headers.get('location')).toBe('http://localhost:3000/login?redirect=%2Fdashboard')
      expect(jwtUtils.getUserFromToken).toHaveBeenCalledWith('expired-token')
    })

    it('should redirect to login when accessing /dashboard with invalid token', async () => {
      const request = new NextRequest('http://localhost:3000/dashboard', {
        headers: {
          cookie: 'payload-token=invalid-token',
        },
      })
      vi.mocked(jwtUtils.getUserFromToken).mockResolvedValue(null)

      const response = await middleware(request)

      expect(response.status).toBe(307)
      expect(response.headers.get('location')).toBe('http://localhost:3000/login?redirect=%2Fdashboard')
    })

    it('should allow access to /dashboard with valid token', async () => {
      const request = new NextRequest('http://localhost:3000/dashboard', {
        headers: {
          cookie: 'payload-token=valid-token',
        },
      })
      vi.mocked(jwtUtils.getUserFromToken).mockResolvedValue({
        id: 'user-123',
        collection: 'employees',
        email: 'test@example.com',
        sid: 'session-123',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
      })

      const response = await middleware(request)

      expect(response.status).toBe(200)
      expect(jwtUtils.getUserFromToken).toHaveBeenCalledWith('valid-token')
    })

    it('should preserve redirect parameter in login URL', async () => {
      const request = new NextRequest('http://localhost:3000/dashboard/settings')
      vi.mocked(jwtUtils.getUserFromToken).mockResolvedValue(null)

      const response = await middleware(request)

      expect(response.headers.get('location')).toBe(
        'http://localhost:3000/login?redirect=%2Fdashboard%2Fsettings',
      )
    })
  })

  describe('Auth Routes (/login, /forgot-password)', () => {
    it('should allow access to /login without token', async () => {
      const request = new NextRequest('http://localhost:3000/login')
      vi.mocked(jwtUtils.getUserFromToken).mockResolvedValue(null)

      const response = await middleware(request)

      expect(response.status).toBe(200)
    })

    it('should allow access to /forgot-password without token', async () => {
      const request = new NextRequest('http://localhost:3000/forgot-password')
      vi.mocked(jwtUtils.getUserFromToken).mockResolvedValue(null)

      const response = await middleware(request)

      expect(response.status).toBe(200)
    })

    it('should redirect to /dashboard when accessing /login with valid token', async () => {
      const request = new NextRequest('http://localhost:3000/login', {
        headers: {
          cookie: 'payload-token=valid-token',
        },
      })
      vi.mocked(jwtUtils.getUserFromToken).mockResolvedValue({
        id: 'user-123',
        collection: 'employees',
        email: 'test@example.com',
        sid: 'session-123',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
      })

      const response = await middleware(request)

      expect(response.status).toBe(307)
      expect(response.headers.get('location')).toBe('http://localhost:3000/dashboard')
    })

    it('should redirect to /dashboard when accessing /forgot-password with valid token', async () => {
      const request = new NextRequest('http://localhost:3000/forgot-password', {
        headers: {
          cookie: 'payload-token=valid-token',
        },
      })
      vi.mocked(jwtUtils.getUserFromToken).mockResolvedValue({
        id: 'user-123',
        collection: 'employees',
        email: 'test@example.com',
        sid: 'session-123',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
      })

      const response = await middleware(request)

      expect(response.status).toBe(307)
      expect(response.headers.get('location')).toBe('http://localhost:3000/dashboard')
    })

    it('should allow access to /login with expired token', async () => {
      const request = new NextRequest('http://localhost:3000/login', {
        headers: {
          cookie: 'payload-token=expired-token',
        },
      })
      vi.mocked(jwtUtils.getUserFromToken).mockResolvedValue(null)

      const response = await middleware(request)

      expect(response.status).toBe(200)
      expect(jwtUtils.getUserFromToken).toHaveBeenCalledWith('expired-token')
    })
  })

  describe('Token Expiration Handling', () => {
    it('should treat expired token same as no token for protected routes', async () => {
      const requestWithExpiredToken = new NextRequest('http://localhost:3000/dashboard', {
        headers: {
          cookie: 'payload-token=expired-token',
        },
      })
      const requestWithoutToken = new NextRequest('http://localhost:3000/dashboard')

      vi.mocked(jwtUtils.getUserFromToken).mockResolvedValue(null)

      const responseExpired = await middleware(requestWithExpiredToken)
      const responseNoToken = await middleware(requestWithoutToken)

      expect(responseExpired.status).toBe(responseNoToken.status)
      expect(responseExpired.headers.get('location')).toBe(responseNoToken.headers.get('location'))
    })

    it('should verify token expiration through getUserFromToken', async () => {
      const request = new NextRequest('http://localhost:3000/dashboard', {
        headers: {
          cookie: 'payload-token=some-token',
        },
      })
      vi.mocked(jwtUtils.getUserFromToken).mockResolvedValue(null)

      await middleware(request)

      expect(jwtUtils.getUserFromToken).toHaveBeenCalledTimes(1)
      expect(jwtUtils.getUserFromToken).toHaveBeenCalledWith('some-token')
    })
  })

  describe('Public Routes', () => {
    it('should allow access to root path without token', async () => {
      const request = new NextRequest('http://localhost:3000/')
      vi.mocked(jwtUtils.getUserFromToken).mockResolvedValue(null)

      const response = await middleware(request)

      expect(response.status).toBe(200)
    })

    it('should allow access to public routes with token', async () => {
      const request = new NextRequest('http://localhost:3000/', {
        headers: {
          cookie: 'payload-token=valid-token',
        },
      })
      vi.mocked(jwtUtils.getUserFromToken).mockResolvedValue({
        id: 'user-123',
        collection: 'employees',
        email: 'test@example.com',
        sid: 'session-123',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
      })

      const response = await middleware(request)

      expect(response.status).toBe(200)
    })
  })

  describe('Edge Cases', () => {
    it('should handle missing cookie header gracefully', async () => {
      const request = new NextRequest('http://localhost:3000/dashboard')
      vi.mocked(jwtUtils.getUserFromToken).mockResolvedValue(null)

      const response = await middleware(request)

      expect(response.status).toBe(307)
      expect(jwtUtils.getUserFromToken).toHaveBeenCalledWith('')
    })

    it('should handle empty token value', async () => {
      const request = new NextRequest('http://localhost:3000/dashboard', {
        headers: {
          cookie: 'payload-token=',
        },
      })
      vi.mocked(jwtUtils.getUserFromToken).mockResolvedValue(null)

      const response = await middleware(request)

      expect(response.status).toBe(307)
      expect(response.headers.get('location')).toContain('/login')
    })

    it('should handle malformed token', async () => {
      const request = new NextRequest('http://localhost:3000/dashboard', {
        headers: {
          cookie: 'payload-token=malformed.token.here',
        },
      })
      vi.mocked(jwtUtils.getUserFromToken).mockResolvedValue(null)

      const response = await middleware(request)

      expect(response.status).toBe(307)
      expect(response.headers.get('location')).toContain('/login')
    })

    it('should handle nested dashboard routes', async () => {
      const request = new NextRequest('http://localhost:3000/dashboard/settings/profile', {
        headers: {
          cookie: 'payload-token=valid-token',
        },
      })
      vi.mocked(jwtUtils.getUserFromToken).mockResolvedValue({
        id: 'user-123',
        collection: 'employees',
        email: 'test@example.com',
        sid: 'session-123',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
      })

      const response = await middleware(request)

      expect(response.status).toBe(200)
    })

    it('should preserve query parameters in redirect URL', async () => {
      const request = new NextRequest('http://localhost:3000/dashboard?tab=profile')
      vi.mocked(jwtUtils.getUserFromToken).mockResolvedValue(null)

      const response = await middleware(request)

      expect(response.headers.get('location')).toBe(
        'http://localhost:3000/login?redirect=%2Fdashboard%3Ftab%3Dprofile',
      )
    })
  })

  describe('Token Validation', () => {
    it('should validate token has required fields', async () => {
      const request = new NextRequest('http://localhost:3000/dashboard', {
        headers: {
          cookie: 'payload-token=valid-token',
        },
      })
      vi.mocked(jwtUtils.getUserFromToken).mockResolvedValue({
        id: 'user-123',
        collection: 'employees',
        email: 'test@example.com',
        sid: 'session-123',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
      })

      const response = await middleware(request)

      expect(response.status).toBe(200)
    })

    it('should reject token without user ID', async () => {
      const request = new NextRequest('http://localhost:3000/dashboard', {
        headers: {
          cookie: 'payload-token=invalid-token',
        },
      })
      // getUserFromToken returns null if token is missing id
      vi.mocked(jwtUtils.getUserFromToken).mockResolvedValue(null)

      const response = await middleware(request)

      expect(response.status).toBe(307)
      expect(response.headers.get('location')).toContain('/login')
    })
  })
})
