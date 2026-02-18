// src/app/dashboard/layout.tsx
import MainNavbar from '@/components/MainNavbar'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen flex-col bg-white dark:bg-gray-950 transition-colors duration-300">
            {/* Navbar fixa ou no topo */}
            <MainNavbar />

            {/* O uso de flex-1 garante que o main ocupe o espaço restante.
                h-full e overflow-x-hidden removem scrolls laterais fantasmas.
            */}
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 overflow-x-hidden">
                <div className="animate-in fade-in duration-500">
                    {children}
                </div>
            </main>
        </div>
    )
}