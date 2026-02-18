// src/app/(auth)/login/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { Eye, EyeOff, LogIn } from 'lucide-react'

export default function LoginPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
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

            toast.success('Bem-vindo de volta!')
            router.push('/dashboard')

        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Erro ao fazer login')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen flex-col bg-white dark:bg-gray-950">
            <div className="flex flex-1 items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="mb-10 text-center">
                        <div className="bg-linear-to-br from-gray-800 to-gray-950 dark:from-gray-50 dark:to-gray-200 inline-flex h-14 w-14 items-center justify-center rounded-2xl mb-4 shadow-xl">
                            <span className="text-2xl font-bold text-white dark:text-gray-950 font-mono">v0</span>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-50 tracking-tight">
                            Acesse sua conta
                        </h1>
                        <p className="mt-2 text-gray-500 dark:text-gray-100">
                            Continue gerenciando seus projetos
                        </p>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-950 shadow-xs">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 dark:text-gray-50 mb-2">
                                    E-mail
                                </label>
                                <input
                                    type="email"
                                    required
                                    autoComplete="new-email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-800 outline-none transition-all focus:border-gray-800 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50 dark:focus:border-gray-50"
                                    placeholder="seu@email.com"
                                />
                            </div>

                            <div className="relative">
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-semibold text-gray-800 dark:text-gray-50">
                                        Senha
                                    </label>
                                    <Link
                                        href="/forgot-password"
                                        className="text-xs font-medium text-gray-400 hover:text-gray-800 dark:text-gray-200 dark:hover:text-gray-50"
                                    >
                                        Esqueceu a senha?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        autoComplete="new-password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pr-12 text-gray-800 outline-none transition-all focus:border-gray-800 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50 dark:focus:border-gray-50"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-800 dark:hover:text-gray-50"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="remember"
                                    className="h-4 w-4 rounded border-gray-300 text-gray-800 focus:ring-0 dark:border-gray-800 dark:bg-gray-950"
                                />
                                <label htmlFor="remember" className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-100">
                                    Lembrar-me por 30 dias
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative flex w-full items-center justify-center rounded-xl bg-gray-800 py-3 font-semibold text-white transition-all hover:bg-gray-950 disabled:opacity-50 dark:bg-gray-50 dark:text-gray-950 dark:hover:bg-gray-200 shadow-lg shadow-gray-800/10 dark:shadow-none"
                            >
                                {loading ? (
                                    'Autenticando...'
                                ) : (
                                    <>
                                        <span>Entrar na Plataforma</span>
                                        <LogIn className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 border-t border-gray-200 pt-6 dark:border-gray-800 text-center">
                            <p className="text-sm text-gray-400 dark:text-gray-200">
                                Novo por aqui?{' '}
                                <Link href="/register" className="font-bold text-gray-800 hover:underline dark:text-gray-50">
                                    Crie sua conta profissional
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}