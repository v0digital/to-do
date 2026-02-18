// src/proxy.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/auth'

/**
 * Padrão v0 Digital: As rotas aqui devem ser as URLs do navegador.
 * Route Groups como (auth) são omitidos.
 */
const AUTH_URLS = ['/login', '/register']
const PROTECTED_URLS = ['/dashboard', '/api/tasks', '/api/notifications']

export async function proxy(request: NextRequest) {
  // CORREÇÃO: Busca o token do cookie manual 'auth-token' definido na sua API
  const authToken = request.cookies.get('auth-token')?.value
  const user = authToken ? verifyToken(authToken) : null

  const { pathname } = request.nextUrl

  // 1. Proteção de Rotas Privadas
  if (PROTECTED_URLS.some(route => pathname.startsWith(route))) {
    if (!user) {
      // Redireciona para /login (URL real), não para /(auth)/login
      const url = new URL('/login', request.url)
      url.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(url)
    }
  }

  // 2. Redireciona usuários logados para fora das páginas de autenticação
  if (AUTH_URLS.some(route => pathname.startsWith(route))) {
    if (user) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.next()
}