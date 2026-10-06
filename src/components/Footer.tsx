import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  MapPin,
  Mail,
  Code2,
  Star,
} from "lucide-react";
import SocialIcons from "./SocialIcons";
import { smoothScrollToTarget } from "@/lib/scrollUtils";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSectionClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();

    const doScroll = (targetHref: string) => {
      smoothScrollToTarget(targetHref, { headerOffset: 80 });
      window.history.pushState(null, "", targetHref === "#home" ? "/" : targetHref);
    };

    if (href === "/") {
      if (location.pathname === "/") {
        doScroll("/");
      } else {
        navigate("/");
        setTimeout(() => doScroll("/"), 150);
      }
    } else if (href.startsWith("#")) {
      if (location.pathname !== "/") {
        navigate("/");
        setTimeout(() => doScroll(href), 150);
      } else {
        doScroll(href);
      }
    } else {
      navigate(href);
    }
  };

  return (
    <footer className="relative z-20 w-full py-6 sm:py-10 lg:py-12 px-2.5 sm:px-4 lg:px-6 xl:px-8">
      <div className="max-w-[94rem] mx-auto rounded-[1.75rem] sm:rounded-[2.5rem] lg:rounded-[3rem] p-5 sm:p-8 lg:p-12 transition-all duration-500 border relative overflow-hidden font-sans bg-[#080B10] text-white [background-image:radial-gradient(circle_at_50%_-20%,rgba(59,130,246,0.16),transparent_65%),radial-gradient(rgba(255,255,255,0.12)_1.25px,transparent_1.25px)] [background-size:100%_100%,22px_22px] border-white/15 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] dark:bg-[#F4EFEA] dark:text-[#111318] dark:[background-image:radial-gradient(circle_at_50%_-20%,rgba(137,211,189,0.32),transparent_65%),radial-gradient(rgba(0,0,0,0.08)_1.25px,transparent_1.25px)] dark:border-stone-300/80 dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15)] before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-blue-500/50 dark:before:via-blue-600/40 before:to-transparent">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-5 sm:pb-7">
          
          <div className="lg:col-span-4 space-y-3 sm:space-y-4 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white text-blue-700 shadow-[0_0_15px_rgba(255,255,255,0.4)] dark:bg-[#111318] dark:text-[#89D3BD] dark:shadow-md border border-white/20 dark:border-black/20 flex items-center justify-center font-black text-lg shrink-0 transition-colors">
                <Code2 className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
              </div>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white dark:text-[#111318] uppercase">
                BABIN BID
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2 sm:gap-2.5 text-xs sm:text-sm text-slate-300 dark:text-stone-600 pt-1 leading-relaxed">
              <MapPin className="w-4 h-4 text-blue-700 dark:text-[#89D3BD] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white dark:text-[#111318]">
                  Adamas University, Kolkata
                </p>
                <p className="text-slate-300 dark:text-stone-600 font-medium">B.Tech in Computer Science & Engineering (Core)</p>
                <p className="text-slate-400 dark:text-stone-500">Kolkata, West Bengal, India</p>
              </div>
            </div>

            <div className="pt-1 sm:pt-2 flex justify-center sm:justify-start">
              <a
                href="mailto:babinbid05@gmail.com"
                className="inline-flex items-center gap-2 text-xs sm:text-sm text-slate-300 hover:text-white dark:text-stone-700 dark:hover:text-black transition-colors"
              >
                <Mail className="w-4 h-4 text-blue-700 dark:text-[#89D3BD] shrink-0" />
                <span className="break-all">babinbid05@gmail.com</span>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:col-span-5">
            <div className="space-y-2.5 sm:space-y-3 text-center sm:text-left">
              <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white dark:text-[#111318]">
                Navigation
              </h4>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm flex flex-col items-center sm:items-start">
                {[
                  { name: "Home", href: "#home" },
                  { name: "About Me", href: "#about" },
                  { name: "Skills", href: "#skills" },
                  { name: "Projects", href: "#projects" },
                  { name: "Research", href: "#research" },
                  { name: "Achievements", href: "#achievements-preview" },
                  { name: "Contact", href: "#contact" },
                ].map((item) => (
                  <li key={item.name} className="w-full sm:w-auto">
                    <a
                      href={item.href}
                      onClick={(e) => handleSectionClick(e, item.href)}
                      className="text-slate-300 hover:text-white dark:text-stone-600 dark:hover:text-black transition-all hover:translate-x-1 inline-block py-0.5"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2.5 sm:space-y-3 text-center sm:text-left">
              <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white dark:text-[#111318]">
                Projects
              </h4>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm flex flex-col items-center sm:items-start">
                {[
                  { name: "CargoConnect", desc: "Logistics Booking", href: "https://github.com/Babin123456/CargoConnect" },
                  { name: "CivicSignal AI", desc: "Triage Engine", href: "https://github.com/Babin123456/CivicSignal" },
                  { name: "EduPilot AI", desc: "Academic RAG", href: "https://github.com/Babin123456/EduPilot-AI" },
                  { name: "KrishiBhoomi AI", desc: "AgriTech", href: "https://github.com/Babin123456/KrishiBhoomi-AI" },
                  { name: "StudyBuddy AI", desc: "Offline Ollama", href: "https://github.com/Babin123456/StudyBuddy_AI" },
                  { name: "AI Data Analysis", desc: "Text-to-SQL", href: "https://github.com/Babin123456/Ai-Data-Analysis" },
                  { name: "ML Price Prediction", desc: "Springer SIST", href: "https://github.com/Babin123456/ML-Based-Price-Prediction" },
                ].map((proj) => (
                  <li key={proj.name} className="w-full sm:w-auto">
                    <a
                      href={proj.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-300 hover:text-white dark:text-stone-600 dark:hover:text-black transition-all hover:translate-x-1 inline-flex items-center justify-center sm:justify-start gap-1 py-0.5"
                    >
                      <span>{proj.name}</span>
                      <span className="hidden sm:inline text-[10px] text-slate-400 dark:text-stone-500 font-mono">
                        ({proj.desc})
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-3 flex flex-col justify-start space-y-4 sm:space-y-5 text-center items-center">
            <div className="space-y-2 text-center w-full flex flex-col items-center">
              <div>
                <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white dark:text-[#111318] text-center">
                  Let&apos;s Connect
                </h4>
              </div>

              <div className="pt-3 sm:pt-4 pb-1.5 flex justify-center w-full">
                <SocialIcons />
              </div>
            </div>

            <div className="pt-1 text-center w-full flex flex-col items-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-stone-500 mb-1.5 text-center">
                Curriculum Vitae
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <a
                  href="/Babin_Resume_LATEX.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs px-4 py-1.5 rounded-full border border-white/20 dark:border-black/20 bg-white/10 hover:bg-white/20 dark:bg-black/5 dark:hover:bg-black/10 text-white dark:text-[#111318] font-medium transition-all shadow-sm flex items-center gap-1.5"
                >
                  LaTeX Resume
                </a>
                <a
                  href="/Babin_Bid_Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs px-4 py-1.5 rounded-full border border-white/20 dark:border-black/20 bg-white/10 hover:bg-white/20 dark:bg-black/5 dark:hover:bg-black/10 text-white dark:text-[#111318] font-medium transition-all shadow-sm flex items-center gap-1.5"
                >
                  Canva Resume
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 sm:pt-5 text-center space-y-2 sm:space-y-2.5 max-w-4xl mx-auto flex flex-col items-center justify-center">
          <p className="text-xs sm:text-sm md:text-base font-serif italic text-slate-200 dark:text-stone-800 leading-relaxed px-4 flex items-center justify-center gap-1.5 sm:gap-2 text-center">
            <Star className="h-3.5 w-3.5 text-blue-700 dark:text-[#89D3BD] fill-blue-700 dark:fill-[#89D3BD] shrink-0 hidden sm:inline-block" />
            <span>
              &ldquo;I don&apos;t just write code, I build logic, solve problems, and shape the future — <b className="not-italic font-bold text-white dark:text-[#111318]">one line at a time.</b>&rdquo;
            </span>
            <Star className="h-3.5 w-3.5 text-blue-700 dark:text-[#89D3BD] fill-blue-700 dark:fill-[#89D3BD] shrink-0 hidden sm:inline-block" />
          </p>

          <p className="text-xs sm:text-sm text-slate-400 dark:text-stone-600 font-medium text-center">
            Copyright © {currentYear}. Babin Bid. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
