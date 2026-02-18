// src/components/TaskForm.tsx
'use client'

import { useState } from 'react'

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
        title: initialData?.title || '',
        description: initialData?.description || '',
        estimatedTime: initialData?.estimatedTime || 0
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit({
            title: formData.title,
            description: formData.description,
            estimatedTime: formData.estimatedTime > 0 ? formData.estimatedTime : undefined
        })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Título *
                </label>
                <input
                    id="title"
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Digite o título da tarefa"
                />
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição
                </label>
                <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Digite a descrição da tarefa"
                    rows={3}
                />
            </div>

            <div>
                <label htmlFor="estimatedTime" className="block text-sm font-medium text-gray-700 mb-1">
                    Tempo estimado (minutos)
                </label>
                <input
                    id="estimatedTime"
                    type="number"
                    min="0"
                    value={formData.estimatedTime}
                    onChange={(e) => setFormData({ ...formData, estimatedTime: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Tempo estimado em minutos"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
                {loading ? 'Salvando...' : (initialData ? 'Atualizar Tarefa' : 'Criar Tarefa')}
            </button>
        </form>
    )
}