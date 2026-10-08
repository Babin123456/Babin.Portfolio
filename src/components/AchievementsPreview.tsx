import { motion, Variants } from "framer-motion";
import { Award, Trophy, Medal, Star, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import SectionTitle from "./SectionTitle";
import StudyBackground from "./StudyBackground";

interface FeaturedAchievement {
  title: string;
  category: string;
  file: string;
  icon: typeof Award;
}

const featuredAchievements: FeaturedAchievement[] = [
  {
    title: "Best Paper Award in SSWC-2025",
    category: "Awards & Recognitions",
    file: "/Achievements/Awards/SSWC'2025_Award.webp",
    icon: Trophy,
  },
  {
    title: "Merit Scholarship Award (2023)",
    category: "Awards & Recognitions",
    file: "/Achievements/Awards/Merit_Scholarship_Award.webp",
    icon: Medal,
  },
  {
    title: "ELUSoC 2026 - Rank #1 Outstanding Contributor",
    category: "Awards & Recognitions",
    file: "/Achievements/Open Source Programs/Certificates/ELUSoC_2026/ELUSOC_Certificate_ELUSOC-2026-CON-001.webp",
    icon: Trophy,
  },
  {
    title: "SSWC'25 Best Paper Certificate",
    category: "Awards & Recognitions",
    file: "/Achievements/Awards/SSWC'25_Best_Paper_Certificate.webp",
    icon: Award,
  },
  {
    title: "Merit Certificate for Academic Excellence (2023)",
    category: "Awards & Recognitions",
    file: "/Achievements/Awards/Babin_Bid_Merit_Scholarship_2023.webp",
    icon: Medal,
  },
  {
    title: "Nexus Spring of Code (NSoC) Certificate (2026)",
    category: "Awards & Recognitions",
    file: "/Achievements/Awards/NSoC_Certificate_Babin-Bid_2026.webp",
    icon: Award,
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const AchievementsPreview = () => {
  const navigate = useNavigate();
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  return (
    <section id="achievements-preview" className="py-20 relative overflow-hidden">
      <StudyBackground />

      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 -left-20 w-80 h-80 bg-blue-700/10 dark:bg-[#89D3BD]/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/3 -right-20 w-80 h-80 bg-blue-700/10 dark:bg-[#89D3BD]/10 rounded-full blur-[100px] animate-pulse [animation-delay:1.5s]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="max-w-6xl mx-auto space-y-12"
        >
          <motion.div variants={itemVariants} className="text-center space-y-4">
            <h2 className="text-4xl md:text-6xl font-black mb-3 tracking-tighter max-w-xs mx-auto md:max-w-none">
              <SectionTitle
                segments={[
                  {
                    text: "Key",
                    className: "text-blue-900 dark:text-cyan-300",
                  },
                  {
                    text: " Achievements",
                    className: "text-blue-700 dark:text-[#89D3BD]",
                  },
                ]}
              />
            </h2>
            <motion.p
              variants={itemVariants}
              className="text-sm md:text-base text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed tracking-wide"
            >
              Awards, recognitions, and milestones from my academic and professional journey
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {featuredAchievements.map((achievement, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{
                  y: -6,
                  scale: 1.02,
                  boxShadow: "0 10px 30px -5px rgba(29, 78, 216, 0.4), 0 0 20px rgba(29, 78, 216, 0.3)",
                  transition: { type: "spring", stiffness: 400, damping: 17 },
                }}
                className="group relative bg-white dark:bg-white/5 backdrop-blur-md rounded-2xl border border-slate-300 dark:border-white/10 hover:border-blue-600 dark:hover:border-[#89D3BD] hover:shadow-[0_0_25px_rgba(29,78,216,0.45)] dark:hover:shadow-[0_0_25px_rgba(137,211,189,0.45)] transition-all duration-300 overflow-hidden select-none"
              >
                <div className="relative h-44 overflow-hidden bg-[#F5EDE0]/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-slate-300 dark:border-zinc-900">
                  {!loadedImages.has(achievement.file) && !imageErrors.has(achievement.file) && (
                    <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
                      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 dark:via-white/10 to-transparent" />
                      <achievement.icon className="w-10 h-10 text-primary/25 animate-pulse" />
                    </div>
                  )}
                  {!imageErrors.has(achievement.file) ? (
                    <img
                      src={encodeURI(achievement.file)}
                      alt={achievement.title}
                      loading="lazy"
                      decoding="async"
                      onLoad={() => setLoadedImages(prev => new Set(prev).add(achievement.file))}
                      className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${loadedImages.has(achievement.file) ? 'opacity-100' : 'opacity-0'}`}
                      onError={() => setImageErrors(prev => new Set(prev).add(achievement.file))}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-700/5 dark:bg-[#89D3BD]/5">
                      <achievement.icon className="w-16 h-16 text-blue-700/30 dark:text-[#89D3BD]/30" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/90 dark:bg-black/70 text-blue-700 dark:text-[#89D3BD] backdrop-blur-sm border border-blue-700/20 dark:border-[#89D3BD]/20">
                      {achievement.category}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-center gap-3 text-center">
                    <div className="p-2 rounded-xl bg-blue-700/10 dark:bg-[#89D3BD]/10 shrink-0 group-hover:scale-110 transition-all duration-300">
                      <achievement.icon className="w-4 h-4 text-blue-700 dark:text-[#89D3BD]" />
                    </div>
                    <h3 className="text-sm font-bold leading-snug text-center group-hover:text-blue-700 dark:group-hover:text-[#89D3BD] transition-colors duration-300">
                      {achievement.title}
                    </h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div variants={itemVariants} className="text-center pt-4">
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 40px var(--shadow-color)",
                transition: { type: "spring", stiffness: 500, damping: 25 },
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/achievements")}
              className="group relative inline-flex items-center gap-3 px-8 py-3.5 rounded-full border-2 border-blue-700 dark:border-[#89D3BD] text-blue-700 dark:text-[#89D3BD] font-black text-sm transition-all duration-300 overflow-hidden bg-transparent cursor-pointer shadow-sm hover:shadow-[0_10px_25px_rgba(29,78,216,0.3)] dark:hover:shadow-[0_10px_25px_rgba(137,211,189,0.3)]"
            >
              <div className="absolute inset-0 bg-blue-700 dark:bg-[#89D3BD] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative z-10 flex items-center gap-2 group-hover:text-white dark:group-hover:text-black transition-colors duration-300">
                <Award className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                View All Achievements
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </span>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AchievementsPreview;
