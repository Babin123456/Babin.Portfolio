import { useState, useEffect, useRef, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import HamburgerMenu from "./HamburgerMenu";
import { getElementTargetScroll, smoothScrollToTarget } from "@/lib/scrollUtils";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [lineStyle, setLineStyle] = useState({ width: 0, left: 0 });
  const navListRef = useRef<HTMLUListElement>(null);
  const navItemsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Continuous, robust scroll-spy for active section detection & navbar marking
  useEffect(() => {
    if (location.pathname !== "/") return;

    const sectionIds = ["home", "about", "skills", "projects", "research", "achievements-preview", "contact"];

    const updateActiveSection = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      // At top of page -> Home
      if (scrollY < 120) {
        setActiveSection("home");
        return;
      }

      // At bottom of page -> Contact
      if (scrollY + windowHeight >= docHeight - 80) {
        setActiveSection("contact");
        return;
      }

      // Probe point at 35% from top of viewport for natural reading position
      const probeY = scrollY + windowHeight * 0.35;
      let current = "home";

      for (const id of sectionIds) {
        const top = getElementTargetScroll(`#${id}`, 0);
        if (probeY >= top) {
          current = id;
        }
      }

      setActiveSection(current);
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, [location.pathname]);

  const navItems = useMemo<{
    name: string;
    href: string;
    type: "section" | "route";
  }[]>(() => [
    { name: "Home", href: "#home", type: "section" },
    { name: "About", href: "#about", type: "section" },
    { name: "Skills", href: "#skills", type: "section" },
    { name: "Projects", href: "#projects", type: "section" },
    { name: "Research", href: "#research", type: "section" },
    { name: "Achievements", href: "#achievements-preview", type: "section" },
    { name: "Contact", href: "#contact", type: "section" },
  ], []);

  const lineRef = useRef<HTMLDivElement | null>(null);

  // Update line position when active section changes or on mount
  useEffect(() => {
    // For section-based items, highlight based on scroll. For route items, highlight based on pathname.
    const activeIndex = navItems.findIndex(item => {
      if (item.type === "section") {
        return item.href === `#${activeSection}` && location.pathname === "/";
      }
      if (item.type === "route") {
        return item.href === location.pathname;
      }
      return false;
    });

    const activeLink = navItemsRef.current[activeIndex];

    if (activeLink && navListRef.current && window.innerWidth >= 768) {
      const listRect = navListRef.current.getBoundingClientRect();
      const linkRect = activeLink.getBoundingClientRect();

      setLineStyle({
        width: linkRect.width,
        left: linkRect.left - listRect.left,
      });
      if (lineRef.current) {
        lineRef.current.style.width = `${linkRect.width}px`;
        lineRef.current.style.left = `${linkRect.left - listRect.left}px`;
      }
    }
  }, [activeSection, navItems, location.pathname]);

  const HEADER_OFFSET = 80; // 80px gap prevents header from obscuring section headings

  const smoothScrollTo = (href: string) => {
    smoothScrollToTarget(href, { headerOffset: HEADER_OFFSET });
    setActiveSection(href === "/" || href === "#home" ? "home" : href.replace(/^#/, ""));
    window.history.pushState(null, "", href === "#home" ? "/" : href);
  };

  const scrollToSection = (href: string) => {
    setIsMobileMenuOpen(false);

    // If it's a section link
    if (href.startsWith("#")) {
      // If we're not on the home page, navigate to home with hash
      if (location.pathname !== "/") {
        navigate(`/${href === "#home" ? "" : href}`);
      } else {
        smoothScrollTo(href);
      }
    } else {
      // If it's a route link (like /achievements)
      navigate(href);
    }
  };

  const isHomePage = location.pathname === "/" || location.pathname === "/achievements";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${isScrolled
        ? "bg-background/85 dark:bg-[#070b14]/85 backdrop-blur-xl border-b border-slate-200/50 dark:border-white/10 shadow-sm"
        : "bg-background/20 dark:bg-[#070b14]/20 backdrop-blur-md"
        }`}
    >
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            if (location.pathname === "/") {
              scrollToSection("#home");
            } else {
              navigate("/");
              setTimeout(() => {
                setActiveSection("home");
                window.history.pushState(null, "", "/");
              }, 150);
            }
          }}
          className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-blue-700 dark:from-[#89D3BD] dark:to-cyan-400 text-transparent bg-clip-text"
        >
          Babin.Portfolio
        </a>

        <div className="hidden md:block relative">
          <ul ref={navListRef} className="flex items-center gap-8 relative">
            {navItems.map((item, index) => (
              <li key={item.name} className="relative">
                {item.type === "route" ? (
                  <Link
                    ref={(el) => (navItemsRef.current[index] = el)}
                    to={item.href}
                    className={`text-foreground/80 hover:text-primary transition-smooth font-medium ${location.pathname === item.href ? "text-primary" : ""}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ) : (
                  <a
                    ref={(el) => (navItemsRef.current[index] = el)}
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(item.href);
                    }}
                    className={`text-foreground/80 hover:text-primary transition-smooth font-medium ${activeSection === item.href.slice(1) && location.pathname === "/" ? "text-primary" : ""}`}
                  >
                    {item.name}
                  </a>
                )}
              </li>
            ))}
          </ul>

          {location.pathname === "/" && (
            <div
              ref={lineRef}
              className="hidden md:block absolute bottom-0 h-0.5 bg-blue-700 dark:bg-[#89D3BD] transition-all duration-300 ease-out rounded-full"
            />
          )}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          <HamburgerMenu
            isOpen={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </div>
      </nav>

      <div
        className={`${isMobileMenuOpen ? '' : 'hidden'} md:hidden bg-background/10 backdrop-blur-2xl border-t border-border animate-fade-in`}
        id="mobile-menu"
        role="navigation"
        aria-label="Mobile navigation"
      >
        <ul className="container mx-auto px-4 py-4 flex flex-col gap-1">
          {navItems.map((item) => (
            <li key={item.name}>
              {item.type === "route" ? (
                <Link
                  to={item.href}
                  className={`text-base px-4 py-3 min-h-[48px] rounded-lg transition-colors flex items-center font-medium ${location.pathname === item.href
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                    }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ) : (
                <a
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(item.href);
                  }}
                  className={`text-base px-4 py-3 min-h-[48px] rounded-lg transition-colors flex items-center font-medium ${activeSection === item.href.slice(1) && location.pathname === "/"
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                    }`}
                >
                  {item.name}
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
};

export default Header;
