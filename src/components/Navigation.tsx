import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { Globe } from 'lucide-react';

export default function Navigation() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const { lang, setLang, t } = useLanguage();
  
  // If we're not on Home, nav is always open. If we are on Home, it starts closed.
  const [navRevealed, setNavRevealed] = useState(!isHome);

  // Sync state if user navigates back to Home or elsewhere
  useEffect(() => {
    if (!isHome) {
      setNavRevealed(true);
    }
  }, [isHome]);

  const handleLogoClick = (e: React.MouseEvent) => {
    // We let the Easter Egg trigger handle double/multiple clicks in the DOM via capturing, 
    // but for the nav reveal, 1 click is enough.
    if (isHome && !navRevealed) {
      e.preventDefault();
      setNavRevealed(true);
    }
  };

  const cycleLanguage = () => {
    if (lang === 'pt') setLang('en');
    else if (lang === 'en') setLang('es');
    else setLang('pt');
  };

  return (
    <motion.header
      layout
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className={`w-full flex md:items-center px-6 pt-10 pb-6 relative z-50 ${navRevealed ? 'justify-between max-w-7xl mx-auto flex-col md:flex-row items-center gap-6' : 'justify-center items-center min-h-[70vh]'}`}
    >
      <motion.div
        layout
        className="flex items-center"
      >
        <Link 
          to="/" 
          onClick={handleLogoClick}
          className="relative inline-block cursor-crosshair group"
        >
          <img 
            src="https://i.imgur.com/P2TTE1s.png" 
            alt="DSCPLS" 
            id="easter-logo" // Used by EasterEggTrigger
            className={`w-[200px] md:w-[280px] drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-transform duration-200 active:scale-95 group-hover:animate-[rainbow-glow_2s_linear_infinite] ${!navRevealed ? 'aberration' : ''}`}
          />
        </Link>
      </motion.div>

      <AnimatePresence>
        {navRevealed && (
          <motion.nav
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-col md:flex-row items-end md:items-center gap-4 md:gap-8 text-lg md:text-2xl tracking-tighter uppercase font-bold mt-4 md:mt-0"
          >
            <Link to="/sobre" className="hover:text-[#ff3e3e] transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[4px] after:bg-[#ff3e3e] hover:after:w-full after:transition-all after:duration-300">
              {t('nav.sobre')}
            </Link>
            <Link to="/discografia" className="hover:text-[#ff3e3e] transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[4px] after:bg-[#ff3e3e] hover:after:w-full after:transition-all after:duration-300">
              {t('nav.discografia')}
            </Link>
            <Link to="/jogos" className="hover:text-[#ff3e3e] transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[4px] after:bg-[#ff3e3e] hover:after:w-full after:transition-all after:duration-300">
              {t('nav.jogos')}
            </Link>
            <Link to="/diario" className="hover:text-[#ff3e3e] transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[4px] after:bg-[#ff3e3e] hover:after:w-full after:transition-all after:duration-300">
              {t('nav.diario')}
            </Link>
            
            <button 
              onClick={cycleLanguage}
              className="flex items-center gap-2 hover:text-[#ff3e3e] transition-colors ml-4"
              title="Change Language"
            >
              <Globe size={24} />
              <span className="text-sm font-mono uppercase font-bold">{lang}</span>
            </button>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
