import { TypeAnimation } from "react-type-animation";
import { Button } from "@/components/ui/button";
import { Download, Github, Linkedin, Mail, ChevronDown, User, Globe, Compass, Zap, Brain, Users, Cpu, Atom, Microscope, BarChart3, Rocket, Search, Code, Puzzle, Bot, FlaskConical, FileText, Palette, ExternalLink, type LucideIcon } from "lucide-react";
import StudyBackground from "./StudyBackground";
import { motion } from "framer-motion";
import SectionTitle from "./SectionTitle";
import AnimatedIcon from "./AnimatedIcon";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { smoothScrollToTarget } from "@/lib/scrollUtils";

const Hero = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentIcon, setCurrentIcon] = useState<LucideIcon>(Code);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleViewResume = (path: string) => {
    window.open(encodeURI(path), "_blank", "noopener,noreferrer");
  };

  const handleDownloadResume = (path: string, filename: string) => {
    const link = document.createElement("a");
    link.href = encodeURI(path);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const scrollToSection = (sectionId: string) => {
    smoothScrollToTarget(`#${sectionId}`, { headerOffset: 80 });
  };

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center relative overflow-hidden pt-14 pb-4 md:pt-16 md:pb-8"
    >
      <StudyBackground />
      <div className="container mx-auto px-4 py-4 md:py-12 z-10">
        <motion.div
          className="max-w-4xl mx-auto text-center space-y-3.5 md:space-y-6 mt-1 md:mt-12"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="space-y-4">
            <h2 className="text-xl md:text-2xl text-muted-foreground font-medium" role="status" aria-live="polite">
              Hi, I'm
            </h2>
            <h1 className="text-5xl md:text-5xl font-bold mb-2 md:mb-4 max-w-[280px] mx-auto md:max-w-none">
              <SectionTitle
                segments={[
                  { text: "Babin", className: "text-blue-700 dark:text-[#89D3BD]" },
                  { text: " Bid", className: "text-blue-700 dark:text-[#89D3BD]" },
                ]}
              />
            </h1>
            <div className="text-[11.5px] min-[360px]:text-[12.5px] min-[400px]:text-sm sm:text-lg md:text-2xl lg:text-3xl font-semibold text-foreground min-h-[46px] sm:min-h-[64px] md:min-h-[96px] flex items-center justify-center">
              <div className="flex flex-row items-center justify-center gap-1.5 sm:gap-2.5 md:gap-3 max-w-[96vw] md:max-w-none">
                <div className="flex items-center shrink-0">
                  <span className="hidden sm:inline-block">
                    <AnimatedIcon
                      Icon={currentIcon}
                      size={28}
                      className="text-blue-700 dark:text-[#89D3BD]"
                      glowColor="transparent"
                      animationType="bounce"
                    />
                  </span>
                  <span className="sm:hidden">
                    <AnimatedIcon
                      Icon={currentIcon}
                      size={18}
                      className="text-blue-700 dark:text-[#89D3BD]"
                      glowColor="transparent"
                      animationType="bounce"
                    />
                  </span>
                </div>
                <div className="text-blue-700 dark:text-[#89D3BD] text-center md:text-left whitespace-nowrap leading-tight md:leading-normal">
                  <TypeAnimation
                    sequence={[
                      () => setCurrentIcon(Code),
                      'Computer Science Engineer',
                      1600,
                      () => setCurrentIcon(Globe),
                      'Learning Web Development',
                      1500,
                      () => setCurrentIcon(Compass),
                      'Mathematics Lover',
                      1400,
                      () => setCurrentIcon(Puzzle),
                      'Problem Solver',
                      1200,
                      () => setCurrentIcon(Microscope),
                      'Research on various aspects',
                      1500,
                      () => setCurrentIcon(Zap),
                      'Tech Enthusiast',
                      1200,
                      () => setCurrentIcon(Brain),
                      'Brainstorming',
                      1200,
                      () => setCurrentIcon(Users),
                      'Radical Collaboration',
                      1400,
                      () => setCurrentIcon(Bot),
                      'Exploring AI & Machine Learning',
                      1500,
                      () => setCurrentIcon(Atom),
                      'Quantum & Edge Computing',
                      1700,
                      () => setCurrentIcon(FlaskConical),
                      'Gathering knowledge in Quantum Physics',
                      1400,
                      () => setCurrentIcon(BarChart3),
                      'Interested in Data Analysis & Data Science',
                      1400,
                      () => setCurrentIcon(Rocket),
                      'Always Eager to Learn, Collaborate & Innovate',
                      1600,
                      () => setCurrentIcon(Search),
                      'Open to Internships, Papers & Opportunities',
                      2200,
                    ]}
                    wrapper="span"
                    speed={50}
                    repeat={Infinity}
                  />
                </div>
                <div className="flex items-center shrink-0">
                  <span className="hidden sm:inline-block">
                    <AnimatedIcon
                      Icon={currentIcon}
                      size={28}
                      className="scale-x-[-1] text-blue-700 dark:text-[#89D3BD]"
                      glowColor="transparent"
                      animationType="bounce"
                    />
                  </span>
                  <span className="sm:hidden">
                    <AnimatedIcon
                      Icon={currentIcon}
                      size={18}
                      className="scale-x-[-1] text-blue-700 dark:text-[#89D3BD]"
                      glowColor="transparent"
                      animationType="bounce"
                    />
                  </span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed -mt-2 md:-mt-4">
            B.Tech 4th Year Student at Adamas University, Kolkata, India. Passionate
            about building innovative solutions and contributing to cutting-edge
            research.
          </p>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 justify-center flex-wrap">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size="lg"
                    className="gradient-primary text-primary-foreground shadow-glow transition-all duration-300 active:scale-95 w-full sm:w-auto flex items-center justify-center gap-2 cursor-pointer group rounded-full px-6"
                    aria-label="View and Download Resume Options"
                  >
                    <Download className="h-5 w-5 transition-transform group-hover:-translate-y-0.5" />
                    <span>Resume</span>
                  </Button>
                </DialogTrigger>
                <DialogContent
                  className="w-[92vw] max-w-lg p-5 sm:p-6 bg-background/95 dark:bg-[#080B10]/95 backdrop-blur-2xl border border-blue-500/30 dark:border-[#89D3BD]/30 shadow-2xl rounded-3xl z-50 text-left"
                >
                  <DialogHeader className="text-left pb-3 border-b border-border/50">
                    <DialogTitle className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-700 to-sky-500 dark:from-[#89D3BD] dark:to-cyan-400 bg-clip-text text-transparent flex items-center gap-2">
                      <Download className="w-5 h-5 text-blue-700 dark:text-[#89D3BD]" />
                      Select Resume Version
                    </DialogTitle>
                    <DialogDescription className="text-xs text-muted-foreground pt-1">
                      Choose the format that best fits your evaluation requirements
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-3 pt-2">
                    <div className="p-3.5 sm:p-4 rounded-2xl border border-blue-500/25 dark:border-[#89D3BD]/25 bg-blue-500/5 dark:bg-[#89D3BD]/5 hover:bg-blue-500/10 dark:hover:bg-[#89D3BD]/10 transition-all">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-blue-700/10 dark:bg-[#89D3BD]/15 border border-blue-700/20 dark:border-[#89D3BD]/30 flex items-center justify-center text-blue-700 dark:text-[#89D3BD] shrink-0 mt-0.5">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm sm:text-base font-bold text-foreground">LaTeX Resume</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/25">
                              ATS-Friendly
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                            Single-column, clean typography, optimized for ATS parsers & technical evaluation.
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2.5 mt-3.5 pl-0 sm:pl-12">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 text-xs flex-1 rounded-full border-blue-700/30 dark:border-[#89D3BD]/30 hover:bg-blue-700 hover:text-white dark:hover:bg-[#89D3BD] dark:hover:text-black font-semibold cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
                          onClick={() => handleViewResume("/Babin_Resume_LATEX.pdf")}
                        >
                          <ExternalLink className="w-3.5 h-3.5 mr-1" /> View
                        </Button>
                        <Button
                          size="sm"
                          className="h-8 text-xs flex-1 rounded-full gradient-primary text-primary-foreground font-semibold cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm"
                          onClick={() => handleDownloadResume("/Babin_Resume_LATEX.pdf", "Babin_Bid_Resume_LATEX.pdf")}
                        >
                          <Download className="w-3.5 h-3.5 mr-1" /> Download
                        </Button>
                      </div>
                    </div>

                    <div className="p-3.5 sm:p-4 rounded-2xl border border-blue-700/25 dark:border-[#89D3BD]/30 bg-gradient-to-r from-blue-700/10 to-[#89D3BD]/15 dark:from-blue-700/20 dark:to-[#89D3BD]/20 hover:from-blue-700/15 hover:to-[#89D3BD]/25 transition-all">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-700/20 to-[#89D3BD]/30 border border-blue-700/30 dark:border-[#89D3BD]/40 flex items-center justify-center text-blue-700 dark:text-[#89D3BD] shrink-0 mt-0.5">
                          <Palette className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm sm:text-base font-bold text-foreground">Canva Resume</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-r from-blue-700/15 to-[#89D3BD]/25 text-blue-800 dark:text-[#89D3BD] font-semibold border border-blue-700/30 dark:border-[#89D3BD]/35">
                              Visual Design
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                            Stylized visual layout showcasing UI aesthetics, project highlights & graphical presentation.
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2.5 mt-3.5 pl-0 sm:pl-12">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 text-xs flex-1 rounded-full border-blue-700/40 dark:border-[#89D3BD]/40 text-blue-700 dark:text-[#89D3BD] hover:bg-blue-700 hover:text-white dark:hover:bg-[#89D3BD] dark:hover:text-black font-semibold cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
                          onClick={() => handleViewResume("/Babin_Bid_Resume.pdf")}
                        >
                          <ExternalLink className="w-3.5 h-3.5 mr-1" /> View
                        </Button>
                        <Button
                          size="sm"
                          className="h-8 text-xs flex-1 rounded-full bg-gradient-to-r from-blue-700 to-[#0d9488] hover:from-blue-800 hover:to-[#0f766e] text-white dark:from-blue-600 dark:to-[#89D3BD] dark:text-slate-950 dark:hover:from-blue-500 dark:hover:to-[#9ee0cc] font-semibold cursor-pointer shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                          onClick={() => handleDownloadResume("/Babin_Bid_Resume.pdf", "Babin_Bid_Resume.pdf")}
                        >
                          <Download className="w-3.5 h-3.5 mr-1" /> Download
                        </Button>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </motion.div>

            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              <Button
                size="lg"
                variant="outline"
                className="border-primary/50 hover:bg-primary/10 hover:text-black dark:text-white transition-all duration-300 active:scale-95 w-full sm:w-auto rounded-full px-6"
                onClick={() => scrollToSection('contact')}
                aria-label="Navigate to contact section"
              >
                <Mail className="mr-2 h-5 w-5" />
                Contact
              </Button>
            </motion.div>
          </div>

          <div className="flex items-center justify-center gap-3 sm:gap-4 pt-4 md:pt-8 flex-wrap">
            <a
              href="https://github.com/Babin123456"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit GitHub profile"
              title="GitHub"
              className="relative group w-12 h-12 aspect-square shrink-0 p-0 rounded-full flex items-center justify-center border border-border/40 hover:border-blue-700/60 dark:hover:border-[#89D3BD]/60 transition-all duration-300 hover:scale-110 active:scale-95 bg-white/80 dark:bg-white/5 backdrop-blur-md"
            >
              <div className="absolute inset-0 bg-blue-700/20 dark:bg-[#89D3BD]/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
              <div className="absolute inset-0 bg-blue-700/10 dark:bg-[#89D3BD]/15 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Github className="h-5 w-5 sm:h-6 sm:w-6 text-foreground/70 group-hover:text-blue-700 dark:group-hover:text-[#89D3BD] transition-colors relative z-10" />
            </a>
            <a
              href="https://www.linkedin.com/in/babinbid123"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit LinkedIn profile"
              title="LinkedIn"
              className="relative group w-12 h-12 aspect-square shrink-0 p-0 rounded-full flex items-center justify-center border border-border/40 hover:border-blue-700/60 dark:hover:border-[#89D3BD]/60 transition-all duration-300 hover:scale-110 active:scale-95 bg-white/80 dark:bg-white/5 backdrop-blur-md"
            >
              <div className="absolute inset-0 bg-blue-700/20 dark:bg-[#89D3BD]/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
              <div className="absolute inset-0 bg-blue-700/10 dark:bg-[#89D3BD]/15 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Linkedin className="h-5 w-5 sm:h-6 sm:w-6 text-foreground/70 group-hover:text-blue-700 dark:group-hover:text-[#89D3BD] transition-colors relative z-10" />
            </a>
            <a
              href="mailto:babinbid05@gmail.com"
              aria-label="Send email"
              title="Email"
              className="relative group w-12 h-12 aspect-square shrink-0 p-0 rounded-full flex items-center justify-center border border-border/40 hover:border-blue-700/60 dark:hover:border-[#89D3BD]/60 transition-all duration-300 hover:scale-110 active:scale-95 bg-white/80 dark:bg-white/5 backdrop-blur-md"
            >
              <div className="absolute inset-0 bg-blue-700/20 dark:bg-[#89D3BD]/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
              <div className="absolute inset-0 bg-blue-700/10 dark:bg-[#89D3BD]/15 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-foreground/70 group-hover:text-blue-700 dark:group-hover:text-[#89D3BD] transition-colors relative z-10" />
            </a>
          </div>

          <div className="pt-3 md:pt-6 flex flex-col items-center justify-center select-none">
            <p className="text-xs sm:text-sm text-muted-foreground mb-1.5 select-none pointer-events-none">
              Explore More
            </p>
            <button
              type="button"
              onClick={() => scrollToSection('about')}
              aria-label="Explore more - scroll to about section"
              className="animate-bounce w-10 h-10 aspect-square shrink-0 p-0 rounded-full border border-blue-700/40 dark:border-[#89D3BD]/40 hover:border-blue-700 dark:hover:border-[#89D3BD] bg-blue-700/5 dark:bg-[#89D3BD]/5 hover:bg-blue-700/15 dark:hover:bg-[#89D3BD]/15 flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-700 dark:focus:ring-[#89D3BD]"
            >
              <ChevronDown className="h-5 w-5 text-blue-700 dark:text-[#89D3BD]" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
