// src/components/techStark.tsx
import { motion } from "framer-motion";
import {
    SiNextdotjs,
    SiTailwindcss,
    SiTypescript,
    SiPrisma,
    SiMysql,
    SiFramer,
    SiGit,
    SiGithub,
} from "react-icons/si";

const techs = [
    { name: "Next.js 16+", icon: <SiNextdotjs size={20} /> },
    { name: "Tailwind CSS v4", icon: <SiTailwindcss size={20} /> },
    { name: "TypeScript", icon: <SiTypescript size={20} /> },
    { name: "Prisma ORM", icon: <SiPrisma size={20} /> },
    { name: "MySQL", icon: <SiMysql size={20} /> },
    { name: "Framer Motion", icon: <SiFramer size={20} /> },
    { name: "Github", icon: <SiGithub size={20} /> },
    { name: "Git", icon: <SiGit size={20} /> }
];

export default function TechStark() {
    return (
        <section className="border-y border-gray-100 bg-gray-50/50 py-16 dark:border-gray-800 dark:bg-gray-950/30">
            <div className="flex overflow-hidden whitespace-nowrap mask-[linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]">
                <motion.div
                    animate={{ x: [0, -1030] }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className="flex items-center gap-16 pr-16"
                >
                    {[...techs, ...techs].map((tech, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-4 text-sm font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-600 transition-all hover:text-gray-800 dark:hover:text-gray-200 group"
                        >
                            <span className="text-gray-300 dark:text-gray-800 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors">
                                {tech.icon}
                            </span>
                            <span>{tech.name}</span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}