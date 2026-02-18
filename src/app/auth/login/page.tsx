// src/app/auth/login/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'

export default function LoginPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Erro ao fazer login')
            }

            toast.success('Login realizado com sucesso!')
            router.push('/dashboard')

        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Erro ao fazer login')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col h-screen">
            <div className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="mb-8 text-center">
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-500 mb-4">
                            <span className="text-xl font-bold text-white">T</span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Entre na sua conta</h1>
                        <p className="text-gray-500 mt-2">
                            Acesse sua área de tarefas
                        </p>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    autoComplete="new-email"
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="seu@email.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Senha
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={formData.password}
                                    autoComplete="new-password"
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="••••••••"
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 text-indigo-500 rounded border-gray-300"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">Lembrar-me</span>
                                </label>

                                <Link
                                    href="#"
                                    className="text-sm text-indigo-500 hover:text-indigo-500"
                                >
                                    Esqueceu a senha?
                                </Link>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-2.5 px-4 bg-indigo-500 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                            >
                                {loading ? 'Entrando...' : 'Entrar'}
                            </button>
                        </form>

                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <p className="text-center text-gray-500 text-sm">
                                Não tem uma conta?{' '}
                                <Link
                                    href="/auth/register"
                                    className="font-medium text-indigo-500 hover:text-indigo-500"
                                >
                                    Cadastre-se
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}