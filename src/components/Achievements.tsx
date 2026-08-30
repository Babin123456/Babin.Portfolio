import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import SectionTitle from "./SectionTitle";
import { useState } from "react";
import { X, FileText, ExternalLink, ZoomIn, ZoomOut, Download, RotateCcw } from "lucide-react";
import { achievementsData } from "../data/achievements";
import StudyBackground from "./StudyBackground";
import styles from './Achievements.module.css';

type FilterType = 'All' | 'Awards' | 'Certificates | Technical Courses' | 'Bootcamps | Events | Competitions' | 'Internship Certificates' | 'Badges';

const awardCategories = ["Awards & Recognitions"];
const certificateCategories = ["AWS", "CISCO", "Cognitive Class", "GeeksforGeeks", "Google", "GTech Learn", "HackerRank", "HCL Guvi", "HP Life", "IBM", "Infosys Springboard", "Microsoft", "Microsoft Certificates", "Microsoft Certifications", "Pantech e Learning", "Qualcomm", "Saylor Academy", "Scaler", "SimpliLearn", "Skill Nation", "Udemy", "ETS", "Oracle", "FutureSkillsPrime"];
const bootcampCategories = ["Events & Hackathons", "Hack2Skill", "Kaggle", "Let's Upgrade", "MyBharat", "myGov", "Skill India", "Unstop"];
const internshipCategories = ["Oasis Infobyte", "Infosys Springboard Internships", "The Developers Arena"];
const badgeCategories = ["AWS Badges", "CISCO Badges", "GFG Badges", "Google Badges", "Holopin Badges", "HP Life Badges", "IndiaAI Badges", "LeetCode Badges", "Microsoft Badges", "Qualcomm Badges", "GirlScript Summer of Code (GSSoC) Badges", "EduLinkUp Summer of Code (ELUSoC) Badges", "Nexus Spring of Code (NSoC) Badges", "Elite Coders Summer of Code (ECSoC) Badges", "Unstop Badges", "Oracle Badges", "IBM Badges", "Agents League Badges"];

