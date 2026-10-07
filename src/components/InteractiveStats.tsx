import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Code2, Zap, Clock, GitBranch, LucideIcon } from 'lucide-react';
import AnimatedIcon from './AnimatedIcon';
import StudyBackground from './StudyBackground';

interface StatItem {
    label: string;
    value: number;
    suffix?: string;
    description: string;
    Icon: LucideIcon;
    glowColor: string;
}

const InteractiveStats: React.FC = () => {
    const { ref, inView } = useInView({
        threshold: 0.25,
        triggerOnce: false,
    });

    const stats: StatItem[] = [
        {
            label: 'Projects Completed',
            value: 25,
            suffix: '+',
            description: 'Full-stack applications and ML systems',
            Icon: Code2,
            glowColor: 'rgba(29, 78, 216, 0.6)'
        },
        {
            label: 'Skills & Technologies',
            value: 40,
            suffix: '+',
            description: 'Languages, frameworks, and tools',
            Icon: Zap,
            glowColor: 'rgba(103, 232, 249, 0.6)'
        },
        {
            label: 'Experience',
            value: 2.5,
            suffix: '+',
            description: 'Years in coding, web dev, internship & open source',
            Icon: Clock,
            glowColor: 'rgba(29, 78, 216, 0.6)'
        },
        {
            label: 'Code Commits',
            value: 10000,
            suffix: '+',
            description: 'Across multiple repositories',
            Icon: GitBranch,
            glowColor: 'rgba(103, 232, 249, 0.6)'
        }
    ];

    const total = stats.length;

    return (
        <div ref={ref} className="mt-0 md:mt-0 py-8 md:py-16 relative overflow-hidden">
            <StudyBackground particleCount={14} />
            <div className="container mx-auto px-4 relative z-10">
                <div
                    className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-8 max-w-6xl mx-auto"
                    style={{
                        perspective: 1200,
                        transformStyle: 'preserve-3d',
                    }}
                >
                    {stats.map((stat, index) => (
                        <StatCard
                            key={index}
                            stat={stat}
                            index={index}
                            totalCount={total}
                            isVisible={inView}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

interface StatCardProps {
    stat: StatItem;
    index: number;
    totalCount: number;
    isVisible: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ stat, index, totalCount, isVisible }) => {
    const [count, setCount] = useState<number | string>(0);

    // Reset count when card leaves viewport so it re-animates on re-entry
    useEffect(() => {
        if (!isVisible) {
            setCount(0);
        }
    }, [isVisible]);

    useEffect(() => {
        if (!isVisible) return;

        const target = stat.value;
        const isDecimal = target % 1 !== 0;
        const duration = 2000;
        const steps = 60;
        const increment = target / steps;
        const stepDuration = duration / steps;

        let current = 0;
        const interval = setInterval(() => {
            current += increment;
            if (current >= target) {
                setCount(isDecimal ? target.toFixed(1) : target);
                clearInterval(interval);
            } else {
                setCount(isDecimal ? current.toFixed(1) : Math.floor(current));
            }
        }, stepDuration);

        return () => clearInterval(interval);
    }, [isVisible, stat.value]);

    // Compute 3D spread offset: cards swoop in from 3D depth and angles
    const center = (totalCount - 1) / 2;
    const offset = index - center; // -1.5, -0.5, 0.5, 1.5

    // Stagger delays: inner cards arrive first, outer cards swoop in from 3D sides
    const enterDelay = Math.abs(offset) * 0.12;
    const exitDelay = (1.5 - Math.abs(offset)) * 0.08;
    const transitionDelay = isVisible ? enterDelay : exitDelay;

    return (
        <motion.div
            className="relative group/card h-full"
            style={{
                transformStyle: 'preserve-3d',
            }}
            initial={false}
            animate={{
                z: isVisible ? 0 : -320,
                rotateY: isVisible ? 0 : offset * -32,
                rotateX: isVisible ? 0 : 25,
                y: isVisible ? 0 : 50,
                scale: isVisible ? 1 : 0.75,
                opacity: isVisible ? 1 : 0,
            }}
            transition={{
                duration: 0.85,
                ease: [0.22, 1, 0.36, 1],
                delay: transitionDelay,
            }}
        >
            <div className="pointer-events-none absolute -top-1.5 -left-1.5 w-4 h-4 border-t-2 border-l-2 border-blue-700 dark:border-[#89D3BD] opacity-0 -translate-x-1.5 -translate-y-1.5 group-hover/card:opacity-100 group-hover/card:translate-x-0 group-hover/card:translate-y-0 transition-all duration-300 ease-out z-20" />
            <div className="pointer-events-none absolute -top-1.5 -right-1.5 w-4 h-4 border-t-2 border-r-2 border-blue-700 dark:border-[#89D3BD] opacity-0 translate-x-1.5 -translate-y-1.5 group-hover/card:opacity-100 group-hover/card:translate-x-0 group-hover/card:translate-y-0 transition-all duration-300 ease-out z-20" />
            <div className="pointer-events-none absolute -bottom-1.5 -left-1.5 w-4 h-4 border-b-2 border-l-2 border-blue-700 dark:border-[#89D3BD] opacity-0 -translate-x-1.5 translate-y-1.5 group-hover/card:opacity-100 group-hover/card:translate-x-0 group-hover/card:translate-y-0 transition-all duration-300 ease-out z-20" />
            <div className="pointer-events-none absolute -bottom-1.5 -right-1.5 w-4 h-4 border-b-2 border-r-2 border-blue-700 dark:border-[#89D3BD] opacity-0 translate-x-1.5 translate-y-1.5 group-hover/card:opacity-100 group-hover/card:translate-x-0 group-hover/card:translate-y-0 transition-all duration-300 ease-out z-20" />

            <div className="relative p-4 md:p-6 rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 hover:shadow-[0_20px_10px_rgba(29,78,216,0.3)] dark:hover:shadow-[0_10px_20px_rgba(137,211,189,0.3)] transition-all duration-300 min-h-[9rem] md:min-h-[10.5rem] h-full flex flex-col justify-between">
                <div className="space-y-3 relative z-10">
                    <div className="flex items-center justify-between">
                        <div className="text-3xl md:text-4xl font-bold text-primary transition-all duration-300">
                            {count}
                            {stat.suffix && <span className="text-2xl">{stat.suffix}</span>}
                        </div>
                        <AnimatedIcon Icon={stat.Icon} size={32} glowColor="transparent" animationType="bounce" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-foreground group-hover/card:text-primary transition-colors duration-300">{stat.label}</p>
                        <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default InteractiveStats;
