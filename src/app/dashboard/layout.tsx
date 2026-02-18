// src/app/dashboard/layout.tsx
import MainNavbar from '@/components/MainNavbar'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <MainNavbar />
            <main className="container mx-auto px-4 py-8">
                {children}
            </main>
        </>
    )
}