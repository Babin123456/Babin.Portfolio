import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Award,
  Users,
  TrendingUp,
  Wrench,
  Leaf,
  Github,
  ExternalLink,
  BookOpen,
  Copy,
  Check,
  Building,
  Layers,
  BarChart3,
  CheckCircle2,
  Trophy
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import SectionTitle from "./SectionTitle";
import AnimatedIcon from "./AnimatedIcon";
import StudyBackground from "./StudyBackground";

const Research = () => {
  const [copiedBibtex, setCopiedBibtex] = useState(false);
  const [activeSeasonTab, setActiveSeasonTab] = useState<'Winter' | 'Monsoon' | 'Summer'>('Winter');

  const highlights = [
    {
      icon: Award,
      label: 'Conference',
      value: 'SSWC 2025',
      colorClass: 'text-blue-700 dark:text-[#89D3BD]',
    },
    {
      icon: Users,
      label: 'Authors',
      value: '4 Authors',
      colorClass: 'text-blue-700 dark:text-[#89D3BD]',
    },
    {
      icon: TrendingUp,
      label: 'Status',
      value: 'Published (Springer)',
      colorClass: 'text-blue-700 dark:text-[#89D3BD]',
    },
  ];

  const bibtexCode = `@incollection{pal2026ml,
  author    = {Pal, Debdutta and Bid, Babin and Pramanick, Ritika and Ghosh, Liza},
  title     = {ML-Based Price Prediction for Agri-Horticultural Commodities},
  booktitle = {Smart Systems and Wireless Communication},
  series    = {Smart Innovation, Systems and Technologies},
  volume    = {484},
  pages     = {378--389},
  year      = {2026},
  publisher = {Springer, Cham},
  doi       = {10.1007/978-3-032-21164-4_30},
  url       = {https://link.springer.com/chapter/10.1007/978-3-032-21164-4_30},
  isbn      = {978-3-032-21164-4},
  issn      = {2190-3018}
}`;

  const handleCopyBibtex = () => {
    navigator.clipboard.writeText(bibtexCode);
    setCopiedBibtex(true);
    setTimeout(() => setCopiedBibtex(false), 2000);
  };

  const benchmarkData = {
    Winter: {
      crops: "Apple, Beetroot, Cabbage, Carrot, Cauliflower, Orange",
      rf: { r2: "0.9799", mae: "₹151.88", rmse: "₹528.73" },
      svm: { r2: "0.8062", mae: "₹631.69", rmse: "₹1640.37" },
    },
    Monsoon: {
      crops: "Banana, Guava, Papaya, Peach, Plum",
      rf: { r2: "0.9855", mae: "₹74.85", rmse: "₹195.11" },
      svm: { r2: "0.8295", mae: "₹299.14", rmse: "₹668.26" },
    },
    Summer: {
      crops: "Bhindi (Ladies Finger), Bitter gourd, Brinjal, Mango, Spinach",
      rf: { r2: "0.9893", mae: "₹64.04", rmse: "₹148.67" },
      svm: { r2: "0.9185", mae: "₹165.56", rmse: "₹409.86" },
    }
  };

  const seasonsList = [
    {
      name: "Winter Season",
      key: "Winter" as const,
      bestModel: "Random Forest Regressor",
      r2: "0.9799",
      mae: "₹151.88",
      rmse: "₹528.73",
      crops: "Apple, Beetroot, Cabbage, Carrot, Cauliflower, Orange",
      vsSvm: "SVM R²: 0.8062"
    },
    {
      name: "Monsoon Season",
      key: "Monsoon" as const,
      bestModel: "Random Forest Regressor",
      r2: "0.9855",
      mae: "₹74.85",
      rmse: "₹195.11",
      crops: "Banana, Guava, Papaya, Peach, Plum",
      vsSvm: "SVM R²: 0.8295"
    },
    {
      name: "Summer Season",
      key: "Summer" as const,
      bestModel: "Random Forest Regressor",
      r2: "0.9893",
      mae: "₹64.04",
      rmse: "₹148.67",
      crops: "Bhindi, Bitter gourd, Brinjal, Mango, Spinach",
      vsSvm: "SVM R²: 0.9185"
    }
  ];

  return (
    <section id="research" className="group py-12 md:py-20 relative">
      <StudyBackground />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 sm:mb-12 md:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 md:mb-4 px-2">
            <SectionTitle
              segments={[
                {
                  text: "Research",
                  className: "text-blue-700 dark:text-[#89D3BD]",
                },
                {
                  text: " Publications",
                  className: "text-blue-900 dark:text-cyan-300",
                },
              ]}
            />
          </h2>
          <p className="text-sm sm:text-base md:text-xl text-slate-800 dark:text-slate-200 font-medium max-w-2xl mx-auto px-4">
            Contributing to academic knowledge and peer-reviewed scientific literature
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.05 }}
          className="mt-4 md:-mt-8 lg:-mt-14 max-w-6xl mx-auto w-full"
          transition={{ duration: 0.8 }}
        >
          <Card className="glass p-3.5 sm:p-8 lg:p-12 transition-all space-y-6 sm:space-y-8 bg-[#FBF7F0]/90 dark:bg-black/50 border border-[#E8DFC8] dark:border-white/10 shadow-xl overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-start">
              <div className="space-y-5 sm:space-y-6 text-center lg:text-left">
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-700/10 dark:bg-[#89D3BD]/15 text-blue-700 dark:text-[#89D3BD] text-xs sm:text-sm font-bold border border-blue-700/30 dark:border-[#89D3BD]/30">
                    <FileText size={16} />
                    <span>Springer Nature Chapter</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-blue-700/15 to-[#89D3BD]/20 dark:from-blue-700/25 dark:to-[#89D3BD]/20 text-blue-900 dark:text-[#89D3BD] text-xs font-bold border border-blue-700/25 dark:border-[#89D3BD]/30">
                    <span className="w-2 h-2 rounded-full bg-blue-700 dark:bg-[#89D3BD] animate-pulse" />
                    <span>SIST Vol. 484 (pp. 378–389)</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold leading-snug sm:leading-tight break-words text-slate-900 dark:text-white">
                    ML-Based Price Prediction for Agri-Horticultural Commodities
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold text-blue-800 dark:text-[#89D3BD] mt-1.5">
                    Proceedings of Smart Systems and Wireless Communication (SSWC)
                  </p>
                </div>

                <div className="p-3.5 sm:p-4 rounded-xl bg-[#F5EDE0] dark:bg-white/[0.04] border border-[#E8DFC8] dark:border-white/10 space-y-2.5 text-xs sm:text-sm shadow-sm text-left">
                  <div className="flex items-start gap-2">
                    <Users className="w-4 h-4 text-blue-700 dark:text-[#89D3BD] shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-bold text-slate-900 dark:text-white">Authors &amp; Roles:</p>
                      <ul className="text-slate-800 dark:text-slate-200 space-y-1 pl-1">
                        <li>
                          <strong className="text-slate-950 dark:text-white">Dr. Debdutta Pal</strong>{" "}
                          <span className="text-[11px] text-blue-700 dark:text-[#89D3BD] font-bold">
                            (Supervisor &amp; Corresponding Author — pal.debdutta@gmail.com)
                          </span>
                        </li>
                        <li>
                          <strong className="text-slate-950 dark:text-white">Babin Bid</strong>{" "}
                          <span className="text-[11px] text-blue-700 dark:text-[#89D3BD] font-bold">
                            (Co-Author &amp; Lead Pipeline Developer)
                          </span>
                        </li>
                        <li>
                          <strong className="text-slate-950 dark:text-white">Liza Ghosh</strong>{" "}
                          <span className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                            (Co-Author &amp; Research Analyst)
                          </span>
                        </li>
                        <li>
                          <strong className="text-slate-950 dark:text-white">Ritika Pramanick</strong>{" "}
                          <span className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                            (Co-Author &amp; Machine Learning Developer)
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 pt-1.5 border-t border-[#E8DFC8] dark:border-white/10">
                    <Building className="w-4 h-4 text-blue-700 dark:text-[#89D3BD] shrink-0 mt-0.5" />
                    <p className="text-slate-800 dark:text-slate-200">
                      <strong className="text-slate-950 dark:text-white">Affiliation:</strong> Department of Computer Science &amp; Engineering, Adamas University, Kolkata, India
                    </p>
                  </div>
                </div>

                <div className="text-slate-800 dark:text-slate-200 text-xs sm:text-sm leading-relaxed space-y-2">
                  <p>
                    The agricultural sector faces severe hardships due to uneven pricing of agri-horticultural commodities. 
                    This research investigates machine learning models for forecasting seasonal market prices (Modal Price in ₹/kg) of vegetables and fruits across three major Indian harvest seasons.
                  
                    By leveraging historical Mandi price records, weather patterns, and socioeconomic features, the study models and compares{" "}
                    <strong className="text-slate-950 dark:text-white font-bold">Random Forest Regressor</strong> and{" "}
                    <strong className="text-slate-950 dark:text-white font-bold">Support Vector Regressor (SVR)</strong>, 
                    offering critical predictive analytics for farmers and consumers.
                  </p>
                  <div className="flex flex-wrap justify-center lg:justify-start gap-1.5 pt-1">
                    {["Random Forest", "Support Vector Machine", "Predictive Analytics"].map((kw) => (
                      <span key={kw} className="px-2.5 py-0.5 rounded text-[11px] bg-blue-700/10 dark:bg-[#89D3BD]/15 text-blue-800 dark:text-[#89D3BD] border border-blue-700/20 dark:border-[#89D3BD]/30 font-semibold">
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {highlights.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.label}
                        className="group/section relative rounded-xl p-2.5 sm:p-3 text-center bg-[#F5EDE0] dark:bg-white/5 backdrop-blur-sm border border-[#E8DFC8] dark:border-white/10 transition-all duration-300 cursor-default shadow-sm hover:shadow-[0_10px_20px_rgba(29,78,216,0.2)] dark:hover:shadow-[0_10px_20px_rgba(137,211,189,0.2)] flex flex-col items-center justify-center"
                      >
                        <div className="mx-auto mb-1 w-fit">
                          <AnimatedIcon
                            Icon={Icon}
                            size={20}
                            glowColor="transparent"
                            animationType="scale"
                            className={`${item.colorClass} group-hover/section:-translate-y-1 sm:w-6 sm:h-6`}
                          />
                        </div>
                        <div className="mb-0.5 text-[9px] uppercase tracking-wider text-slate-700 dark:text-slate-300 font-black">
                          {item.label}
                        </div>
                        <div className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate w-full">
                          {item.value}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <Card className="group/section p-4 bg-[#F5EDE0] dark:bg-white/[0.04] border border-[#E8DFC8] dark:border-white/10 space-y-2.5 text-xs shadow-sm transition-all duration-300 hover:shadow-[0_10px_20px_rgba(29,78,216,0.18)] dark:hover:shadow-[0_10px_20px_rgba(137,211,189,0.18)]">
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white border-b border-[#E8DFC8] dark:border-white/10 pb-2">
                    <div className="transition-transform duration-300 group-hover/section:scale-110 group-hover/section:-translate-y-0.5">
                      <Layers className="w-4 h-4 text-blue-700 dark:text-[#89D3BD] transition-transform duration-300" />
                    </div>
                    <span>Publication Metadata</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-slate-800 dark:text-slate-200">
                    <div>
                      <span className="font-bold text-slate-950 dark:text-white block">Series / Vol:</span>
                      SIST Vol. 484
                    </div>
                    <div>
                      <span className="font-bold text-slate-950 dark:text-white block">Published:</span>
                      May 01, 2026
                    </div>
                    <div>
                      <span className="font-bold text-slate-950 dark:text-white block">Pages:</span>
                      pp. 378–389
                    </div>
                    <div>
                      <span className="font-bold text-slate-950 dark:text-white block">Publisher:</span>
                      Springer, Cham
                    </div>
                    <div className="col-span-2">
                      <span className="font-bold text-slate-950 dark:text-white block">DOI:</span>
                      <a
                        href="https://doi.org/10.1007/978-3-032-21164-4_30"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-700 dark:text-[#89D3BD] font-bold hover:underline break-all"
                      >
                        10.1007/978-3-032-21164-4_30
                      </a>
                    </div>
                    <div>
                      <span className="font-bold text-slate-950 dark:text-white block">Print ISBN:</span>
                      978-3-032-21164-4
                    </div>
                    <div>
                      <span className="font-bold text-slate-950 dark:text-white block">Online ISBN:</span>
                      978-3-032-21163-7
                    </div>
                    <div>
                      <span className="font-bold text-slate-950 dark:text-white block">Print ISSN:</span>
                      2190-3018
                    </div>
                    <div>
                      <span className="font-bold text-slate-950 dark:text-white block">Electronic ISSN:</span>
                      2190-3026
                    </div>
                  </div>
                </Card>

                <Card className="group/section bg-[#F5EDE0] dark:bg-white/[0.04] p-4 border border-[#E8DFC8] dark:border-white/10 shadow-sm transition-all duration-300 hover:shadow-[0_10px_20px_rgba(29,78,216,0.18)] dark:hover:shadow-[0_10px_20px_rgba(137,211,189,0.18)]">
                  <h4 className="font-bold text-xs sm:text-sm mb-2 flex items-center gap-1.5 text-slate-900 dark:text-white">
                    <div className="transition-transform duration-300 group-hover/section:scale-110 group-hover/section:-translate-y-0.5">
                      <Wrench className="w-4 h-4 text-blue-700 dark:text-[#89D3BD]" />
                    </div>
                    <span>Methodology &amp; Tech Stack</span>
                  </h4>
                  <div className="flex flex-wrap justify-center sm:justify-start gap-1.5">
                    {['Python', 'Scikit-Learn', 'Random Forest', 'Support Vector Machine', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn'].map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-0.5 rounded-full bg-blue-700/10 dark:bg-[#89D3BD]/15 text-blue-700 dark:text-[#89D3BD] border border-blue-700/20 dark:border-[#89D3BD]/30 text-[11px] font-bold transition-all duration-300 hover:shadow-[0_6px_12px_rgba(29,78,216,0.25)] dark:hover:shadow-[0_6px_12px_rgba(137,211,189,0.25)] cursor-default"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </Card>

                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <Button
                    size="sm"
                    asChild
                    className="h-8 px-2.5 text-xs font-extrabold rounded-lg bg-gradient-to-r from-blue-700 via-blue-800 to-[#89D3BD] hover:from-blue-800 hover:to-[#72c2aa] dark:from-[#89D3BD] dark:via-[#72c2aa] dark:to-blue-700 dark:hover:from-[#78c9b2] dark:hover:to-blue-800 text-white dark:text-slate-950 shadow-[0_3px_10px_rgba(29,78,216,0.3)] dark:shadow-[0_3px_10px_rgba(137,211,189,0.3)] hover:shadow-[0_5px_15px_rgba(29,78,216,0.4)] dark:hover:shadow-[0_5px_15px_rgba(137,211,189,0.4)] transition-all duration-200 cursor-pointer border-0"
                  >
                    <a
                      href="https://link.springer.com/chapter/10.1007/978-3-032-21164-4_30"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5"
                    >
                      <BookOpen size={13} className="shrink-0" />
                      <span className="font-black">Springer</span>
                      <ExternalLink size={11} className="opacity-80 shrink-0" />
                    </a>
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    asChild
                    className="h-8 px-2.5 text-xs font-extrabold rounded-lg border-2 border-blue-700/60 dark:border-[#89D3BD]/60 text-blue-900 dark:text-[#89D3BD] bg-transparent hover:bg-blue-700 hover:text-white dark:hover:bg-[#89D3BD] dark:hover:text-black shadow-[0_2px_6px_rgba(29,78,216,0.1)] dark:shadow-[0_2px_6px_rgba(137,211,189,0.1)] hover:shadow-[0_4px_12px_rgba(29,78,216,0.2)] dark:hover:shadow-[0_4px_12px_rgba(137,211,189,0.2)] transition-all duration-200 cursor-pointer"
                  >
                    <a
                      href="/ML-Based Price Prediction for Agri-Horticultural Commodities.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5"
                    >
                      <FileText size={13} className="shrink-0" />
                      <span className="font-black">PDF</span>
                    </a>
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    asChild
                    className="h-8 px-2.5 text-xs font-extrabold rounded-lg border-2 border-slate-400 dark:border-slate-600 text-slate-900 dark:text-slate-100 bg-transparent hover:border-blue-700 hover:bg-blue-700 hover:text-white dark:hover:border-[#89D3BD] dark:hover:bg-[#89D3BD] dark:hover:text-black shadow-[0_2px_6px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_6px_rgba(0,0,0,0.3)] hover:shadow-[0_4px_12px_rgba(29,78,216,0.2)] dark:hover:shadow-[0_4px_12px_rgba(137,211,189,0.2)] transition-all duration-200 cursor-pointer"
                  >
                    <a
                      href="https://github.com/Babin123456/ML-Based-Price-Prediction"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5"
                    >
                      <Github size={13} className="shrink-0" />
                      <span className="font-black">Codebase</span>
                    </a>
                  </Button>

                  <Button
                    size="sm"
                    asChild
                    className="h-8 px-2.5 text-xs font-extrabold rounded-lg bg-gradient-to-r from-blue-700 via-blue-800 to-[#89D3BD] hover:from-blue-800 hover:to-[#72c2aa] dark:from-[#89D3BD] dark:via-[#72c2aa] dark:to-blue-700 dark:hover:from-[#78c9b2] dark:hover:to-blue-800 text-white dark:text-slate-950 shadow-[0_3px_10px_rgba(29,78,216,0.3)] dark:shadow-[0_3px_10px_rgba(137,211,189,0.3)] hover:shadow-[0_5px_15px_rgba(29,78,216,0.4)] dark:hover:shadow-[0_5px_15px_rgba(137,211,189,0.4)] transition-all duration-200 cursor-pointer border-0"
                  >
                    <a
                      href="https://eurekamag.com/research/107/899/107899461.php"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5"
                    >
                      <span className="font-black">EurekaMag</span>
                      <ExternalLink size={11} className="opacity-80 shrink-0" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-[#E8DFC8] dark:border-white/10">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-700 dark:text-[#89D3BD]" />
                <div>
                  <h4 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                    Model Performance Benchmark
                  </h4>
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                    Empirical evaluation on historical Mandi price datasets across harvest seasons
                  </p>
                </div>
              </div>

              <div className="block md:hidden space-y-3">
                <div className="p-3 rounded-lg bg-gradient-to-r from-blue-700/10 to-[#89D3BD]/15 border border-blue-700/20 dark:border-[#89D3BD]/30 text-xs text-slate-900 dark:text-slate-100 font-bold flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-blue-700 dark:text-[#89D3BD] shrink-0" />
                  <span>Key Finding: <strong className="text-blue-700 dark:text-[#89D3BD]">Random Forest Regressor</strong> consistently achieves top accuracy (up to ~0.989 R²).</span>
                </div>

                <div className="flex items-center justify-between gap-1 p-1 rounded-xl bg-[#EFE5D5] dark:bg-white/10 border border-[#E8DFC8] dark:border-white/10">
                  {(['Winter', 'Monsoon', 'Summer'] as const).map((season) => (
                    <button
                      key={season}
                      onClick={() => setActiveSeasonTab(season)}
                      className={`flex-1 py-1.5 px-2 text-xs font-black rounded-lg transition-all duration-200 cursor-pointer text-center ${
                        activeSeasonTab === season
                          ? 'bg-gradient-to-r from-blue-700 to-blue-800 text-white dark:from-[#89D3BD] dark:to-[#72c2aa] dark:text-slate-950 shadow-[0_4px_12px_rgba(29,78,216,0.3)] dark:shadow-[0_4px_12px_rgba(137,211,189,0.3)]'
                          : 'text-slate-800 dark:text-slate-200 hover:text-blue-700 dark:hover:text-[#89D3BD] hover:bg-black/5 dark:hover:bg-white/5'
                      }`}
                    >
                      {season}
                    </button>
                  ))}
                </div>

                {(() => {
                  const currentSeason = seasonsList.find((s) => s.key === activeSeasonTab) || seasonsList[0];
                  return (
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeSeasonTab}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.2 }}
                        className="p-4 rounded-xl border-2 border-blue-700/25 dark:border-[#89D3BD]/30 bg-[#F5EDE0] dark:bg-white/[0.04] space-y-3 shadow-md"
                      >
                        <div className="flex items-center justify-between border-b border-[#E8DFC8] dark:border-white/10 pb-2">
                          <span className="font-black text-slate-950 dark:text-white text-sm flex items-center gap-1.5">
                            <Leaf className="w-4 h-4 text-blue-700 dark:text-[#89D3BD]" />
                            {currentSeason.name}
                          </span>
                          <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-blue-700/15 dark:bg-[#89D3BD]/20 text-blue-800 dark:text-[#89D3BD] border border-blue-700/30 dark:border-[#89D3BD]/40">
                            Best: {currentSeason.r2} R²
                          </span>
                        </div>

                        <div className="text-xs text-slate-800 dark:text-slate-200 leading-snug">
                          <strong className="text-slate-950 dark:text-white font-extrabold">Crops Covered:</strong> {currentSeason.crops}
                        </div>

                        <div className="bg-[#FAF4E8] dark:bg-black/40 p-3 rounded-xl border border-[#E8DFC8] dark:border-white/10 space-y-2">
                          <div className="flex items-center justify-between text-xs pb-1 border-b border-[#E8DFC8]/60 dark:border-white/5">
                            <span className="font-black text-blue-800 dark:text-[#89D3BD] flex items-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4 text-blue-700 dark:text-[#89D3BD]" />
                              {currentSeason.bestModel}
                            </span>
                            <span className="font-mono font-black text-xs text-blue-700 dark:text-[#89D3BD]">
                              R² = {currentSeason.r2}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-xs font-mono font-bold text-slate-900 dark:text-slate-100">
                            <div className="p-1.5 rounded-lg bg-[#EFE5D5]/70 dark:bg-white/5 border border-[#E8DFC8] dark:border-white/5">
                              <span className="text-[10px] text-slate-600 dark:text-slate-400 block font-sans font-semibold">Mean Abs Error</span>
                              {currentSeason.mae}
                            </div>
                            <div className="p-1.5 rounded-lg bg-[#EFE5D5]/70 dark:bg-white/5 border border-[#E8DFC8] dark:border-white/5">
                              <span className="text-[10px] text-slate-600 dark:text-slate-400 block font-sans font-semibold">Root Mean Sq Error</span>
                              {currentSeason.rmse}
                            </div>
                          </div>

                          <div className="text-[11px] text-slate-700 dark:text-slate-300 pt-1.5 border-t border-[#E8DFC8]/60 dark:border-white/5 flex items-center justify-between">
                            <span className="font-semibold">Baseline Model Comparison:</span>
                            <span className="font-mono font-bold text-slate-900 dark:text-slate-200">{currentSeason.vsSvm}</span>
                          </div>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  );
                })()}
              </div>

              <div className="hidden md:block space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                    Select a harvest season to inspect detailed metrics:
                  </span>
                  <div className="flex items-center gap-1.5 bg-[#EFE5D5] dark:bg-white/10 p-1 rounded-lg border border-[#E8DFC8] dark:border-white/10 w-fit">
                    {(['Winter', 'Monsoon', 'Summer'] as const).map((season) => (
                      <button
                        key={season}
                        onClick={() => setActiveSeasonTab(season)}
                        className={`px-3.5 py-1 text-xs font-extrabold rounded-md transition-all duration-300 cursor-pointer ${
                          activeSeasonTab === season
                            ? 'bg-gradient-to-r from-blue-700 to-blue-800 text-white dark:from-[#89D3BD] dark:to-[#72c2aa] dark:text-black shadow-[0_6px_15px_rgba(29,78,216,0.35)] dark:shadow-[0_6px_15px_rgba(137,211,189,0.35)]'
                            : 'text-slate-800 dark:text-slate-200 hover:text-blue-700 dark:hover:text-[#89D3BD] hover:bg-black/5 dark:hover:bg-white/5'
                        }`}
                      >
                        {season}
                      </button>
                    ))}
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSeasonTab}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="rounded-xl border border-[#E8DFC8] dark:border-white/10 bg-[#FAF4E8] dark:bg-black/30 overflow-hidden shadow-sm"
                  >
                    <div className="p-3 bg-[#EFE5D5] dark:bg-white/[0.04] border-b border-[#E8DFC8] dark:border-white/10 text-xs flex flex-wrap items-center justify-between gap-2">
                      <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Leaf className="w-3.5 h-3.5 text-blue-700 dark:text-[#89D3BD]" />
                        <strong>Harvest Coverage:</strong> {benchmarkData[activeSeasonTab].crops}
                      </span>
                      <span className="text-[11px] text-blue-800 dark:text-[#89D3BD] font-extrabold bg-blue-700/10 dark:bg-[#89D3BD]/20 px-2 py-0.5 rounded border border-blue-700/25 dark:border-[#89D3BD]/30">
                        RF Best R²: {benchmarkData[activeSeasonTab].rf.r2}
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-[#EAE0CF] dark:bg-white/[0.02] text-slate-800 dark:text-slate-200 font-extrabold border-b border-[#E8DFC8] dark:border-white/10">
                          <tr>
                            <th className="py-2.5 px-4 text-slate-950 dark:text-white">Algorithm Model</th>
                            <th className="py-2.5 px-4 text-center text-slate-950 dark:text-white">R² Score (Accuracy)</th>
                            <th className="py-2.5 px-4 text-center text-slate-950 dark:text-white">Mean Absolute Error (MAE)</th>
                            <th className="py-2.5 px-4 text-center text-slate-950 dark:text-white">Root Mean Squared Error (RMSE)</th>
                            <th className="py-2.5 px-4 text-right text-slate-950 dark:text-white">Outcome</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E8DFC8] dark:divide-white/10">
                          <tr className="bg-gradient-to-r from-blue-700/10 to-[#89D3BD]/10 dark:from-blue-700/[0.08] dark:to-[#89D3BD]/[0.08] font-medium">
                            <td className="py-3 px-4 font-extrabold text-slate-950 dark:text-white flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-blue-700 dark:bg-[#89D3BD]" />
                              Random Forest Regressor
                            </td>
                            <td className="py-3 px-4 text-center text-blue-700 dark:text-[#89D3BD] font-extrabold text-sm">
                              {benchmarkData[activeSeasonTab].rf.r2}
                            </td>
                            <td className="py-3 px-4 text-center font-mono font-semibold text-slate-900 dark:text-slate-100">
                              {benchmarkData[activeSeasonTab].rf.mae}
                            </td>
                            <td className="py-3 px-4 text-center font-mono font-semibold text-slate-900 dark:text-slate-100">
                              {benchmarkData[activeSeasonTab].rf.rmse}
                            </td>
                            <td className="py-3 px-4 text-right font-extrabold text-blue-700 dark:text-[#89D3BD]">
                              Optimal Model ★
                            </td>
                          </tr>
                          <tr>
                            <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-slate-400" />
                              Support Vector Machine (SVR)
                            </td>
                            <td className="py-3 px-4 text-center font-bold text-sm text-slate-900 dark:text-slate-100">
                              {benchmarkData[activeSeasonTab].svm.r2}
                            </td>
                            <td className="py-3 px-4 text-center font-mono text-slate-800 dark:text-slate-200 font-medium">
                              {benchmarkData[activeSeasonTab].svm.mae}
                            </td>
                            <td className="py-3 px-4 text-center font-mono text-slate-800 dark:text-slate-200 font-medium">
                              {benchmarkData[activeSeasonTab].svm.rmse}
                            </td>
                            <td className="py-3 px-4 text-right text-xs text-slate-600 dark:text-slate-400">
                              Baseline Comparison
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E8DFC8] dark:border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                  <FileText className="w-4 h-4 text-blue-700 dark:text-[#89D3BD]" />
                  <span>BibTeX Citation</span>
                </div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCopyBibtex}
                    className="h-8 px-3 text-xs flex items-center gap-1.5 border-2 border-blue-700/60 dark:border-[#89D3BD]/60 text-slate-900 dark:text-slate-100 hover:bg-blue-700 hover:text-white dark:hover:bg-[#89D3BD] dark:hover:text-black font-bold transition-all duration-300 hover:shadow-[0_8px_18px_rgba(29,78,216,0.3)] dark:hover:shadow-[0_8px_18px_rgba(137,211,189,0.3)] cursor-pointer"
                  >
                    {copiedBibtex ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-blue-700 dark:text-black" />
                        <span className="font-extrabold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Citation</span>
                      </>
                    )}
                  </Button>
                </motion.div>
              </div>

              <div className="relative rounded-xl bg-slate-900 dark:bg-black/80 border border-slate-700 dark:border-white/10 p-3 sm:p-4 overflow-x-auto font-mono text-[11px] sm:text-xs text-slate-200 leading-relaxed shadow-inner">
                <pre className="whitespace-pre">{bibtexCode}</pre>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default Research;