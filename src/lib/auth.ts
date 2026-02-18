// src/alib/auth.ts
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-in-production'

export interface UserToken {
  id: string
  email: string
  name?: string
}

export function createToken(user: UserToken): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): UserToken | null {
  try {
    return jwt.verify(token, JWT_SECRET) as UserToken
  } catch {
    return null
  }
}

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value

    if (!token) return null

    return verifyToken(token)
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

// CORRIGIR: Esta função não funciona em server components
// export function setAuthToken(token: string) {
//   const cookieStore = cookies()
//   cookieStore.set('auth-token', token, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === 'production',
//     sameSite: 'strict',
//     maxAge: 60 * 60 * 24 * 7,
//     path: '/'
//   })
// }

// NOVA FUNÇÃO para usar em API routes
export function setAuthTokenResponse(token: string, response: NextResponse) {
  response.cookies.set({
    name: 'auth-token',
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/'
  })
  return response
}

export async function clearAuthToken() {
  const cookieStore = await cookies()
  cookieStore.delete('auth-token')
}