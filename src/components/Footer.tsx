// src/components/footer.tsx
'use client'

import Link from 'next/link'
import { ShieldCheck, Zap, Globe, Github, Twitter, Linkedin } from "lucide-react";

const PLATFORM_LINKS = [
    { label: "Demo Online", href: "/demo" },
    { label: "API Docs", href: "/api-docs" },
    { label: "Integração", href: "/integracao" },
];

const SUPPORT_LINKS = [
    { label: "Ajuda", href: "/ajuda" },
    { label: "Status", href: "/status" },
    { label: "Segurança", href: "/seguranca" },
];

const LEGAL_LINKS = [
    { label: "Privacidade", href: "/privacidade" },
    { label: "Termos", href: "/termos" },
];

const SOCIAL_LINKS = [
    { icon: Github, href: "https://github.com/v0digital/to-do" },
    { icon: Linkedin, href: "https://www.linkedin.com/company/v0-digital" },
];

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white dark:bg-gray-950 pt-20 pb-10 border-t border-gray-100 dark:border-gray-900 transition-colors duration-300">
            <div className="container mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">

                    {/* Brand Section */}
                    <div className="md:col-span-4 space-y-6">
                        <div className="text-[11px] font-black uppercase tracking-[0.5em] text-gray-800 dark:text-gray-50">
                            v0 Digital <span className="text-gray-400 font-medium">Systems</span>
                        </div>
                        <p className="text-xs leading-relaxed text-gray-400 dark:text-gray-500 max-w-xs font-medium">
                            Arquitetura ERP de alta performance para operações que exigem precisão absoluta e escalabilidade técnica.
                        </p>
                        <div className="flex items-center gap-4 text-gray-300 dark:text-gray-800">
                            {SOCIAL_LINKS.map((social, idx) => (
                                <Link key={idx} href={social.href} className="hover:text-gray-800 dark:hover:text-gray-50 transition-colors">
                                    <social.icon size={18} />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Columns */}
                    <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
                        {/* Plataforma */}
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-800 dark:text-gray-50">Plataforma</h4>
                            <ul className="space-y-2">
                                {PLATFORM_LINKS.map((link) => (
                                    <li key={link.label}>
                                        <Link href={link.href} className="text-[11px] font-bold text-gray-400 hover:text-gray-800 dark:hover:text-gray-50 transition-colors uppercase">
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Suporte */}
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-800 dark:text-gray-50">Suporte</h4>
                            <ul className="space-y-2">
                                {SUPPORT_LINKS.map((link) => (
                                    <li key={link.label}>
                                        <Link href={link.href} className="text-[11px] font-bold text-gray-400 hover:text-gray-800 dark:hover:text-gray-50 transition-colors uppercase">
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Legal */}
                        <div className="space-y-4 col-span-2 sm:col-span-1">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-800 dark:text-gray-50">Legal</h4>
                            <ul className="space-y-2">
                                {LEGAL_LINKS.map((link) => (
                                    <li key={link.label}>
                                        <Link href={link.href} className="text-[11px] font-bold text-gray-400 hover:text-gray-800 dark:hover:text-gray-50 transition-colors uppercase">
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-gray-50 dark:border-gray-900 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                            © {currentYear} v0 Digital. Engineering with precision.
                        </p>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[9px] font-black uppercase tracking-tighter text-gray-400 dark:text-gray-700">Systems Operational</span>
                        </div>
                        <div className="flex items-center gap-4 border-l border-gray-100 dark:border-gray-900 pl-8">
                            <ShieldCheck className="h-4 w-4 text-gray-300 dark:text-gray-800" />
                            <Zap className="h-4 w-4 text-gray-300 dark:text-gray-800" />
                            <Globe className="h-4 w-4 text-gray-300 dark:text-gray-800" />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}