// src/components/TaskForm.tsx
'use client'

import { useState, useEffect } from 'react'
import { Plus, Save, Clock, Type, AlignLeft, Loader2 } from 'lucide-react'

interface TaskFormProps {
    onSubmit: (data: { title: string; description: string; estimatedTime?: number }) => void
    loading?: boolean
    initialData?: {
        title: string
        description?: string
        estimatedTime?: number
    }
}

export default function TaskForm({ onSubmit, loading = false, initialData }: TaskFormProps) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        estimatedTime: 0
    })

    // Sincroniza quando entra em modo edição ou volta para criação
    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || '',
                description: initialData.description || '',
                estimatedTime: initialData.estimatedTime || 0
            })
        } else {
            setFormData({ title: '', description: '', estimatedTime: 0 })
        }
    }, [initialData])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.title.trim()) return

        // Envia os dados
        await onSubmit({
            title: formData.title.trim(),
            description: formData.description.trim(),
            estimatedTime: formData.estimatedTime > 0 ? Number(formData.estimatedTime) : undefined
        })

        // Reseta o formulário apenas se não for edição (criação nova)
        if (!initialData) {
            setFormData({ title: '', description: '', estimatedTime: 0 })
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
                <div>
                    <label htmlFor="title" className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">
                        <Type size={14} />
                        Título da Tarefa
                    </label>
                    <input
                        id="title"
                        type="text"
                        required
                        autoComplete="new-title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition-all focus:border-gray-800 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50 dark:focus:border-gray-50"
                        placeholder="Nome da operação..."
                    />
                </div>

                <div>
                    <label htmlFor="description" className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">
                        <AlignLeft size={14} />
                        Descrição Técnica
                    </label>
                    <textarea
                        id="description"
                        autoComplete="new-description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition-all focus:border-gray-800 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50 dark:focus:border-gray-50 resize-none"
                        placeholder="Detalhes da tarefa..."
                        rows={3}
                    />
                </div>

                <div>
                    <label htmlFor="estimatedTime" className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">
                        <Clock size={14} />
                        Estimativa (Minutos)
                    </label>
                    <div className="relative">
                        <input
                            id="estimatedTime"
                            type="number"
                            min="0"
                            autoComplete="new-time"
                            value={formData.estimatedTime === 0 ? '' : formData.estimatedTime}
                            onChange={(e) => setFormData({ ...formData, estimatedTime: parseInt(e.target.value) || 0 })}
                            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition-all focus:border-gray-800 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50 dark:focus:border-gray-50"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase text-gray-400">
                            MIN
                        </span>
                    </div>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-3 rounded-xl bg-gray-800 py-4 text-xs font-bold uppercase tracking-[0.2em] text-white transition-all hover:bg-gray-950 disabled:opacity-50 dark:bg-gray-50 dark:text-gray-950 dark:hover:bg-gray-200 shadow-xl shadow-gray-800/10 dark:shadow-none"
            >
                {loading ? (
                    <Loader2 size={16} className="animate-spin" />
                ) : (
                    initialData ? <Save size={16} /> : <Plus size={16} />
                )}
                {loading ? 'Sincronizando...' : initialData ? 'Atualizar Registro' : 'Confirmar Registro'}
            </button>
        </form>
    )
}