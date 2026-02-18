// src/app/(auth)/register/page.tsx
'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { Eye, EyeOff, Check, X } from 'lucide-react'

export default function RegisterPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    })
    const [registered, setRegistered] = useState(false)
    const [registeredEmail, setRegisteredEmail] = useState('')

    const passwordRequirements = useMemo(() => [
        { label: 'Mínimo 8 caracteres', test: formData.password.length >= 8 },
        { label: 'Letra maiúscula', test: /[A-Z]/.test(formData.password) },
        { label: 'Letra minúscula', test: /[a-z]/.test(formData.password) },
        { label: 'Número', test: /[0-9]/.test(formData.password) },
        { label: 'Caractere especial', test: /[^A-Za-z0-9]/.test(formData.password) },
    ], [formData.password])

    const isPasswordValid = passwordRequirements.every(req => req.test)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!isPasswordValid) {
            toast.error('A senha não atende aos requisitos de segurança')
            return
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error('As senhas não coincidem')
            return
        }

        setLoading(true)

        try {
            // Ajustado para a rota correta da API
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                })
            })

            const data = await response.json()

            if (!response.ok) throw new Error(data.error || 'Erro ao criar conta')

            setRegistered(true)
            setRegisteredEmail(formData.email)
            toast.success('Conta criada! Verifique seu email.')

        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Erro ao criar conta')
        } finally {
            setLoading(false)
        }
    }

    if (registered) {
        return (
            <div className="flex min-h-screen flex-col bg-white dark:bg-gray-950">
                <div className="flex flex-1 items-center justify-center p-4">
                    <div className="w-full max-w-md text-center">
                        <div className="mb-8">
                            <div className="bg-linear-to-br from-green-400 to-green-600 inline-flex h-16 w-16 items-center justify-center rounded-2xl mb-6 shadow-lg shadow-green-500/20">
                                <Check className="h-8 w-8 text-white" />
                            </div>
                            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-50">Verifique seu e-mail</h1>
                            <p className="mt-4 text-gray-500 dark:text-gray-100">
                                Enviamos um link de ativação para <span className="font-semibold text-gray-800 dark:text-gray-50">{registeredEmail}</span>
                            </p>
                        </div>

                        <div className="rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-950 shadow-xs">
                            <div className="space-y-4">
                                <Link
                                    href="/login"
                                    className="block w-full rounded-xl bg-gray-800 py-3 font-semibold text-white transition-all hover:bg-gray-950 dark:bg-gray-50 dark:text-gray-950 dark:hover:bg-gray-200"
                                >
                                    Ir para o Login
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen flex-col bg-white dark:bg-gray-950">
            <div className="flex flex-1 items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="mb-10 text-center">
                        <Link
                            href="/"
                            rel="icon"
                            type="image/svg+xml"
                        >
                            <div className="bg-linear-to-br from-gray-800 to-gray-950 dark:from-gray-50 dark:to-gray-200 inline-flex h-14 w-14 items-center justify-center rounded-2xl mb-4 shadow-xl">
                                <span className="text-2xl font-bold text-white dark:text-gray-950 font-mono">v0</span>
                            </div>
                        </Link>
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-50 tracking-tight">Crie sua conta</h1>
                        <p className="mt-2 text-gray-500 dark:text-gray-100">Gestão profissional para seus projetos</p>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-950 shadow-xs">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 dark:text-gray-50 mb-2">Nome</label>
                                <input
                                    type="text"
                                    required
                                    autoComplete="new-name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-800 outline-none transition-all focus:border-gray-800 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50 dark:focus:border-gray-50"
                                    placeholder="Ex: Leonardo Firme"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-800 dark:text-gray-50 mb-2">E-mail</label>
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
                                <label className="block text-sm font-semibold text-gray-800 dark:text-gray-50 mb-2">Senha</label>
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

                                <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                                    {passwordRequirements.map((req, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            {req.test ? (
                                                <Check size={14} className="text-green-500" />
                                            ) : (
                                                <X size={14} className="text-gray-300 dark:text-gray-700" />
                                            )}
                                            <span className={`text-[11px] font-medium ${req.test ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-200'}`}>
                                                {req.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-800 dark:text-gray-50 mb-2">Confirmar Senha</label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    autoComplete="new-password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-800 outline-none transition-all focus:border-gray-800 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50 dark:focus:border-gray-50"
                                    placeholder="••••••••"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !isPasswordValid}
                                className="w-full rounded-xl bg-gray-800 py-3 font-semibold text-white transition-all hover:bg-gray-950 disabled:opacity-50 dark:bg-gray-50 dark:text-gray-950 dark:hover:bg-gray-200 shadow-lg shadow-gray-800/10 dark:shadow-none"
                            >
                                {loading ? 'Processando...' : 'Criar Conta Profissional'}
                            </button>
                        </form>

                        <div className="mt-8 border-t border-gray-200 pt-6 dark:border-gray-800 text-center">
                            <p className="text-sm text-gray-400 dark:text-gray-200">
                                Já faz parte da v0?{' '}
                                <Link href="/login" className="font-bold text-gray-800 hover:underline dark:text-gray-50">
                                    Faça o Login
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}