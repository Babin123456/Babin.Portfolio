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
      className="md:hidden w-10 h-10 flex items-center justify-center transition-all duration-300 active:scale-95 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none select-none [-webkit-tap-highlight-color:transparent]"
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