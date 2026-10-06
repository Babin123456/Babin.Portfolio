import React, { useEffect, useRef } from 'react';

interface HamburgerMenuProps {
  isOpen: boolean;
  onClick: () => void;
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ isOpen, onClick }) => {
  const btnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (btnRef.current) {
      btnRef.current.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      btnRef.current.setAttribute('aria-controls', 'mobile-menu');
    }
  }, [isOpen]);

  return (
    <button
      ref={btnRef}
      onClick={onClick}
      className="md:hidden w-11 h-11 rounded-full border border-border/70 hover:border-primary/50 bg-background/60 hover:bg-background/90 flex items-center justify-center transition-all duration-300 shadow-sm backdrop-blur-md active:scale-95"
      aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
    >
      <div className="relative w-6 h-6">
        <span
          className={`absolute left-0 top-1/2 w-6 h-0.5 bg-primary origin-center transition-all duration-300 ease-in-out ${isOpen ? 'rotate-45' : '-translate-y-2'}`}
        />
        <span
          className={`absolute left-0 top-1/2 w-6 h-0.5 bg-primary origin-center transition-all duration-300 ease-in-out ${isOpen ? 'opacity-0' : '-translate-y-0.25'}`}
        />
        <span
          className={`absolute left-0 top-1/2 w-6 h-0.5 bg-primary origin-center transition-all duration-300 ease-in-out ${isOpen ? '-rotate-45' : 'translate-y-2'}`}
        />
      </div>
    </button>
  );
};

export default HamburgerMenu;