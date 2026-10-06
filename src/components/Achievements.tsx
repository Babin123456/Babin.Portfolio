import { useState, useCallback, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import SectionTitle from "./SectionTitle";
import { X, FileText, ExternalLink, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { achievementsData } from "../data/achievements";
import StudyBackground from "./StudyBackground";

interface SelectedAchievement {
    file: string;
    title: string;
    type: 'image' | 'pdf';
    categoryTitle: string;
    categoryItems: Array<{ file: string; title: string }>;
    currentIndex: number;
}

type FilterType = 'All' | 'Awards' | 'Open Source Programs' | 'Technical Courses' | 'Bootcamps | Events | Competitions' | 'Internship Certificates' | 'Badges';

const awardCategories = ["Awards & Recognitions"];
const openSourceCategories = [
    "GirlScript Summer of Code (GSSoC) Badges",
    "GirlScript Summer of Code (GSSoC) Certificates",
    "EduLinkUp Summer of Code (ELUSoC) Badges",
    "EduLinkUp Summer of Code (ELUSoC) Certificates",
    "Nexus Spring of Code (NSoC) Badges",
    "Nexus Spring of Code (NSoC) Certificates",
    "Elite Coders Summer of Code (ECSoC) Badges",
    "Elite Coders Summer of Code (ECSoC) Certificates",
];
const technicalCourseCategories = ["AWS", "CISCO", "Cognitive Class", "GeeksforGeeks", "Google", "GTech Learn", "HackerRank", "HCL Guvi", "HP Life", "IBM", "Infosys Springboard", "Microsoft", "Microsoft Certifications", "Pantech e Learning", "Qualcomm", "Saylor Academy", "Scaler", "SimpliLearn", "Skill Nation", "Udemy", "ETS", "Oracle", "FutureSkillsPrime"];
const bootcampCategories = ["Events & Hackathons", "Hack2Skill", "Kaggle", "LU", "MyBharat", "myGov", "Skill India", "Unstop"];
const internshipCategories = ["Codec Technologies", "Infosys Springboard Internships", "Oasis Infobyte", "The Developers Arena"];
const badgeCategories = ["AWS Badges", "CISCO Badges", "GFG Badges", "Google Badges", "Holopin Badges", "HP Life Badges", "IndiaAI Badges", "LeetCode Badges", "Microsoft Badges", "Qualcomm Badges", "Unstop Badges", "Oracle Badges", "IBM Badges", "Agents League Badges"];

const Achievements = () => {
    const { ref, inView } = useInView({
        threshold: 0,
        triggerOnce: true,
    });

    const [selectedItem, setSelectedItem] = useState<SelectedAchievement | null>(null);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [isClosing, setIsClosing] = useState(false);
    const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
    const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
    const [activeFilter, setActiveFilter] = useState<FilterType>('All');
    const [touchStartX, setTouchStartX] = useState<number | null>(null);
    const [touchStartY, setTouchStartY] = useState<number | null>(null);

    // Prevent background scrolling when certificate modal is open
    useEffect(() => {
        if (selectedItem) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [selectedItem]);

    // Helper to determine type based on extension
    const getFileType = (path: string) => {
        const ext = path.toLowerCase();
        if (ext.endsWith('.pdf')) return 'pdf';
        return 'image';
    };

    const handleNext = useCallback(() => {
        if (!selectedItem || selectedItem.categoryItems.length <= 1) return;
        const nextIndex = (selectedItem.currentIndex + 1) % selectedItem.categoryItems.length;
        const nextItem = selectedItem.categoryItems[nextIndex];
        setSelectedItem(prev => prev ? {
            ...prev,
            file: nextItem.file,
            title: nextItem.title,
            currentIndex: nextIndex,
        } : null);
        setZoomLevel(1);
    }, [selectedItem]);

    const handlePrev = useCallback(() => {
        if (!selectedItem || selectedItem.categoryItems.length <= 1) return;
        const prevIndex = (selectedItem.currentIndex - 1 + selectedItem.categoryItems.length) % selectedItem.categoryItems.length;
        const prevItem = selectedItem.categoryItems[prevIndex];
        setSelectedItem(prev => prev ? {
            ...prev,
            file: prevItem.file,
            title: prevItem.title,
            currentIndex: prevIndex,
        } : null);
        setZoomLevel(1);
    }, [selectedItem]);

    const closeLightbox = useCallback(() => {
        setIsClosing(prev => {
            if (prev) return prev;
            setTimeout(() => {
                setSelectedItem(null);
                setZoomLevel(1);
                setIsClosing(false);
            }, 400);
            return true;
        });
    }, []);

    // Keyboard navigation: Arrow keys & Escape
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!selectedItem) return;
            if (e.key === "Escape") {
                closeLightbox();
            } else if (e.key === "ArrowRight") {
                handleNext();
            } else if (e.key === "ArrowLeft") {
                handlePrev();
            }
        };

        if (selectedItem) {
            document.documentElement.style.overflow = "hidden";
            document.body.style.overflow = "hidden";
            document.body.style.touchAction = "none";

            const preventScroll = (e: TouchEvent | WheelEvent) => {
                e.preventDefault();
            };

            window.addEventListener("keydown", handleKeyDown);
            window.addEventListener("wheel", preventScroll, { passive: false });
            window.addEventListener("touchmove", preventScroll, { passive: false });

            return () => {
                document.documentElement.style.overflow = "";
                document.body.style.overflow = "";
                document.body.style.touchAction = "";
                window.removeEventListener("keydown", handleKeyDown);
                window.removeEventListener("wheel", preventScroll);
                window.removeEventListener("touchmove", preventScroll);
            };
        }
    }, [selectedItem, handleNext, handlePrev, closeLightbox]);

    // Touch swipe handlers for mobile mode
    const handleTouchStart = (e: React.TouchEvent) => {
        if (e.targetTouches.length === 1) {
            setTouchStartX(e.targetTouches[0].clientX);
            setTouchStartY(e.targetTouches[0].clientY);
        }
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStartX === null || touchStartY === null) return;
        if (e.changedTouches.length === 1) {
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            const dx = touchStartX - touchEndX;
            const dy = touchStartY - touchEndY;

            // Require at least 45px swipe distance and dominantly horizontal motion
            if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3) {
                if (dx > 0) {
                    handleNext(); // Swiped left -> show next
                } else {
                    handlePrev(); // Swiped right -> show previous
                }
            }
        }
        setTouchStartX(null);
        setTouchStartY(null);
    };

    const getAllAchievements = () => {
        return achievementsData.map(cat => {
            const categoryName = (cat.category === "Let's Upgrade" || cat.category === "LinkedIn Learning (LU)") ? "LU" : cat.category;
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
            case 'Open Source Programs':
                filtered = achievements.filter(cat => openSourceCategories.includes(cat.category));
                break;
            case 'Technical Courses':
                filtered = achievements.filter(cat => technicalCourseCategories.includes(cat.category));
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
        (cat) => !badgeCategories.includes(cat.category) && !openSourceCategories.includes(cat.category)
    );
    const allOpenSourceAchievements = allAchievements.filter(
        (cat) => openSourceCategories.includes(cat.category)
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


    const handleImageError = (file: string) => {
        setImageErrors(prev => new Set(prev).add(file));
    };

    const handleItemClick = (
        item: { file: string; title: string },
        categoryTitle: string,
        allItems: Array<{ file: string; title: string }>,
        index: number
    ) => {
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
            // Filter to viewable image items within this category
            const imageItems = allItems.filter(i => getFileType(i.file) === 'image');
            const imgIndex = imageItems.findIndex(i => i.file === item.file);
            setSelectedItem({
                file: item.file,
                title: item.title,
                type,
                categoryTitle,
                categoryItems: imageItems.length > 0 ? imageItems : [item],
                currentIndex: imgIndex !== -1 ? imgIndex : 0,
            });
            setZoomLevel(1);
            setIsClosing(false);
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
                            <span className="text-lg font-bold text-blue-700 dark:text-[#89D3BD]">{sectionTitle}</span>
                            <span className="rounded-full bg-blue-700/10 dark:bg-[#89D3BD]/10 px-3 py-1 text-sm font-semibold text-blue-700 dark:text-[#89D3BD]">
                                {getItemCount(categories)} items
                            </span>
                        </div>
                        {sectionDescription ? (
                            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">{sectionDescription}</p>
                        ) : null}
                    </div>
                ) : null}

                <div className="space-y-16">
                    {categories.map((category, catIndex) => (
                        <motion.div
                            key={`${sectionTitle || 'achievements'}-${category.category}-${catIndex}`}
                            className="space-y-6"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.02, margin: "150px 0px" }}
                            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <motion.h3
                                className="group text-2xl font-bold text-blue-700 dark:text-[#89D3BD] border-l-4 border-primary hover:border-blue-500 dark:hover:border-[#89D3BD] pl-4 whitespace-normal break-words max-w-full cursor-default flex items-center gap-2 flex-wrap transition-all duration-300 hover:translate-x-1.5 select-none"
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, amount: 0.1 }}
                                transition={{ duration: 0.35, ease: "easeOut" }}
                            >
                                <span className="transition-colors duration-300 group-hover:text-blue-800 dark:group-hover:text-[#a5ebd5]">
                                    {category.category}
                                </span>
                                <span className="text-sm md:text-base font-semibold text-muted-foreground/80 font-mono bg-blue-700/10 dark:bg-[#89D3BD]/10 px-2.5 py-0.5 rounded-full transition-all duration-300 group-hover:bg-blue-700/20 dark:group-hover:bg-[#89D3BD]/20 group-hover:scale-105 group-hover:text-blue-700 dark:group-hover:text-[#89D3BD]">
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
                                            className="achievement-card-contain"
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true, amount: 0.02, margin: "100px 0px" }}
                                            transition={{
                                                duration: 0.35,
                                                delay: Math.min(index * 0.02, 0.2),
                                                ease: [0.22, 1, 0.36, 1],
                                            }}
                                        >
                                            <Card
                                                className="overflow-hidden border border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-sm shadow-card hover:border-blue-600 dark:hover:border-[#89D3BD] hover:shadow-[0_0_25px_rgba(29,78,216,0.3)] dark:hover:shadow-[0_0_25px_rgba(137,211,189,0.3)] transition-all duration-300 group cursor-pointer flex flex-col h-full hover:-translate-y-1.5 hover:scale-[1.01]"
                                                onClick={() => handleItemClick(item, category.category, category.items, index)}
                                            >
                                                <div className="h-48 overflow-hidden bg-[#F5EDE0]/80 dark:bg-zinc-950/80 backdrop-blur-md relative flex items-center justify-center p-4 border-b border-[#E8DFC8] dark:border-zinc-900">
                                                    {type === 'image' ? (
                                                        <>
                                                            {!loadedImages.has(item.file) && !imageErrors.has(item.file) && (
                                                                <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
                                                                    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 dark:via-white/10 to-transparent" />
                                                                    <FileText className="w-10 h-10 text-primary/20 animate-pulse" />
                                                                </div>
                                                            )}
                                                            {!imageErrors.has(item.file) ? (
                                                                <img
                                                                    src={item.file}
                                                                    alt={item.title}
                                                                    loading="lazy"
                                                                    decoding="async"
                                                                    onLoad={() => setLoadedImages(prev => new Set(prev).add(item.file))}
                                                                    className={`w-full h-full object-contain transition-all duration-300 group-hover:scale-105 ${loadedImages.has(item.file) ? 'opacity-100' : 'opacity-0'} ${isSelected ? 'shadow-[0_8px_30px_rgba(29,78,216,0.35)] dark:shadow-[0_8px_30px_rgba(6,182,212,0.35)]' : ''}`}
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

                                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
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
                    <div className="text-center space-y-3 mt-6 sm:mt-10 md:mt-0">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 text-center">
                            <SectionTitle
                                segments={[
                                    {
                                        text: "My",
                                        className: "text-blue-700 dark:text-[#89D3BD]",
                                    },
                                    {
                                        text: " Achievements",
                                        className: "text-blue-700 dark:text-[#89D3BD]",
                                    },
                                ]}
                            />
                        </h2>
                        <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-6 sm:mb-8 px-2">
                            A collection of my certificates, awards, and recognitions.
                        </p>
                    </div>

                    <motion.div
                        className="flex flex-nowrap sm:flex-wrap justify-start sm:justify-center gap-2 md:gap-3 mb-8 overflow-x-auto pb-2 sm:pb-0 px-1 sm:px-0 scrollbar-none"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        {(['All', 'Awards', 'Open Source Programs', 'Technical Courses', 'Bootcamps | Events | Competitions', 'Internship Certificates', 'Badges'] as FilterType[]).map((filter) => {
                            const count = getItemCount(getFilteredAchievements(allAchievements, filter));
                            return (
                                <button
                                    key={filter}
                                    onClick={() => setActiveFilter(filter)}
                                    className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full font-semibold transition-all duration-300 text-xs sm:text-sm md:text-base flex items-center gap-1.5 shrink-0 ${activeFilter === filter
                                        ? 'bg-blue-700 dark:bg-[#89D3BD] text-white dark:text-black shadow-lg scale-105 font-black'
                                        : 'bg-muted/50 text-foreground hover:bg-muted border border-border/50 hover:border-primary/20'
                                        }`}
                                >
                                    <span>{filter}</span>
                                    <span className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-mono font-bold ${activeFilter === filter ? 'bg-white/20 dark:bg-black/20 text-white dark:text-black' : 'bg-muted text-muted-foreground'}`}>
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
                                    allOpenSourceAchievements,
                                    'Open Source Programs',
                                    'Badges, challenge completions, and contribution certificates earned from open-source initiatives and community programs.',
                                    'achievement-open-source'
                                )}
                                {renderAchievementGroups(
                                    allBadgeAchievements,
                                    'Badges',
                                    'Verified skill badges, challenge milestones, and platform-earned visual credentials from the achievements archive.',
                                    'achievement-badges'
                                )}
                            </>
                        ) : activeFilter === 'Open Source Programs' ? (
                            renderAchievementGroups(
                                filteredAchievements,
                                'Open Source Programs',
                                'Badges, challenge completions, and contribution certificates earned from open-source initiatives and community programs.',
                                'achievement-open-source'
                            )
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

            {selectedItem && selectedItem.type === 'image' && (
                <div
                    className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#FAF6EE]/90 dark:bg-black/95 backdrop-blur-2xl p-2 sm:p-4 select-none touch-none overscroll-contain transition-all duration-400 ease-out ${isClosing
                        ? 'opacity-0 backdrop-blur-none pointer-events-none'
                        : 'animate-fade-in'
                        }`}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    onWheel={(e) => e.stopPropagation()}
                >
                    <div
                        className={`fixed top-3 inset-x-3 sm:top-5 sm:inset-x-6 z-50 flex items-center justify-between pointer-events-none transition-all duration-400 ease-out ${isClosing ? 'opacity-0 -translate-y-8' : 'opacity-100 translate-y-0'
                            }`}
                    >
                        <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-[#F5EDE0]/90 dark:bg-white/10 border border-[#E8DFC8] dark:border-white/20 backdrop-blur-md shadow-xl text-xs sm:text-sm font-semibold text-slate-900 dark:text-white max-w-[calc(100vw-110px)] sm:max-w-md">
                            <span className="text-slate-900 dark:text-white font-bold truncate">
                                {selectedItem.categoryTitle}
                            </span>
                            {selectedItem.categoryItems.length > 1 && (
                                <span className="shrink-0 px-2 py-0.5 rounded-full bg-slate-300/70 dark:bg-white/15 text-slate-800 dark:text-white font-mono text-[10px] sm:text-xs font-bold">
                                    {selectedItem.currentIndex + 1} / {selectedItem.categoryItems.length}
                                </span>
                            )}
                        </div>

                        <div className="pointer-events-auto flex items-center gap-2 sm:gap-2.5 shrink-0">
                            <button
                                onClick={handleDownload}
                                className="w-10 h-10 sm:w-11 sm:h-11 min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] aspect-square p-0 rounded-full flex items-center justify-center shrink-0 bg-[#F5EDE0]/90 dark:bg-white/10 border border-[#E8DFC8] dark:border-white/20 text-slate-900 dark:text-white hover:bg-blue-700 hover:text-white dark:hover:bg-[#89D3BD] dark:hover:text-black hover:border-blue-700 dark:hover:border-[#89D3BD] transition-all duration-200 backdrop-blur-md shadow-md touch-manipulation focus:outline-none cursor-pointer active:scale-95"
                                title="Download"
                                aria-label="Download"
                            >
                                <Download className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                            </button>
                            <button
                                onClick={closeLightbox}
                                className="w-10 h-10 sm:w-11 sm:h-11 min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] aspect-square p-0 rounded-full flex items-center justify-center shrink-0 bg-[#F5EDE0]/90 dark:bg-white/10 border border-[#E8DFC8] dark:border-white/20 text-slate-900 dark:text-white hover:bg-blue-700 hover:text-white dark:hover:bg-[#89D3BD] dark:hover:text-black hover:border-blue-700 dark:hover:border-[#89D3BD] transition-all duration-200 backdrop-blur-md shadow-md touch-manipulation focus:outline-none cursor-pointer active:scale-95"
                                title="Close"
                                aria-label="Close modal"
                            >
                                <X className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                            </button>
                        </div>
                    </div>

                    {selectedItem.categoryItems.length > 1 && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handlePrev();
                            }}
                            className={`fixed left-2 sm:left-5 top-1/2 -translate-y-1/2 z-50 w-10 h-10 sm:w-12 sm:h-12 min-w-[40px] min-h-[40px] sm:min-w-[48px] sm:min-h-[48px] aspect-square p-0 rounded-full flex items-center justify-center shrink-0 bg-[#F5EDE0]/90 dark:bg-white/15 text-slate-900 dark:text-white border border-[#E8DFC8] dark:border-white/25 hover:bg-blue-700 hover:text-white dark:hover:bg-[#89D3BD] dark:hover:text-black hover:border-blue-700 dark:hover:border-[#89D3BD] transition-all duration-300 backdrop-blur-md hover:scale-110 active:scale-95 shadow-2xl focus:outline-none cursor-pointer group touch-manipulation ${isClosing ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                            title="Previous Certificate"
                            aria-label="Previous Certificate"
                        >
                            <ChevronLeft className="w-5 h-5 sm:w-7 sm:h-7 shrink-0 group-hover:-translate-x-0.5 transition-transform" />
                        </button>
                    )}

                    {selectedItem.categoryItems.length > 1 && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleNext();
                            }}
                            className={`fixed right-2 sm:right-5 top-1/2 -translate-y-1/2 z-50 w-10 h-10 sm:w-12 sm:h-12 min-w-[40px] min-h-[40px] sm:min-w-[48px] sm:min-h-[48px] aspect-square p-0 rounded-full flex items-center justify-center shrink-0 bg-[#F5EDE0]/90 dark:bg-white/15 text-slate-900 dark:text-white border border-[#E8DFC8] dark:border-white/25 hover:bg-blue-700 hover:text-white dark:hover:bg-[#89D3BD] dark:hover:text-black hover:border-blue-700 dark:hover:border-[#89D3BD] transition-all duration-300 backdrop-blur-md hover:scale-110 active:scale-95 shadow-2xl focus:outline-none cursor-pointer group touch-manipulation ${isClosing ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                            title="Next Certificate"
                            aria-label="Next Certificate"
                        >
                            <ChevronRight className="w-5 h-5 sm:w-7 sm:h-7 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                    )}

                    <div
                        className="relative w-full h-full flex items-center justify-center overflow-hidden px-3 sm:px-16 pt-14 pb-16 sm:py-20"
                        onClick={closeLightbox}
                    >
                        <div
                            className={`relative ${isClosing
                                ? 'animate-close-image pointer-events-none'
                                : 'transition-transform duration-200 ease-out'
                                } zoom-level-${zoomLevel.toString().replace('.', '-')}`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="bg-[#F5EDE0]/95 dark:bg-zinc-950/90 backdrop-blur-md rounded-2xl p-1.5 sm:p-3.5 border border-[#E8DFC8] dark:border-zinc-800 shadow-[0_0_60px_rgba(29,78,216,0.2)] dark:shadow-[0_0_80px_rgba(137,211,189,0.3)] flex items-center justify-center max-w-[94vw] sm:max-w-[85vw]">
                                <img
                                    key={selectedItem.file}
                                    src={selectedItem.file}
                                    alt={selectedItem.title}
                                    className="relative max-w-full max-h-[64vh] sm:max-h-[72vh] object-contain rounded-xl select-none"
                                    draggable={false}
                                />
                            </div>
                        </div>
                    </div>

                    <div className={`fixed bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 px-5 sm:px-6 py-2 sm:py-2.5 bg-[#F5EDE0]/90 dark:bg-white/10 border border-[#E8DFC8] dark:border-white/20 backdrop-blur-md rounded-2xl text-slate-900 dark:text-white text-center max-w-[92vw] sm:max-w-[75vw] z-50 shadow-2xl transition-all duration-400 ease-out pointer-events-none ${isClosing ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'}`}>
                        <p className="text-xs sm:text-base font-semibold leading-snug break-words whitespace-normal tracking-wide text-slate-900 dark:text-white">
                            {selectedItem.title}
                        </p>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Achievements;
