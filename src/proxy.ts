// src/proxy.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

/**
 * Configuração central de rotas protegidas e públicas
 * Padrão v0 Digital para Next.js 16+
 */
const AUTH_ROUTES = ['/auth/login', '/auth/register']
const PROTECTED_ROUTES = ['/dashboard', '/api/tasks', '/api/notifications']

export async function proxy(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.JWT_SECRET
  })

  const { pathname } = request.nextUrl

  // 1. Bloqueia acesso ao Dashboard se não houver token
  if (PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
    if (!token) {
      const url = new URL('/auth/login', request.url)
      url.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(url)
    }
  }

  // 2. Redireciona usuários logados que tentam acessar login/register
  if (AUTH_ROUTES.some(route => pathname.startsWith(route))) {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.next()
}