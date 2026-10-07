import { useInView } from "react-intersection-observer";
import { useState, useCallback, useRef, useEffect } from "react";
import StudyBackground from "./StudyBackground";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// Lightweight lazy image component to avoid loading large thumbnails until needed
const LazyImage = ({ src, alt, className, forceLoad }: { src: string; alt: string; className?: string; forceLoad?: boolean }) => {
  const { ref, inView } = useInView({ triggerOnce: true, rootMargin: "200px" });
  const [loaded, setLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState<string | null>(null);

  useEffect(() => {
    if (inView || forceLoad) {
      setImgSrc(encodeURI(src));
    }
  }, [inView, forceLoad, src]);

  return (
    <div ref={ref} className="w-full h-full relative overflow-hidden rounded-xl">
      {!loaded && (
        <div className="absolute inset-0 bg-slate-200/60 dark:bg-slate-800/60 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 dark:via-white/10 to-transparent" />
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center opacity-40">
            <div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>
        </div>
      )}
      {imgSrc ? (
        <img
          src={imgSrc}
          alt={alt}
          width={640}
          height={160}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          className={`${className} ${loaded ? "opacity-100 blur-0 scale-100" : "opacity-0 blur-sm scale-105"} transition-all duration-500 object-contain object-center`}
        />
      ) : null}
    </div>
  );
};
import type { EmblaPluginType } from "embla-carousel";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, Star, Hand, ChevronsLeftRight, X } from "lucide-react";
import SectionTitle from "./SectionTitle";
import { motion, AnimatePresence, Variants } from "framer-motion";

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.1 }
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  },
};

