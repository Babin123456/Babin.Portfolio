import { ThemeProvider } from "next-themes";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ParticlesBackground from "@/components/ParticlesBackground";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import InteractiveStats from "@/components/InteractiveStats";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Research from "@/components/Research";
import Contact from "@/components/Contact";
import Skills from "@/components/Skills";
import AchievementsPreview from "@/components/AchievementsPreview";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import SkipToContent from "@/components/SkipToContent";

import ScrollStackSection from "@/components/ScrollStackSection";
import { smoothScrollToTarget } from "@/lib/scrollUtils";

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        smoothScrollToTarget(location.hash, { headerOffset: 80 });
      }, 150);
    }
  }, [location.hash]);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <div className="relative min-h-screen">
        <SkipToContent />
        <ParticlesBackground />
        <Header />
        <main id="main-content" className="relative overflow-x-clip">
          <ScrollStackSection zIndex={1} isFirst>
            <Hero />
          </ScrollStackSection>

          <ScrollStackSection zIndex={2}>
            <InteractiveStats />
            <About />
          </ScrollStackSection>

          <ScrollStackSection zIndex={3}>
            <Skills />
          </ScrollStackSection>

          <ScrollStackSection zIndex={4}>
            <Projects />
          </ScrollStackSection>

          <ScrollStackSection zIndex={5}>
            <Research />
          </ScrollStackSection>

          <ScrollStackSection zIndex={6}>
            <AchievementsPreview />
          </ScrollStackSection>

          <ScrollStackSection zIndex={7} isLast>
            <Contact />
          </ScrollStackSection>
        </main>
        <Footer />
        <BackToTop />
      </div>
    </ThemeProvider>
  );
};

export default Index;