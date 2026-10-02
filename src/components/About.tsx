import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  FileText,
  MessageCircle,
  GraduationCap,
  Quote,
  X,
  Code,
  Rocket,
  Brain,
  Zap,
  BookA,
  MapPin,
  Terminal as TerminalIcon,
  RotateCcw,
  Cpu,
  Palette,
  User,
  Trophy,
  Target,
  Heart,
  Mail,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import SectionTitle from "./SectionTitle";
import StudyBackground from "./StudyBackground";
import { previewThenDownload } from "@/lib/utils";

interface CommandOutput {
  id?: string;
  command: string;
  response: string | React.ReactNode;
  isAnimated?: boolean;
}

// Component to progressively reveal terminal text output with a typing animation
const TypingResponse = ({
  text,
  onComplete,
}: {
  text: string;
  onComplete?: () => void;
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const completedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  const textRef = useRef(text);

  useEffect(() => {
    onCompleteRef.current = onComplete;
    textRef.current = text;
  });

  useEffect(() => {
    if (completedRef.current) {
      setDisplayedText(textRef.current);
      return;
    }

    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayedText(textRef.current.slice(0, i));
      if (i >= textRef.current.length) {
        clearInterval(interval);
        completedRef.current = true;
        onCompleteRef.current?.();
      }
    }, 12);

    return () => clearInterval(interval);
  }, []); // Run animation once on initial mount

  return (
    <span>
      {displayedText}
      {displayedText.length < text.length && (
        <span className="inline-block w-1.5 h-3.5 bg-[#89D3BD] ml-0.5 animate-pulse align-middle" />
      )}
    </span>
  );
};