const Projects = () => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  // Separate inView for auto-scroll (not triggerOnce)
  const { ref: carouselRef, inView: carouselInView } = useInView({
    threshold: 0.3,
  });

  const [isHovered, setIsHovered] = useState(false);

  // Autoplay plugin will be loaded dynamically to avoid build-time resolution issues on Vercel
  const [plugins, setPlugins] = useState<EmblaPluginType[]>([]);

  // Dynamically import the embla autoplay plugin only in the browser/runtime
  useEffect(() => {
    let mounted = true;
    import('embla-carousel-autoplay')
      .then((mod) => {
        if (!mounted) return;
        const Autoplay = (mod && (mod.default || mod));
        try {
          const plugin = Autoplay({ delay: 2000, stopOnInteraction: false, stopOnMouseEnter: true });
          setPlugins([plugin]);
        } catch (e) {
          // plugin init failed
          console.warn('Failed to initialize embla autoplay plugin', e);
        }
      })
      .catch(() => {
        // ignore import errors during SSR/build
      });

    return () => { mounted = false; };
  }, []);

  // Pause auto-scroll on user interaction
  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  const getBadgeClasses = (tech: string) => {
    const key = tech.toLowerCase();
    const baseClasses = "px-2 py-0.5 text-[10px] font-bold rounded-full border transition-all duration-300 ease-in-out cursor-default dark:hover:text-black hover:shadow-[0_10px_20px_rgba(29,78,216,0.3)] dark:hover:shadow-[0_10px_20px_rgba(137,211,189,0.3)]";

    switch (key) {
      case "python":
        return `${baseClasses} bg-blue-700/10 dark:bg-[#89D3BD]/10 text-blue-700 dark:text-[#89D3BD] border-blue-700/20 dark:border-[#89D3BD]/20 hover:bg-blue-700 dark:hover:bg-[#89D3BD] hover:text-white`;
      case "react":
        return `${baseClasses} bg-blue-700/10 dark:bg-[#89D3BD]/10 text-blue-700 dark:text-[#89D3BD] border-blue-700/20 dark:border-[#89D3BD]/20 hover:bg-blue-700 dark:hover:bg-[#89D3BD] hover:text-white`;
      case "typescript":
        return `${baseClasses} bg-blue-700/10 dark:bg-[#89D3BD]/10 text-blue-700 dark:text-[#89D3BD] border-blue-700/20 dark:border-[#89D3BD]/20 hover:bg-blue-700 dark:hover:bg-[#89D3BD] hover:text-white`;
      case "tailwind":
      case "tailwindcss":
        return `${baseClasses} bg-blue-700/10 dark:bg-[#89D3BD]/10 text-blue-700 dark:text-[#89D3BD] border-blue-700/20 dark:border-[#89D3BD]/20 hover:bg-blue-700 dark:hover:bg-[#89D3BD] hover:text-white`;
      case "streamlit":
        return `${baseClasses} bg-blue-700/10 dark:bg-[#89D3BD]/10 text-blue-700 dark:text-[#89D3BD] border-blue-700/20 dark:border-[#89D3BD]/20 hover:bg-blue-700 dark:hover:bg-[#89D3BD] hover:text-white`;
      case "plotly":
        return `${baseClasses} bg-blue-700/10 dark:bg-[#89D3BD]/10 text-blue-700 dark:text-[#89D3BD] border-blue-700/20 dark:border-[#89D3BD]/20 hover:bg-blue-700 dark:hover:bg-[#89D3BD] hover:text-white`;
      case "xgboost":
        return `${baseClasses} bg-blue-700/10 dark:bg-[#89D3BD]/10 text-blue-700 dark:text-[#89D3BD] border-blue-700/20 dark:border-[#89D3BD]/20 hover:bg-blue-700 dark:hover:bg-[#89D3BD] hover:text-white`;
      case "flask":
        return `${baseClasses} bg-blue-700/10 dark:bg-[#89D3BD]/10 text-blue-700 dark:text-[#89D3BD] border-blue-700/20 dark:border-[#89D3BD]/20 hover:bg-blue-700 dark:hover:bg-[#89D3BD] hover:text-white`;
      case "scikit-learn":
      case "scikit":
        return `${baseClasses} bg-blue-700/10 dark:bg-[#89D3BD]/10 text-blue-700 dark:text-[#89D3BD] border-blue-700/20 dark:border-[#89D3BD]/20 hover:bg-blue-700 dark:hover:bg-[#89D3BD] hover:text-white`;
      case "html":
        return `${baseClasses} bg-blue-700/10 dark:bg-[#89D3BD]/10 text-blue-700 dark:text-[#89D3BD] border-blue-700/20 dark:border-[#89D3BD]/20 hover:bg-blue-700 dark:hover:bg-[#89D3BD] hover:text-white`;
      case "css":
        return `${baseClasses} bg-blue-700/10 dark:bg-[#89D3BD]/10 text-blue-700 dark:text-[#89D3BD] border-blue-700/20 dark:border-[#89D3BD]/20 hover:bg-blue-700 dark:hover:bg-[#89D3BD] hover:text-white`;
      case "javascript":
      case "js":
        return `${baseClasses} bg-blue-700/10 dark:bg-[#89D3BD]/10 text-blue-700 dark:text-[#89D3BD] border-blue-700/20 dark:border-[#89D3BD]/20 hover:bg-blue-700 dark:hover:bg-[#89D3BD] hover:text-white`;
      case "vite":
        return `${baseClasses} bg-blue-700/10 dark:bg-[#89D3BD]/10 text-blue-700 dark:text-[#89D3BD] border-blue-700/20 dark:border-[#89D3BD]/20 hover:bg-blue-700 dark:hover:bg-[#89D3BD] hover:text-white`;
      case "ai/ml":
        return `${baseClasses} bg-blue-700/10 dark:bg-[#89D3BD]/10 text-blue-700 dark:text-[#89D3BD] border-blue-700/20 dark:border-[#89D3BD]/20 hover:bg-blue-700 dark:hover:bg-[#89D3BD] hover:text-white`;
      case "data visualization":
        return `${baseClasses} bg-blue-700/10 dark:bg-[#89D3BD]/10 text-blue-700 dark:text-[#89D3BD] border-blue-700/20 dark:border-[#89D3BD]/20 hover:bg-blue-700 dark:hover:bg-[#89D3BD] hover:text-white`;
      case "json":
        return `${baseClasses} bg-blue-700/10 dark:bg-[#89D3BD]/10 text-blue-700 dark:text-[#89D3BD] border-blue-700/20 dark:border-[#89D3BD]/20 hover:bg-blue-700 dark:hover:bg-[#89D3BD] hover:text-white`;
      case "numpy":
        return `${baseClasses} bg-blue-700/10 dark:bg-[#89D3BD]/10 text-blue-700 dark:text-[#89D3BD] border-blue-700/20 dark:border-[#89D3BD]/20 hover:bg-blue-700 dark:hover:bg-[#89D3BD] hover:text-white`;
      case "pandas":
        return `${baseClasses} bg-blue-700/10 dark:bg-[#89D3BD]/10 text-blue-700 dark:text-[#89D3BD] border-blue-700/20 dark:border-[#89D3BD]/20 hover:bg-blue-700 dark:hover:bg-[#89D3BD] hover:text-white`;
      case "fastapi":
        return `${baseClasses} bg-blue-700/10 dark:bg-[#89D3BD]/10 text-blue-700 dark:text-[#89D3BD] border-blue-700/20 dark:border-[#89D3BD]/20 hover:bg-blue-700 dark:hover:bg-[#89D3BD] hover:text-white`;
      case "gui":
        return `${baseClasses} bg-blue-700/10 dark:bg-[#89D3BD]/10 text-blue-700 dark:text-[#89D3BD] border-blue-700/20 dark:border-[#89D3BD]/20 hover:bg-blue-700 dark:hover:bg-[#89D3BD] hover:text-white`;
      case "framer motion":
        return `${baseClasses} bg-blue-700/10 dark:bg-[#89D3BD]/10 text-blue-700 dark:text-[#89D3BD] border-blue-700/20 dark:border-[#89D3BD]/20 hover:bg-blue-700 dark:hover:bg-[#89D3BD] hover:text-white`;
      case "sqlite":
        return `${baseClasses} bg-blue-700/10 dark:bg-[#89D3BD]/10 text-blue-700 dark:text-[#89D3BD] border-blue-700/20 dark:border-[#89D3BD]/20 hover:bg-blue-700 dark:hover:bg-[#89D3BD] hover:text-white`;
      case "groq api (llama)":
        return `${baseClasses} bg-blue-700/10 dark:bg-[#89D3BD]/10 text-blue-700 dark:text-[#89D3BD] border-blue-700/20 dark:border-[#89D3BD]/20 hover:bg-blue-700 dark:hover:bg-[#89D3BD] hover:text-white`;
      default:
        return `${baseClasses} bg-blue-700/10 text-blue-700 dark:text-[#89D3BD] border-blue-700/20 dark:border-[#89D3BD]/20 hover:bg-blue-700 dark:hover:bg-[#89D3BD] hover:text-white dark:hover:text-black`;
    }
  };

  const projects = [
    {
      title: "OutboxOverdrive",
      description:
        "OutboxOverdrive — A high-throughput, fault-tolerant email scheduling and throttling engine featuring persistent queues, sliding-window rate limiting, full-text fuzzy search, and real-time monitoring.",
      tech: [
        "React 18",
        "TypeScript",
        "Vite",
        "Tailwind CSS",
        "Node.js",
        "Express",
        "BullMQ",
        "Redis",
        "PostgreSQL",
        "Prisma ORM",
        "Elasticsearch",
        "Nodemailer",
        "Google OAuth 2.0",
      ],
      github: null,
      githubPrivate: true,
      demo: "https://outbox-overdrive.vercel.app/",
      features: [
        "High-throughput, persistent job queuing and background workers powered by BullMQ & Redis",
        "Configurable sliding-window rate limiting and graceful delay handling per provider",
        "Relational message orchestration with PostgreSQL and Prisma ORM",
        "Sub-millisecond full-text and fuzzy search indexing via Elasticsearch",
        "Secure Google OAuth 2.0 authentication and automated dispatch via Nodemailer",
        "Live operational dashboard for tracking delivery health, retries, and failure states",
      ],
      thumbnail: "/projects/OutboxOverdrive.webp",
    },
    {
      title: "CargoConnect",
      description:
        "CargoConnect — India's Premier Logistics & Cargo Transfer Booking Platform connecting users with on-demand vehicles for seamless intra-city and inter-city moving with instant fare estimation.",
      tech: ["React 18", "TypeScript", "Vite", "Tailwind CSS", "React Router", "jsPDF", "Nodemailer", "Vercel"],
      github: "https://github.com/Babin123456/CargoConnect",
      demo: "https://cargo-connect-new.vercel.app/",
      features: [
        "Browse verified vehicles (Mini Tempo, Large Tempo, Cargo Truck)",
        "Instant fare estimation & pickup/destination mapping",
        "PDF invoice & receipt generation using jsPDF",
        "Email confirmation alerts via Vercel serverless functions (Nodemailer)",
        "Mobile-first, responsive modern UI with React Router v6",
        "Deployment on Vercel platform",
      ],
      thumbnail: "/projects/CargoConnect.webp",
    },
    {
      title: "CivicSignal AI",
      description:
        "CivicSignal AI — Autonomous Multi-Modal AI & Geospatial Civic Triage Engine built by Team Triangle to classify, prioritize, and route municipal hazards in real time.",
      tech: ["FastAPI", "React 18", "TypeScript", "YOLO", "Hugging Face", "MongoDB", "Redis", "Docker"],
      github: "https://github.com/Babin123456/CivicSignal",
      demo: null,
      features: [
        "Computer Vision hazard detection with YOLO",
        "Zero-shot NLP issue classification via Hugging Face Transformers",
        "OpenAI LLM-powered civic priority score & severity rating",
        "Geospatial 2dsphere indexing on MongoDB Atlas with Leaflet maps",
        "Asynchronous Celery worker queue with Upstash Redis rate limiting",
        "Team Triangle: Babin Bid, Debasmita Bose, Pratik Giri",
      ],
      thumbnail: "/projects/CivicSignal.webp",
    },
    {
      title: "ML-Based Price Prediction",
      description:
        "ML-Based Price Prediction for Agri-Horticultural Commodities — Peer-reviewed Springer Nature research paper & ML engine predicting seasonal vegetable & fruit market prices across harvest seasons.",
      tech: ["Python", "scikit-learn", "Random Forest", "SVR", "Pandas", "NumPy", "Matplotlib", "Seaborn"],
      github: "https://github.com/Babin123456/ML-Based-Price-Prediction",
      demo: "https://link.springer.com/chapter/10.1007/978-3-032-21164-4_30",
      features: [
        "Published in Springer Nature SIST (Vol. 484, pp. 378–389)",
        "Best Paper Award at 2nd Int. Conf. on Smart Systems & Wireless Communication (SSWC 2025)",
        "Random Forest Regressor (R² = 0.9893 Summer, 0.9855 Monsoon, 0.9799 Winter)",
        "Support Vector Regressor (SVR) benchmark comparative analysis",
        "Dynamic centralized configuration & headless multi-figure visualization pipeline",
        "Academic Supervisors & Authors: Dr. Debdutta Pal, Babin Bid, Ritika Pramanick, Liza Ghosh",
      ],
      thumbnail: "/projects/ML-Based_Price_Prediction.webp",
    },
    {
      title: "EduPilot AI",
      description:
        "EduPilot AI — Intelligent Academic Operational Layer for Higher Education Institutions tailored for Adamas University, streamlining curriculum, document analysis, and campus operations.",
      tech: ["React 18", "TypeScript 5", "FastAPI", "Groq LLaMA", "Gemini 1.5 Flash", "MongoDB", "Docker", "Vercel"],
      github: "https://github.com/Babin123456/EduPilot-AI",
      demo: "https://edupilot-ai-edtech.vercel.app/",
      features: [
        "Dual Groq LLM (LLaMA 3.3 70B) execution and intelligent routing",
        "Google Gemini 1.5 Flash Vision Cloud API for handwriting, formulas & diagram analysis",
        "Vector Search RAG engine using Hugging Face all-MiniLM-L6-v2 embeddings",
        "JWT access/refresh token security & bcrypt password hashing",
        "Tailored for Adamas University — VibeForge 1.0 Hackathon Submission",
        "Team Triangle: Babin Bid (Team Leader), Baibhab Adhikari, Subhajyoti Halder",
      ],
      thumbnail: "/projects/EduPilot-AI.webp",
    },
    {
      title: "KrishiBhoomi AI",
      description:
        "KrishiBhoomi AI — Production-Quality AI-Powered Agricultural Intelligence Platform delivering crop recommendations, leaf disease detection, and multilingual voice assistance in 11 Indian languages.",
      tech: ["Next.js 15", "React 19", "FastAPI", "PostgreSQL", "XGBoost", "Gemini API", "Whisper", "Docker"],
      github: "https://github.com/Babin123456/KrishiBhoomi-AI",
      demo: "https://krishi-bhoomi-ai.vercel.app/",
      features: [
        "XGBoost machine learning engine for localized crop recommendation",
        "EfficientNet CNN & Google Gemini API for real-time plant leaf disease detection",
        "OpenAI Whisper & Gemini voice assistant supporting 11 Indian languages",
        "FAISS & Gemini-powered RAG engine for government schemes & agricultural manuals",
        "PostgreSQL with 15 relational tables, Redis caching, & Docker orchestration",
        "Built for Build With AI program hosted by Hack2Skill (Author: Babin Bid)",
      ],
      thumbnail: "/projects/KrishiBhoomi-AI.webp",
    },
    {
      title: "AI Data Analysis",
      description:
        "AI Data Analysis — Full Stack GenAI Data Analysis Platform allowing users to upload datasets, generate natural-language SQL queries, and visualize charts instantly.",
      tech: ["React", "FastAPI", "DuckDB", "Groq LLaMA", "Plotly", "AG Grid", "MongoDB", "Firebase"],
      github: "https://github.com/Babin123456/Ai-Data-Analysis",
      demo: "https://ai-data-analysis-web-app.vercel.app/",
      features: [
        "In-memory analytical querying powered by DuckDB",
        "Groq Cloud API (LLaMA 3.3 70B) for zero-shot text-to-SQL & data explanations",
        "Interactive Plotly.js charts & high-performance data grid with AG Grid",
        "Multi-provider authentication via Firebase Auth (Google OAuth & Email) & JWT",
        "Dataset storage & metadata caching with MongoDB Atlas",
      ],
      thumbnail: "/projects/AI-Data-Analysis.webp",
    },
    {
      title: "StudyBuddy AI",
      description:
        "StudyBuddy AI — Offline-First AI Study Companion converting lecture notes (PDF, Markdown, or text) into interactive MCQs, 3D flip flashcards, and mock viva practice using local AI models.",
      tech: ["React 19", "Vite", "Tailwind CSS v4", "Framer Motion", "Node.js", "Express.js", "pdf-parse", "Ollama (Gemma)"],
      github: "https://github.com/Babin123456/StudyBuddy_AI",
      demo: null,
      features: [
        "Local-first document parsing for PDF, Markdown, and plain text lecture notes",
        "Interactive 3D flip flashcards powered by Framer Motion",
        "Automated multiple-choice question (MCQ) quiz generation",
        "Mock viva practice question simulator for oral exam preparation",
        "Privacy-first offline AI execution via Ollama runner (Gemma 2B / 7B)",
      ],
      thumbnail: "/projects/StudyBuddy-AI.webp",
    },
  ];

  return (
    <section id="projects" className="py-20 relative" ref={ref}>
      <StudyBackground />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="max-w-6xl mx-auto space-y-12"
        >
          <motion.div variants={itemVariants} className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 max-w-[280px] mx-auto md:max-w-none">
              <SectionTitle
                segments={[
                  {
                    text: "My",
                    className: "text-blue-900 dark:text-cyan-300",
                  },
                  {
                    text: " Projects",
                    className: "text-blue-700 dark:text-[#89D3BD]",
                  },
                ]}
              />
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Here are some of my recent and featured projects showcasing my skills and experience
            </p>
          </motion.div>

          <div
            ref={carouselRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              plugins={carouselInView ? plugins : []}
              className="w-full"
            >
              <CarouselContent>
                {projects.map((project, index) => (
                    <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                      <div className="p-2 h-full">
                        <Card tabIndex={0} className="relative h-full overflow-hidden border border-white/20 dark:border-white/10 shadow-card hover:shadow-glow transition-all duration-300 group flex flex-col bg-white/30 dark:bg-white/5 backdrop-blur-md hover:border-primary/30 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-[#89D3BD] focus-visible:ring-offset-2 focus-visible:ring-offset-background">
                          <div className="absolute inset-0 rounded-lg bg-violet-200/10 opacity-0 group-hover:opacity-100 dark:group-hover:opacity-0 transition-opacity duration-300 pointer-events-none" />
                          {project.thumbnail ? (
                            <div className="h-40 flex items-center justify-center bg-[#F5EDE0]/80 dark:bg-white/5 backdrop-blur-md p-3 overflow-hidden rounded-xl border border-[#E8DFC8] dark:border-white/10 shadow-sm">
                              <LazyImage
                                src={project.thumbnail}
                                alt={`${project.title} thumbnail`}
                                className="w-full h-full rounded transform transition-transform duration-300 ease-out group-hover:scale-105"
                              />
                            </div>
                          ) : (
                            <div className="h-40 flex items-center justify-center bg-[#F5EDE0]/80 dark:bg-white/5 backdrop-blur-md p-3 overflow-hidden rounded-xl border border-[#E8DFC8] dark:border-white/10 shadow-sm">
                              <span className="text-foreground font-bold text-lg group-hover:text-blue-700 dark:group-hover:text-[#89D3BD] group-focus:text-blue-700 dark:group-focus:text-[#89D3BD] transition-colors duration-300">{project.title}</span>
                            </div>
                          )}
                          <div className="w-full border-t-2 border-muted/30" />
                          <div className="p-4 flex flex-col flex-grow">
                            <div className="space-y-3 flex-grow">
                              <h3 className="text-base font-bold text-foreground group-hover:text-blue-700 dark:group-hover:text-[#89D3BD] group-focus:text-blue-700 dark:group-focus:text-[#89D3BD] transition-colors duration-300">
                                {project.title}
                              </h3>
                              <p className="text-xs text-muted-foreground leading-relaxed">
                                {project.description}
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {project.tech.map((tech, techIndex) => (
                                  <span
                                    key={techIndex}
                                    className={`${getBadgeClasses(tech)} px-2 py-0.5 text-xs rounded-full border transition-all duration-300 ease-in-out`}
                                  >
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="flex gap-2 items-center mt-auto pt-3">
                              {project.githubPrivate || !project.github ? (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1 h-8 text-[11px] opacity-60 cursor-not-allowed bg-blue-100/60 dark:bg-white/10 text-blue-900 dark:text-white/70 border border-blue-200 dark:border-white/15 font-semibold"
                                  disabled
                                  title="Repository is private"
                                >
                                  <Github className="mr-1 h-3 w-3 shrink-0" />
                                  GitHub (Private)
                                </Button>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1 h-8 text-xs border-2 border-blue-700 dark:border-[#89D3BD] text-blue-700 dark:text-[#89D3BD] bg-transparent hover:bg-blue-700 dark:hover:bg-[#89D3BD] hover:text-white dark:hover:text-black font-black transform transition-all duration-300 ease-out hover:scale-105 hover:shadow-[0_12px_30px_rgba(29,78,216,0.42)] focus-visible:shadow-[0_12px_30px_rgba(29,78,216,0.42)] dark:hover:shadow-[0_10px_20px_rgba(6,182,212,0.32)] active:scale-95"
                                  asChild
                                >
                                  <a
                                    href={project.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <Github className="mr-1 h-3 w-3" />
                                    Code
                                  </a>
                                </Button>
                              )}
                              {project.demo ? (
                                <Button
                                  size="sm"
                                  className="flex-1 h-8 text-xs bg-blue-700 dark:bg-[#89D3BD] text-white dark:text-black font-black hover:opacity-90 transform transition-all duration-300 ease-out hover:scale-105 hover:shadow-[0_10px_20px_rgba(29,78,216,0.3)] dark:hover:shadow-[0_10px_20px_rgba(137,211,189,0.3)] active:scale-95"
                                  asChild
                                >
                                  <a
                                    href={project.demo}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <ExternalLink className="mr-1 h-3 w-3" />
                                    Demo
                                  </a>
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="flex-1 h-8 text-xs opacity-60 cursor-not-allowed bg-blue-100 dark:bg-white/10 text-blue-900 dark:text-white/70 border border-blue-200 dark:border-white/15"
                                  disabled
                                >
                                  <ExternalLink className="mr-1 h-3 w-3" />
                                  Demo
                                </Button>
                              )}
                            </div>
                          </div>
                        </Card>
                      </div>
                    </CarouselItem>
                  ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex border-blue-700 dark:border-[#89D3BD] text-blue-700 dark:text-[#89D3BD] bg-transparent hover:bg-blue-700 dark:hover:bg-[#89D3BD] hover:text-white dark:hover:text-black hover:shadow-[0_12px_30px_rgba(29,78,216,0.42)] focus-visible:shadow-[0_12px_30px_rgba(29,78,216,0.42)] dark:hover:shadow-[0_10px_20px_rgba(6,182,212,0.32)]" />
              <CarouselNext className="hidden md:flex border-blue-700 dark:border-[#89D3BD] text-blue-700 dark:text-[#89D3BD] bg-transparent hover:bg-blue-700 dark:hover:bg-[#89D3BD] hover:text-white dark:hover:text-black hover:shadow-[0_12px_30px_rgba(29,78,216,0.42)] focus-visible:shadow-[0_12px_30px_rgba(29,78,216,0.42)] dark:hover:shadow-[0_10px_20px_rgba(6,182,212,0.32)]" />
            </Carousel>
          </div>

          <div className="md:hidden flex items-center justify-center gap-2 mt-4 text-muted-foreground select-none">
            <Hand className="w-4 h-4 text-blue-700 dark:text-[#89D3BD] -rotate-12" />
            <span className="text-sm font-medium">Swipe to explore more projects</span>
            <ChevronsLeftRight className="w-4 h-4 text-blue-700 dark:text-[#89D3BD] animate-pulse" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