const Achievements = () => {
    const { ref, inView } = useInView({
        threshold: 0,
        triggerOnce: true,
    });

    const [selectedItem, setSelectedItem] = useState<{ file: string; title: string; type: 'image' | 'pdf' } | null>(null);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [isClosing, setIsClosing] = useState(false);
    const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
    const [activeFilter, setActiveFilter] = useState<FilterType>('All');

    // Helper to determine type based on extension
    const getFileType = (path: string) => {
        const ext = path.toLowerCase();
        if (ext.endsWith('.pdf')) return 'pdf';
        return 'image';
    };

    const getAllAchievements = () => {
        return achievementsData.map(cat => {
            const categoryName = cat.category === "LinkedIn Learning (LU)" ? "Let's Upgrade" : cat.category;
            return { ...cat, category: categoryName };
        }).filter(cat => cat.items.length > 0);
    };

    const getFilteredAchievements = (achievements: typeof achievementsData, filter: FilterType) => {
        let filtered: typeof achievementsData = [];
        switch (filter) {
            case 'All':
                return achievements;
            case 'Awards':
                filtered = achievements.filter(cat => awardCategories.includes(cat.category));
                break;
            case 'Certificates | Technical Courses':
                filtered = achievements.filter(cat => certificateCategories.includes(cat.category));
                break;
            case 'Bootcamps | Events | Competitions':
                filtered = achievements.filter(cat => bootcampCategories.includes(cat.category));
                break;
            case 'Internship Certificates':
                filtered = achievements.filter(cat => internshipCategories.includes(cat.category));
                break;
            case 'Badges':
                filtered = achievements.filter(cat => badgeCategories.includes(cat.category));
                break;
            default:
                return achievements;
        }

        return [...filtered].sort((a, b) => a.category.localeCompare(b.category, undefined, { sensitivity: 'base' }));
    };

    const allAchievements = getAllAchievements();
    const filteredAchievements = getFilteredAchievements(allAchievements, activeFilter);
    const allRegularAchievements = allAchievements.filter(
        (cat) => !badgeCategories.includes(cat.category)
    );
    const allBadgeAchievements = allAchievements.filter(
        (cat) => badgeCategories.includes(cat.category)
    );

    if (!allAchievements || allAchievements.length === 0) {
        return (
            <section id="achievements" className="py-20 relative" ref={ref}>
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-2xl font-bold">No achievements data available.</h2>
                </div>
            </section>
        );
    }

    const handleZoomIn = (e: React.MouseEvent) => {
        e.stopPropagation();
        setZoomLevel(prev => Math.min(prev + 0.5, 3));
    };

    const handleZoomOut = (e: React.MouseEvent) => {
        e.stopPropagation();
        setZoomLevel(prev => Math.max(prev - 0.5, 0.5));
    };

    const handleResetZoom = (e: React.MouseEvent) => {
        e.stopPropagation();
        setZoomLevel(1);
    };

    const handleDownload = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedItem) {
            try {
                const response = await fetch(selectedItem.file);
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                const filename = decodeURIComponent(selectedItem.file.split('/').pop() || 'download');
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            } catch (error) {
                console.error('Download failed:', error);
            }
        }
    };

    const closeLightbox = () => {
        setIsClosing(true);
        setTimeout(() => {
            setSelectedItem(null);
            setZoomLevel(1);
            setIsClosing(false);
        }, 1000); // Reduced animation duration to show full closing sequence
    };

    const handleImageError = (file: string) => {
        setImageErrors(prev => new Set(prev).add(file));
    };

    const handleItemClick = (item: { file: string; title: string }) => {
        const type = getFileType(item.file);
        if (type === 'pdf') {
            const link = document.createElement('a');
            link.href = encodeURI(item.file);
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            // Immediately close previous image if one is open
            if (selectedItem) {
                setSelectedItem(null);
                setZoomLevel(1);
                setIsClosing(false);
                // Open new image after state clears
                setTimeout(() => {
                    setSelectedItem({ file: item.file, title: item.title, type });
                }, 50);
            } else {
                setSelectedItem({ file: item.file, title: item.title, type });
            }
        }
    };

    const getItemCount = (categories: typeof achievementsData) => categories.reduce((count, category) => count + category.items.length, 0);

    const renderAchievementGroups = (categories: typeof achievementsData, sectionTitle?: string, sectionDescription?: string, sectionId?: string) => {
        if (categories.length === 0) {
            return null;
        }

        return (
            <div id={sectionId} className="space-y-10 scroll-mt-28">
                {sectionTitle ? (
                    <div className="text-center space-y-3">
                        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-sm">
                            <span className="text-lg font-bold text-blue-900 dark:text-cyan-300">{sectionTitle}</span>
                            <span className="rounded-full bg-blue-700/10 dark:bg-cyan-300/10 px-3 py-1 text-sm font-semibold text-blue-700 dark:text-cyan-300">
                                {getItemCount(categories)} items
                            </span>
                        </div>
                        {sectionDescription ? (
                            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">{sectionDescription}</p>
                        ) : null}
                    </div>
                ) : null}

                <div className="space-y-16 animate-slide-show">
                    {categories.map((category, catIndex) => (
                        <motion.div
                            key={`${sectionTitle || 'achievements'}-${category.category}-${catIndex}`}
                            className="space-y-6"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: false, amount: 0.05 }}
                            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <motion.h3
                                className="text-2xl font-bold text-blue-700 dark:text-[#89D3BD] border-l-4 border-primary pl-4 whitespace-normal break-words max-w-full cursor-default flex items-center gap-2 flex-wrap"
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                whileHover={{
                                    x: 30,
                                    transition: {
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 20
                                    }
                                }}
                                viewport={{ once: false, amount: 0.3 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                            >
                                <span>{category.category}</span>
                                <span className="text-sm md:text-base font-semibold text-muted-foreground/80 font-mono bg-blue-700/10 dark:bg-[#89D3BD]/10 px-2.5 py-0.5 rounded-full">
                                    ({category.items.length})
                                </span>
                            </motion.h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {category.items.map((item, index) => {
                                    const type = getFileType(item.file);
                                    const isSelected = !isClosing && selectedItem?.file === item.file;

                                    return (
                                        <motion.div
                                            key={`${category.category}-${item.title}-${index}`}
                                            initial={{ opacity: 0, y: 30, scale: 0.95 }}
                                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                            viewport={{ once: false, amount: 0.1 }}
                                            transition={{
                                                duration: 0.5,
                                                delay: index * 0.08,
                                                ease: [0.22, 1, 0.36, 1],
                                            }}
                                        >
                                            <Card
                                                className="overflow-hidden border border-white/20 dark:border-white/10 bg-white/40 dark:bg-white/5 backdrop-blur-md shadow-card hover:shadow-glow transition-all duration-300 group cursor-pointer flex flex-col h-full hover:-translate-y-2 hover:scale-[1.02]"
                                                onClick={() => handleItemClick(item)}
                                            >
                                                <div className="h-48 overflow-hidden bg-muted/10 relative flex items-center justify-center p-4">
                                                    {type === 'image' ? (
                                                        <>
                                                             {!imageErrors.has(item.file) ? (
                                                                <img
                                                                    src={item.file}
                                                                    alt={item.title}
                                                                    loading="lazy"
                                                                    decoding="async"
                                                                    className={`w-full h-full object-contain transition-transform duration-500 group-hover:scale-110 ${isSelected ? 'shadow-[0_8px_30px_rgba(29,78,216,0.35)] dark:shadow-[0_8px_30px_rgba(6,182,212,0.35)]' : ''}`}
                                                                    onError={() => handleImageError(item.file)}
                                                                />
                                                            ) : (
                                                                <div className="text-muted-foreground flex flex-col items-center justify-center gap-2">
                                                                    <FileText className="w-12 h-12" />
                                                                    <span className="text-xs">Image unavailable</span>
                                                                </div>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <div className="text-primary/50 group-hover:text-primary transition-colors">
                                                             <FileText className="w-16 h-16" />
                                                        </div>
                                                    )}

                                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                        <p className="text-white font-semibold text-lg flex items-center gap-2">
                                                            {type === 'pdf' ? <ExternalLink className="w-5 h-5" /> : null}
                                                            {type === 'pdf' ? 'Open PDF' : 'View Image'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="p-4 flex-grow flex flex-col justify-center items-center text-center">
                                                    <h4 className="text-base md:text-lg font-semibold text-foreground leading-snug mb-2 w-full break-words whitespace-normal">{item.title}</h4>
                                                    {type === 'pdf' && (
                                                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                            <FileText className="w-3 h-3" /> PDF Document
                                                        </p>
                                                    )}
                                                </div>
                                            </Card>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <section id="achievements" className="py-12 md:py-20 relative min-h-screen" ref={ref}>
            <div className="fixed inset-0 -z-10 w-full h-full">
                <StudyBackground />
            </div>
            <div className="container mx-auto px-4 relative z-10">
                <div
                    className={`max-w-6xl mx-auto space-y-12 ${inView ? "animate-fade-in-up" : "opacity-0"
                        }`}
                >
                    <div className="text-center space-y-4 mt-10 md:mt-0">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 max-w-[280px] mx-auto md:max-w-none">
                            <SectionTitle
                                segments={[
                                    {
                                        text: "My",
                                        className: "text-blue-700 dark:text-[#89D3BD]",
                                    },
                                    {
                                        text: " Achievements",
                                        className: "text-blue-900 dark:text-cyan-300",
                                    },
                                ]}
                            />
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                            A collection of my certificates, awards, and recognitions.
                        </p>
                    </div>

                    {/* Filter Buttons */}
                    <motion.div
                        className="flex flex-wrap justify-center gap-2 md:gap-3 mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        {(['All', 'Awards', 'Certificates | Technical Courses', 'Bootcamps | Events | Competitions', 'Internship Certificates', 'Badges'] as FilterType[]).map((filter) => {
                            const count = getItemCount(getFilteredAchievements(allAchievements, filter));
                            return (
                                <button
                                    key={filter}
                                    onClick={() => setActiveFilter(filter)}
                                    className={`px-4 py-2 rounded-full font-semibold transition-all duration-300 text-sm md:text-base flex items-center gap-1.5 ${activeFilter === filter
                                        ? 'bg-blue-700 dark:bg-[#89D3BD] text-white dark:text-black shadow-lg scale-105 font-black'
                                        : 'bg-muted/50 text-foreground hover:bg-muted border border-border/50 hover:border-primary/20'
                                        }`}
                                >
                                    <span>{filter}</span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-mono font-bold ${activeFilter === filter ? 'bg-white/20 dark:bg-black/20 text-white dark:text-black' : 'bg-muted text-muted-foreground'}`}>
                                        {count}
                                    </span>
                                </button>
                            );
                        })}
                    </motion.div>

                    <div className="space-y-16">
                        {activeFilter === 'All' ? (
                            <>
                                {renderAchievementGroups(allRegularAchievements)}
                                {renderAchievementGroups(
                                    allBadgeAchievements,
                                    'Badges',
                                    'Verified skill badges, challenge milestones, and platform-earned visual credentials from the achievements archive.',
                                    'achievement-badges'
                                )}
                            </>
                        ) : activeFilter === 'Badges' ? (
                            renderAchievementGroups(
                                filteredAchievements,
                                'Badges',
                                'Platform badges, milestone rewards, and challenge completions organized into a dedicated section.',
                                'achievement-badges'
                            )
                        ) : (
                            renderAchievementGroups(filteredAchievements)
                        )}
                    </div>
                </div>
            </div>

            {/* Lightbox Modal for Images */}
            {selectedItem && selectedItem.type === 'image' && (
                <div
                    className={`fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 transition-all duration-1000 ${isClosing
                        ? 'opacity-0 backdrop-blur-none'
                        : 'animate-fade-in'
                        }`}
                >
                    {/* Controls */}
                    <div className={`absolute top-4 right-4 flex items-center gap-2 z-50 transition-all duration-300 ${isClosing ? 'opacity-0 -translate-y-10' : 'opacity-100 translate-y-0'
                        }`}>
                        <button
                            onClick={handleZoomIn}
                            className="p-2 bg-white/10 rounded-full text-white hover:bg-primary hover:text-white transition-all duration-300 backdrop-blur-md hover:scale-110"
                            title="Zoom In"
                        >
                            <ZoomIn className="h-6 w-6" />
                        </button>
                        <button
                            onClick={handleZoomOut}
                            className="p-2 bg-white/10 rounded-full text-white hover:bg-primary hover:text-white transition-all duration-300 backdrop-blur-md hover:scale-110"
                            title="Zoom Out"
                        >
                            <ZoomOut className="h-6 w-6" />
                        </button>
                        <button
                            onClick={handleResetZoom}
                            className="p-2 bg-white/10 rounded-full text-white hover:bg-primary hover:text-white transition-all duration-300 backdrop-blur-md hover:scale-110"
                            title="Reset Zoom"
                        >
                            <RotateCcw className="h-6 w-6" />
                        </button>
                        <button
                            onClick={handleDownload}
                            className="p-2 bg-white/10 rounded-full text-white hover:bg-primary hover:text-white transition-all duration-300 backdrop-blur-md hover:scale-110"
                            title="Download"
                        >
                            <Download className="h-6 w-6" />
                        </button>
                        <button
                            onClick={closeLightbox}
                            className="p-2 bg-blue-700/80 dark:bg-[#89D3BD]/80 rounded-full text-white dark:text-black hover:bg-blue-700 dark:hover:bg-[#89D3BD] transition-all duration-300 ml-2 backdrop-blur-md hover:scale-110 hover:rotate-90"
                            title="Close"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    <div
                        className="relative w-full h-full flex items-center justify-center overflow-hidden"
                        onClick={closeLightbox}
                    >
                        <div
                            className={`transition-all duration-300 ease-out ${isClosing
                                ? 'animate-close-image'
                                : ''
                                } zoom-level-${zoomLevel.toString().replace('.', '-')}`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={selectedItem.file}
                                alt={selectedItem.title}
                                className={`relative max-w-[85vw] max-h-[72vh] object-contain rounded-lg transition-all duration-300 ${isClosing ? 'border-0 shadow-none opacity-90' : 'border-2 border-white/10 shadow-[0_12px_40px_rgba(29,78,216,0.5)] dark:shadow-[0_12px_40px_rgba(6,182,212,0.6)]'}`}
                            />
                        </div>
                    </div>

                    {/* Fully Visible Caption Banner */}
                    <div className={`absolute bottom-5 left-1/2 -translate-x-1/2 px-6 py-2.5 bg-black/85 dark:bg-black/90 backdrop-blur-md rounded-2xl border border-white/20 text-white text-center max-w-[92vw] z-50 shadow-2xl transition-all duration-300 pointer-events-none ${isClosing ? 'opacity-0 translate-y-6' : 'opacity-100 translate-y-0'}`}>
                        <p className="text-sm md:text-base font-semibold leading-snug break-words whitespace-normal tracking-wide">{selectedItem.title}</p>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Achievements;