// Component that reveals structured lines with a smooth loader typing effect
const StructuredTypingResponse = ({
  children,
  onComplete,
}: {
  children: React.ReactNode;
  onComplete?: () => void;
}) => {
  const [stage, setStage] = useState<"loading" | "typing" | "done">("loading");

  useEffect(() => {
    // Stage 1: Brief terminal loader processing pulse (120ms)
    const loadTimer = setTimeout(() => {
      setStage("typing");
      // Stage 2: Smooth typewriter stream reveal (240ms)
      const streamTimer = setTimeout(() => {
        setStage("done");
        onComplete?.();
      }, 240);
      return () => clearTimeout(streamTimer);
    }, 120);

    return () => clearTimeout(loadTimer);
  }, [onComplete]);

  if (stage === "loading") {
    return (
      <div className="flex items-center gap-2 py-1 text-xs text-[#89D3BD] font-mono">
        <span className="inline-block w-2 h-3.5 bg-[#89D3BD] animate-pulse" />
        <span className="text-[11px] text-slate-400 italic">fetching directive output...</span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className="space-y-1.5"
    >
      {children}
    </motion.div>
  );
};

const COMMAND_SUGGESTIONS = [
  { cmd: "whoami", icon: User },
  { cmd: "skills", icon: Code },
  { cmd: "highlights", icon: Sparkles },
  { cmd: "achievements", icon: Trophy },
  { cmd: "focus", icon: Target },
  { cmd: "hobbies", icon: Heart },
  { cmd: "education", icon: GraduationCap },
  { cmd: "contact", icon: Mail },
  { cmd: "clear", icon: RotateCcw },
  { cmd: "help", icon: HelpCircle },
];

const About = () => {
  const [showImageModal, setShowImageModal] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Interactive Hacker Terminal State
  const [activeTab, setActiveTab] = useState<"terminal" | "bio">("terminal");
  const [terminalInput, setTerminalInput] = useState("");
  const [isTypingAnimation, setIsTypingAnimation] = useState(false);
  const [history, setHistory] = useState<CommandOutput[]>([
    {
      id: "init-1",
      command: "babin.init()",
      response: "System initialized. CS Engineer & Full-Stack / ML Developer ready. Type 'help' or click directives below.",
    },
  ]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [commandHistoryList, setCommandHistoryList] = useState<string[]>([]);
  const terminalLogsContainerRef = useRef<HTMLDivElement>(null);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToTerminalBottom = () => {
    if (terminalLogsContainerRef.current) {
      terminalLogsContainerRef.current.scrollTop = terminalLogsContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToTerminalBottom();
  }, [history]);

  // Clean up typing animation timer on unmount
  useEffect(() => {
    return () => {
      if (typingTimerRef.current) {
        clearInterval(typingTimerRef.current);
      }
    };
  }, []);

  const handleExecuteCommand = (cmdToRun?: string, animateResponse: boolean = false) => {
    // If a specific command is supplied, prioritize it; otherwise take terminalInput
    const rawCmd = (cmdToRun !== undefined ? cmdToRun : terminalInput).trim();
    if (!rawCmd) return;

    // Immediately clear input box so it never stays in the prompt while rendering into history
    setTerminalInput("");

    const cmdLower = rawCmd.toLowerCase();
    let response: string | React.ReactNode = "";

    switch (cmdLower) {
      case "help":
        response = (
          <div className="space-y-1.5 font-mono text-xs">
            <div className="flex items-center gap-1.5 text-blue-400 dark:text-[#89D3BD] font-bold">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Available System Directives:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 pl-1">
              <p className="flex items-center gap-1.5"><User className="w-3 h-3 text-cyan-400" /><span className="text-cyan-300 font-semibold">whoami</span> : Identity & roles</p>
              <p className="flex items-center gap-1.5"><Code className="w-3 h-3 text-blue-400" /><span className="text-blue-300 font-semibold">skills</span> : Tech stack & tools</p>
              <p className="flex items-center gap-1.5"><Trophy className="w-3 h-3 text-[#89D3BD]" /><span className="text-[#89D3BD] font-semibold">achievements</span> : Awards, scholarship & roles</p>
              <p className="flex items-center gap-1.5"><Target className="w-3 h-3 text-cyan-400" /><span className="text-cyan-300 font-semibold">focus</span> : Research & web goals</p>
              <p className="flex items-center gap-1.5"><GraduationCap className="w-3 h-3 text-blue-400" /><span className="text-blue-300 font-semibold">education</span> : Degree & honors</p>
              <p className="flex items-center gap-1.5"><Sparkles className="w-3 h-3 text-[#89D3BD]" /><span className="text-[#89D3BD] font-semibold">highlights</span> : Open-source ranks & PRs</p>
              <p className="flex items-center gap-1.5"><Heart className="w-3 h-3 text-cyan-400" /><span className="text-cyan-300 font-semibold">hobbies</span> : Personal interests</p>
              <p className="flex items-center gap-1.5"><Mail className="w-3 h-3 text-blue-400" /><span className="text-blue-300 font-semibold">contact</span> : Verified channels</p>
              <p className="flex items-center gap-1.5"><RotateCcw className="w-3 h-3 text-slate-400" /><span className="text-slate-300 font-semibold">clear</span> : Flush terminal buffer</p>
            </div>
          </div>
        );
        break;

      case "whoami":
        response = (
          <div className="space-y-1 font-mono text-xs">
            <div className="flex items-center gap-1.5 text-blue-400 dark:text-[#89D3BD] font-bold">
              <User className="w-3.5 h-3.5" />
              <span>Babin Bid</span>
            </div>
            <p className="text-slate-300">
              B.Tech CSE student at Adamas University | Transpiler Design Intern at TCG CREST | Passionate about Mathematical Problem Solving | Exploring AI & ML, Quantum Computing, Data Science & UI/UX Design.
            </p>
          </div>
        );
        break;

      case "skills":
        response = (
          <div className="space-y-1 font-mono text-xs">
            <div className="flex items-center gap-1.5 text-blue-400 dark:text-[#89D3BD] font-bold">
              <Code className="w-3.5 h-3.5" />
              <span>Technical Stack & Ecosystem:</span>
            </div>
            <p className="flex items-center gap-1.5 flex-wrap"><Cpu className="w-3 h-3 text-cyan-400 shrink-0" /><span className="text-cyan-300 font-semibold">Languages:</span> C | C++ | Java | Python | JavaScript | TypeScript | SQL</p>
            <p className="flex items-center gap-1.5 flex-wrap"><Rocket className="w-3 h-3 text-blue-400 shrink-0" /><span className="text-blue-300 font-semibold">Web & UI:</span> HTML | CSS | Tailwind CSS | React | Vite</p>
            <p className="flex items-center gap-1.5 flex-wrap"><Brain className="w-3 h-3 text-[#89D3BD] shrink-0" /><span className="text-[#89D3BD] font-semibold">Data Science & ML:</span> NumPy | Pandas | Matplotlib | Seaborn | Scikit-learn</p>
            <p className="flex items-center gap-1.5 flex-wrap"><Palette className="w-3 h-3 text-cyan-400 shrink-0" /><span className="text-cyan-300 font-semibold">Developer Tools:</span> Git | GitHub | VS Code | Antigravity | Canva</p>
          </div>
        );
        break;

      case "education":
        response = (
          <div className="space-y-1 font-mono text-xs">
            <div className="flex items-center gap-1.5 text-blue-400 dark:text-[#89D3BD] font-bold">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Academic Credentials:</span>
            </div>
            <p className="text-slate-300">
              B.Tech in Computer Science & Engineering • Adamas University, Kolkata, India • Final Year Student (2023 - 2027) • Merit Scholarship (3rd position in CSE Department in 1st Sem) • Belur, Howrah, West Bengal
            </p>
          </div>
        );
        break;

      case "achievements":
        response = (
          <div className="space-y-1 font-mono text-xs">
            <div className="flex items-center gap-1.5 text-blue-400 dark:text-[#89D3BD] font-bold">
              <Trophy className="w-3.5 h-3.5" />
              <span>Competitions, Honors & Ranks:</span>
            </div>
            <p className="flex items-start gap-1.5"><Trophy className="w-3 h-3 text-[#89D3BD] shrink-0 mt-0.5" /><span><strong className="text-[#89D3BD]">Best Paper Award:</strong> 2nd Int. Conf. on Smart Systems & Wireless Communication (SSWC 2025) for ML predictive modeling</span></p>
            <p className="flex items-start gap-1.5"><GraduationCap className="w-3 h-3 text-blue-400 shrink-0 mt-0.5" /><span><strong className="text-blue-300">Merit Scholarship:</strong> Secured 3rd position in CSE Department in 1st Semester</span></p>
            <p className="flex items-start gap-1.5"><Cpu className="w-3 h-3 text-cyan-400 shrink-0 mt-0.5" /><span><strong className="text-cyan-300">Industry Experience:</strong> Transpiler Design Intern at TCG CREST</span></p>
            <p className="flex items-start gap-1.5"><Rocket className="w-3 h-3 text-[#89D3BD] shrink-0 mt-0.5" /><span><strong className="text-[#89D3BD]">Student Leadership:</strong> Treasurer — Society for Data Science (S4DS) Student Chapter</span></p>
          </div>
        );
        break;

      case "highlights":
        response = (
          <div className="space-y-1 font-mono text-xs">
            <div className="flex items-center gap-1.5 text-blue-400 dark:text-[#89D3BD] font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Open Source Milestones & Global Ranks:</span>
            </div>
            <p className="flex items-start gap-1.5"><Sparkles className="w-3 h-3 text-cyan-400 shrink-0 mt-0.5" /><span><strong className="text-cyan-300">ELUSoC'26:</strong> Rank #1 Contributor with 896 merged PRs</span></p>
            <p className="flex items-start gap-1.5"><Sparkles className="w-3 h-3 text-[#89D3BD] shrink-0 mt-0.5" /><span><strong className="text-[#89D3BD]">NSoC'26:</strong> Top 3 Contributor among 1,100+ developers</span></p>
            <p className="flex items-start gap-1.5"><Sparkles className="w-3 h-3 text-blue-400 shrink-0 mt-0.5" /><span><strong className="text-blue-300">ECSoC'26:</strong> Global Rank #6 (Master Tier)</span></p>
            <p className="flex items-start gap-1.5"><Sparkles className="w-3 h-3 text-cyan-400 shrink-0 mt-0.5" /><span><strong className="text-cyan-300">GSSoC'26:</strong> Global Rank #10 among 46,000+ participants</span></p>
          </div>
        );
        break;

      case "focus":
        response = (
          <div className="space-y-1 font-mono text-xs">
            <div className="flex items-center gap-1.5 text-blue-400 dark:text-[#89D3BD] font-bold">
              <Target className="w-3.5 h-3.5" />
              <span>Professional Focus:</span>
            </div>
            <p className="text-slate-300">
              Building expertise in full-stack web development | Active on GitHub | Contributing to the open-source ecosystem | Always eager to Learn, Collaborate & Innovate | Open to Internships, Research Collaborations, Projects & New Opportunities
            </p>
          </div>
        );
        break;

      case "hobbies":
        response = (
          <div className="space-y-1 font-mono text-xs">
            <div className="flex items-center gap-1.5 text-blue-400 dark:text-[#89D3BD] font-bold">
              <Heart className="w-3.5 h-3.5" />
              <span>Passions & Hobbies:</span>
            </div>
            <p className="text-slate-300">
              Cricket | Badminton | Drawing | Exploring Quantum Physics & Mathematical Problem Solving
            </p>
          </div>
        );
        break;

      case "contact":
        response = (
          <div className="space-y-1 font-mono text-xs">
            <div className="flex items-center gap-1.5 text-blue-400 dark:text-[#89D3BD] font-bold">
              <Mail className="w-3.5 h-3.5" />
              <span>Verified Contact Coordinates:</span>
            </div>
            <p className="flex items-center gap-1.5"><Mail className="w-3 h-3 text-cyan-400" /><span className="text-slate-400">Email:</span> <a href="mailto:babinbid05@gmail.com" className="text-cyan-300 hover:underline">babinbid05@gmail.com</a></p>
            <p className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-[#89D3BD]" /><span className="text-slate-400">Location:</span> Belur, Howrah, West Bengal, India (+91 9123777679)</p>
            <p className="flex items-center gap-1.5"><Code className="w-3 h-3 text-blue-400" /><span className="text-slate-400">GitHub:</span> <a href="https://github.com/Babin123456" target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:underline">github.com/Babin123456</a></p>
            <p className="flex items-center gap-1.5"><Rocket className="w-3 h-3 text-cyan-400" /><span className="text-slate-400">LinkedIn:</span> <a href="https://www.linkedin.com/in/babinbid123" target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:underline">linkedin.com/in/babinbid123</a></p>
          </div>
        );
        break;

      case "clear":
        setHistory([]);
        setTerminalInput("");
        return;

      default:
        response = (
          <p className="text-cyan-300 dark:text-[#89D3BD] flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 shrink-0 text-blue-400" />
            <span>Command not recognized: '{rawCmd}'. Type 'help' to inspect operational directives.</span>
          </p>
        );
        break;
    }

    setHistory((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random()}`,
        command: rawCmd,
        response,
        isAnimated: animateResponse,
      },
    ]);
    setCommandHistoryList((prev) => [...prev, rawCmd]);
    setHistoryIndex(-1);
  };

  // Typing animation effect when user clicks a predefined directive option
  const handleDirectiveClick = (directive: string) => {
    if (isTypingAnimation) return;

    if (typingTimerRef.current) {
      clearInterval(typingTimerRef.current);
      typingTimerRef.current = null;
    }

    setIsTypingAnimation(true);
    setTerminalInput("");

    let charIndex = 0;
    typingTimerRef.current = setInterval(() => {
      charIndex++;
      setTerminalInput(directive.slice(0, charIndex));

      if (charIndex >= directive.length) {
        if (typingTimerRef.current) {
          clearInterval(typingTimerRef.current);
          typingTimerRef.current = null;
        }
        // Small pause before executing command so the full word is visible
        setTimeout(() => {
          setIsTypingAnimation(false);
          handleExecuteCommand(directive, true);
        }, 120);
      }
    }, 40);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Guard against IME composition double firing
    if (e.nativeEvent.isComposing || (e as unknown as { keyCode: number }).keyCode === 229) {
      return;
    }

    if (isTypingAnimation) {
      e.preventDefault();
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      handleExecuteCommand();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistoryList.length > 0) {
        const nextIdx = historyIndex + 1 < commandHistoryList.length ? historyIndex + 1 : historyIndex;
        setHistoryIndex(nextIdx);
        setTerminalInput(commandHistoryList[commandHistoryList.length - 1 - nextIdx]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setTerminalInput(commandHistoryList[commandHistoryList.length - 1 - nextIdx]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setTerminalInput("");
      }
    }
  };

  // Animation Variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.15,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const handleCloseModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowImageModal(false);
      setIsClosing(false);
    }, 280);
  };

  return (
    <section id="about" className="py-12 sm:py-16 md:py-28 relative overflow-hidden">
      <StudyBackground />

      {/* Subtle Ambient Light Gradients */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-700/10 dark:bg-[#89D3BD]/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/3 -right-20 w-80 h-80 bg-blue-700/10 dark:bg-[#89D3BD]/10 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-3 sm:px-6 relative z-10 max-w-6xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="space-y-8 sm:space-y-12 md:space-y-16"
        >
          {/* Section Header */}
          <div className="text-center space-y-2 sm:space-y-3 px-2">
            <motion.div variants={itemVariants}>
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight">
                <SectionTitle
                  segments={[
                    { text: "About", className: "text-blue-900 dark:text-cyan-300" },
                    { text: " Me", className: "text-blue-700 dark:text-[#89D3BD]" },
                  ]}
                />
              </h2>
            </motion.div>
            <motion.p
              variants={itemVariants}
              className="text-xs sm:text-base text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed"
            >
              B.Tech CSE Student at Adamas University • Transpiler Design Intern at TCG CREST • AI/ML & Quantum Computing
            </motion.p>
          </div>

          {/* Editorial & Hacker Console Hybrid Card */}
          <motion.div
            variants={itemVariants}
            className="rounded-2xl sm:rounded-3xl border border-border/70 bg-card/70 dark:bg-card/40 backdrop-blur-md p-3 sm:p-6 md:p-8 shadow-card hover:shadow-[0_20px_40px_rgba(29,78,216,0.18)] dark:hover:shadow-[0_20px_40px_rgba(137,211,189,0.15)] hover:border-blue-700/40 dark:hover:border-[#89D3BD]/40 transition-all duration-300"
          >
            {/* Top Header & Mode Switcher */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3.5 sm:pb-5 border-b border-border/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-blue-700/10 dark:bg-[#89D3BD]/10 border border-blue-700/20 dark:border-[#89D3BD]/20 flex items-center justify-center text-blue-700 dark:text-[#89D3BD] shrink-0">
                  <TerminalIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-foreground flex items-center gap-1.5 truncate">
                    Interactive Portfolio Console
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block shrink-0" />
                  </h3>
                  <p className="text-[11px] sm:text-xs text-muted-foreground truncate">
                    Explore my profile via commands or read the summary
                  </p>
                </div>
              </div>

              {/* View Switcher Pills */}
              <div className="grid grid-cols-2 sm:flex p-1 rounded-xl bg-muted/40 border border-border/50 text-xs font-semibold gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveTab("terminal")}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 text-center text-xs ${
                    activeTab === "terminal"
                      ? "bg-blue-700 text-white dark:bg-[#89D3BD] dark:text-slate-900 shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <TerminalIcon className="w-3.5 h-3.5" />
                  <span>Terminal</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("bio")}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 text-center text-xs ${
                    activeTab === "bio"
                      ? "bg-blue-700 text-white dark:bg-[#89D3BD] dark:text-slate-900 shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Overview</span>
                </button>
              </div>
            </div>

            {/* Main Interactive Body */}
            <div className="pt-3.5 sm:pt-5">
              <AnimatePresence mode="wait">
                {activeTab === "terminal" ? (
                  <motion.div
                    key="terminal"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-3.5 sm:space-y-4"
                  >
                    {/* Terminal Window Box - Windows PowerShell / CMD Style */}
                    <div className="rounded-xl sm:rounded-2xl border border-slate-700/70 hover:border-blue-500/50 dark:hover:border-[#89D3BD]/50 bg-[#0c0c0c] dark:bg-[#0c0c0c] p-3 sm:p-5 font-mono shadow-2xl transition-all duration-300 text-left select-text">
                      {/* Terminal Window Controls Bar */}
                      <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-white/10 text-xs text-slate-400 gap-2">
                        <div className="flex items-center gap-1.5 sm:gap-2 overflow-hidden">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] inline-block shadow-sm shrink-0" />
                          <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] inline-block shadow-sm shrink-0" />
                          <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f] inline-block shadow-sm shrink-0" />
                          <span className="ml-1 text-slate-300 font-mono text-[10px] sm:text-[11px] truncate flex items-center gap-1">
                            <span className="text-[#38bdf8] font-bold">PS</span> PowerShell
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleExecuteCommand("clear")}
                          className="terminal-action-btn text-[10px] sm:text-[11px] text-slate-400 hover:text-white flex items-center gap-1 transition-colors px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 shrink-0"
                          title="Clear screen buffer"
                        >
                          <RotateCcw className="w-3 h-3" />
                          Clear
                        </button>
                      </div>

                      {/* Terminal Scrollable Logs - Contained inside scroll with visible scrollbar and natural boundary handoff */}
                      <div
                        ref={terminalLogsContainerRef}
                        onWheel={(e) => {
                          const el = terminalLogsContainerRef.current;
                          if (!el) return;
                          const atTop = el.scrollTop <= 0 && e.deltaY < 0;
                          const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1 && e.deltaY > 0;
                          // If at top or bottom end, allow window scrolling naturally
                          if (!atTop && !atBottom) {
                            e.stopPropagation();
                          }
                        }}
                        className="space-y-3 max-h-[300px] min-h-[150px] overflow-y-auto pr-2 text-xs sm:text-[13px] leading-relaxed terminal-custom-scrollbar font-mono select-text"
                      >
                        {history.map((item, idx) => (
                          <div key={item.id || idx} className="space-y-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[#38bdf8] font-bold">PS C:\Users\Babin&gt;</span>
                              <span className="text-white font-semibold">{item.command}</span>
                            </div>
                            <div className="text-slate-300 pl-3 sm:pl-4 border-l-2 border-[#38bdf8]/40 my-1">
                              {item.isAnimated ? (
                                typeof item.response === "string" ? (
                                  <TypingResponse
                                    text={item.response}
                                    onComplete={() => {
                                      // Permanently mark this item as animated so it never retypes
                                      setHistory((prev) =>
                                        prev.map((h) =>
                                          h.id === item.id ? { ...h, isAnimated: false } : h
                                        )
                                      );
                                      scrollToTerminalBottom();
                                    }}
                                  />
                                ) : (
                                  <StructuredTypingResponse
                                    onComplete={() => {
                                      setHistory((prev) =>
                                        prev.map((h) =>
                                          h.id === item.id ? { ...h, isAnimated: false } : h
                                        )
                                      );
                                      scrollToTerminalBottom();
                                    }}
                                  >
                                    {item.response}
                                  </StructuredTypingResponse>
                                )
                              ) : (
                                item.response
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Interactive Prompt Line - Pure PowerShell style, identical in desktop and mobile */}
                      <div className="flex items-center gap-1.5 sm:gap-2 mt-3 pt-2.5 sm:mt-4 sm:pt-3 border-t border-white/10 text-xs sm:text-[13px] font-mono">
                        <span className="text-[#38bdf8] font-bold shrink-0 select-none text-[11px] sm:text-xs">
                          PS&gt;
                        </span>
                        <input
                          type="text"
                          value={terminalInput}
                          onChange={(e) => setTerminalInput(e.target.value)}
                          onKeyDown={handleKeyDown}
                          placeholder={isTypingAnimation ? "Typing..." : "Type 'help', 'skills'..."}
                          disabled={isTypingAnimation}
                          className="flex-1 min-w-0 bg-transparent text-white placeholder:text-slate-500 font-mono text-[11px] sm:text-[13px] cli-terminal-input caret-[#89D3BD]"
                          autoComplete="off"
                          spellCheck={false}
                          autoFocus={false}
                        />
                        <button
                          type="button"
                          onClick={() => handleExecuteCommand()}
                          disabled={isTypingAnimation}
                          className="terminal-action-btn px-2.5 py-1 sm:px-3 sm:py-1 rounded bg-[#1d4ed8] hover:bg-blue-600 disabled:opacity-50 text-white text-[11px] sm:text-xs font-mono transition-colors shrink-0 shadow-sm"
                        >
                          Run
                        </button>
                      </div>
                    </div>

                    {/* Quick Command Chips with Interactive Typing Animation - Exact original desktop style */}
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap directives-container text-xs font-mono pt-1">
                      <span className="text-muted-foreground text-[10px] sm:text-[11px] font-semibold tracking-wider">
                        DIRECTIVES:
                      </span>
                      {COMMAND_SUGGESTIONS.map((item) => (
                        <button
                          key={item.cmd}
                          type="button"
                          onClick={() => handleDirectiveClick(item.cmd)}
                          disabled={isTypingAnimation}
                          className="terminal-chip-btn inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg border border-border/80 bg-background/50 hover:bg-blue-700/10 dark:hover:bg-[#89D3BD]/10 hover:border-blue-700/40 dark:hover:border-[#89D3BD]/40 text-foreground/85 hover:text-blue-700 dark:hover:text-[#89D3BD] transition-all cursor-pointer font-mono disabled:opacity-50 text-[10px] sm:text-xs active:scale-95"
                        >
                          <item.icon className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-blue-600 dark:text-[#89D3BD] shrink-0" />
                          <span>{item.cmd}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="bio"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="grid lg:grid-cols-12 gap-8 md:gap-12 items-center text-left"
                  >
                    {/* Left Column: Portrait & Badge */}
                    <div className="lg:col-span-4 flex flex-col items-center text-center">
                      <div className="relative group">
                        <div className="relative rounded-3xl overflow-hidden border-2 border-border/80 p-1.5 bg-background/50 shadow-md">
                          <img
                            src="/Babin.webp"
                            alt="Babin Bid"
                            loading="lazy"
                            onClick={() => setShowImageModal(true)}
                            className="w-48 h-48 sm:w-56 sm:h-56 object-cover rounded-2xl cursor-pointer hover:scale-105 transition-transform duration-300"
                          />
                        </div>

                        {/* Status Pill */}
                        <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span>Active for Hiring • 2027 Grad</span>
                        </div>
                      </div>

                      <div className="mt-4 space-y-1">
                        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                          Babin Bid
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground flex items-center justify-center gap-1.5 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-blue-700 dark:text-[#89D3BD]" />
                          Belur, Howrah, West Bengal, India
                        </p>
                      </div>
                    </div>

                    {/* Right Column: Editorial Narrative */}
                    <div className="lg:col-span-8 space-y-5 text-center lg:text-left">
                      <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-700/10 dark:bg-[#89D3BD]/10 text-blue-700 dark:text-[#89D3BD] text-xs font-semibold uppercase tracking-wider">
                          <GraduationCap className="w-4 h-4" />
                          B.Tech CSE • Adamas University
                        </div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-700 dark:text-purple-300 text-xs font-semibold">
                          <Cpu className="w-3.5 h-3.5" />
                          Transpiler Design Intern • TCG CREST
                        </div>
                      </div>

                      <h4 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-foreground tracking-tight leading-snug">
                        Combining Problem Solving, Modern Web Apps & Emerging Tech to Build Useful Products.
                      </h4>

                      <p className="text-xs sm:text-base text-muted-foreground leading-relaxed font-normal">
                        I am a Final Year Computer Science student at Adamas University and a Transpiler Design Intern at TCG CREST. I enjoy solving challenging math problems, creating responsive web applications, and exploring AI, Data Science, and UI design. I actively contribute to open-source projects and love turning ideas into real-world software.
                      </p>

                      {/* Editorial Tag Pills - Centered on mobile, start-aligned on desktop */}
                      <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1">
                        {[
                          { label: "Transpiler Design", icon: Cpu },
                          { label: "Quantum Computing", icon: Zap },
                          { label: "AI & Machine Learning", icon: Brain },
                          { label: "Mathematical Problem Solving", icon: BookA },
                          { label: "Full Stack Development", icon: Rocket },
                          { label: "UI/UX Design", icon: Palette },
                        ].map((tag, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border border-border/80 bg-background/50 text-foreground/80 hover:border-blue-700/40 dark:hover:border-[#89D3BD]/40 transition-colors"
                          >
                            <tag.icon className="w-3 h-3 text-blue-700 dark:text-[#89D3BD]" />
                            {tag.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Buttons Below Either View */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-border/40 mt-6">
                <button
                  type="button"
                  onClick={() => previewThenDownload('/Babin_Bid_Resume.pdf', 'Babin_Bid_Resume.pdf')}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-700 text-white dark:bg-[#89D3BD] dark:text-slate-900 font-bold text-sm shadow-sm hover:opacity-90 active:scale-95 transition-all"
                >
                  <FileText className="w-4 h-4" />
                  Download Resume
                </button>
                <button
                  type="button"
                  onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-border/80 hover:border-blue-700 dark:hover:border-[#89D3BD] bg-background/60 text-foreground font-semibold text-sm hover:text-blue-700 dark:hover:text-[#89D3BD] active:scale-95 transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  Get In Touch
                </button>
              </div>
            </div>
          </motion.div>

          {/* Minimalist Editorial Quote Callout */}
          <motion.div
            variants={itemVariants}
            className="rounded-2xl border border-border/50 bg-background/40 backdrop-blur-sm p-4 sm:p-7 text-center max-w-2xl mx-auto relative overflow-hidden"
          >
            <Quote className="w-5 h-5 sm:w-7 sm:h-7 text-blue-700/20 dark:text-[#89D3BD]/20 mx-auto mb-2" />
            <p className="text-sm sm:text-base md:text-lg font-medium italic text-foreground/90 leading-relaxed px-1">
              "Connecting computer science concepts with hands-on coding to create software that makes a real difference."
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Image Modal Lightbox */}
      <AnimatePresence>
        {showImageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm ${
              isClosing ? "opacity-0" : ""
            }`}
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative max-w-[90vw] max-h-[90vh] p-4 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleCloseModal}
                className="absolute -top-2 -right-2 sm:top-2 sm:right-2 p-2 rounded-full bg-black/70 text-white hover:text-red-400 border border-white/20 transition-all"
                aria-label="Close image"
              >
                <X className="h-5 w-5" />
              </button>

              <img
                src="/Babin.webp"
                alt="Babin Bid"
                className="max-w-full max-h-[75vh] rounded-2xl shadow-2xl object-contain border-2 border-border/40"
              />

              <p className="mt-3 text-white text-base font-semibold">Babin Bid</p>
              <p className="text-white/60 text-xs">Click anywhere outside to close</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default About;
