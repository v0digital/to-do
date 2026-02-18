// src/app/auth/register/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'

export default function RegisterPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    })
    const [registered, setRegistered] = useState(false)
    const [registeredEmail, setRegisteredEmail] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (formData.password !== formData.confirmPassword) {
            toast.error('As senhas não coincidem')
            return
        }

        if (formData.password.length < 6) {
            toast.error('A senha deve ter pelo menos 6 caracteres')
            return
        }

        setLoading(true)

        try {
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

            if (!response.ok) {
                throw new Error(data.error || 'Erro ao criar conta')
            }

            setRegistered(true)
            setRegisteredEmail(formData.email)
            toast.success('Conta criada! Verifique seu email para ativar.')

        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Erro ao criar conta')
        } finally {
            setLoading(false)
        }
    }

    if (registered) {
        return (
            <div className="flex flex-col h-screen">
                <div className="flex-1 flex items-center justify-center p-4">
                    <div className="w-full max-w-md">
                        <div className="mb-8 text-center">
                            <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-green-500 mb-4">
                                <span className="text-xl font-bold text-white">✓</span>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900">Conta criada com sucesso!</h1>
                            <p className="text-gray-600 mt-4">
                                Enviamos um email de verificação para:
                            </p>
                            <p className="font-medium text-gray-900 mt-2">{registeredEmail}</p>
                            <p className="text-gray-600 mt-4">
                                Clique no link no email para ativar sua conta e fazer login.
                            </p>
                        </div>

                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <div className="space-y-4">
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <p className="text-sm text-blue-800">
                                        <strong>Não recebeu o email?</strong>
                                        <br />
                                        Verifique sua pasta de spam ou clique no link abaixo para reenviar.
                                    </p>
                                </div>

                                <div className="flex space-x-4">
                                    <button
                                        onClick={() => {
                                            // TODO: Implementar reenvio de email
                                            toast.info('Funcionalidade em desenvolvimento')
                                        }}
                                        className="flex-1 py-2.5 px-4 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50"
                                    >
                                        Reenviar email
                                    </button>

                                    <Link
                                        href="/auth/login"
                                        className="flex-1 py-2.5 px-4 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 text-center"
                                    >
                                        Ir para login
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-screen">
            <div className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="mb-8 text-center">
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-500 mb-4">
                            <span className="text-xl font-bold text-white">T</span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Crie sua conta</h1>
                        <p className="text-gray-500 mt-2">
                            Comece a gerenciar suas tarefas
                        </p>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nome
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    autoComplete="new-text"
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Seu nome"
                                />
                            </div>

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
                                    minLength={6}
                                    value={formData.password}
                                    autoComplete="new-password"
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="••••••••"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Confirmar Senha
                                </label>
                                <input
                                    type="password"
                                    required
                                    minLength={6}
                                    value={formData.confirmPassword}
                                    autoComplete="new-password"
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="••••••••"
                                />
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    required
                                    className="h-4 w-4 text-indigo-500 rounded border-gray-300"
                                />
                                <span className="ml-2 text-sm text-gray-700">
                                    Aceito os termos e condições
                                </span>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-2.5 px-4 bg-indigo-500 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                            >
                                {loading ? 'Criando conta...' : 'Criar conta'}
                            </button>
                        </form>

                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <p className="text-center text-gray-500 text-sm">
                                Já tem uma conta?{' '}
                                <Link
                                    href="/auth/login"
                                    className="font-medium text-indigo-500 hover:text-indigo-500"
                                >
                                    Faça login
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}