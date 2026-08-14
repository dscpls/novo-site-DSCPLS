import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { Globe, Radio as RadioIcon } from 'lucide-react';

export default function Navigation() {
  const location = useLocation();
  const isRadioLanding = location.pathname === '/';
  const { lang, setLang, t } = useLanguage();
  
  const [navRevealed, setNavRevealed] = useState(true);
  const [showLangs, setShowLangs] = useState(false);

  const handleLogoClick = (e: React.MouseEvent) => {
    // If on radio page, click on logo toggles or navigates to /home
  };

  return (
    <motion.header
      layout
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="w-full flex px-6 pt-8 pb-6 relative z-50 justify-between max-w-7xl mx-auto flex-col xl:flex-row items-center gap-6"
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
            className="w-[200px] md:w-[280px] drop-shadow-[0_0_15px_rgba(0,223,89,0.15)] transition-transform duration-200 active:scale-95 group-hover:animate-[rainbow-glow_2s_linear_infinite]"
          />
        </Link>
      </motion.div>

      <AnimatePresence>
        {navRevealed && (
          <motion.nav
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-col xl:flex-row items-center xl:items-center gap-4 xl:gap-6 text-base md:text-xl tracking-tighter uppercase font-bold mt-4 xl:mt-0"
          >
            <div className="flex flex-wrap justify-center items-center gap-3 md:gap-6">
              <Link 
                to="/" 
                className={`flex items-center gap-1.5 px-3 py-1 rounded transition-all relative ${
                  isRadioLanding 
                    ? 'bg-[#FFE600] text-black shadow-[0_0_12px_rgba(255,230,0,0.3)]' 
                    : 'text-[#00DF59] hover:text-[#FFE600] border border-[#00DF59]/30 hover:border-[#FFE600]'
                }`}
              >
                <RadioIcon size={16} className={isRadioLanding ? 'text-black' : 'text-[#00DF59]'} />
                <span>{t('nav.radio')}</span>
              </Link>
              <Link to="/home" className="hover:text-[#00DF59] transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[3px] after:bg-[#00DF59] hover:after:w-full after:transition-all after:duration-300">
                {t('nav.home')}
              </Link>
              <Link to="/sobre" className="hover:text-[#00DF59] transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[3px] after:bg-[#00DF59] hover:after:w-full after:transition-all after:duration-300">
                {t('nav.sobre')}
              </Link>
              <Link to="/discografia" className="hover:text-[#00DF59] transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[3px] after:bg-[#00DF59] hover:after:w-full after:transition-all after:duration-300">
                {t('nav.discografia')}
              </Link>
              <Link to="/jogos" className="hover:text-[#00DF59] transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[3px] after:bg-[#00DF59] hover:after:w-full after:transition-all after:duration-300">
                {t('nav.jogos')}
              </Link>
              <a href="https://dscpls.shop" target="_blank" rel="noopener noreferrer" className="hover:text-[#00DF59] transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[3px] after:bg-[#00DF59] hover:after:w-full after:transition-all after:duration-300">
                {t('nav.loja')}
              </a>
              <Link to="/diario" className="hover:text-[#00DF59] transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[3px] after:bg-[#00DF59] hover:after:w-full after:transition-all after:duration-300">
                {t('nav.diario')}
              </Link>
              <Link to="/faq" className="hover:text-[#00DF59] transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[3px] after:bg-[#00DF59] hover:after:w-full after:transition-all after:duration-300">
                {t('nav.faq')}
              </Link>
            </div>
            
            <div className="relative flex items-center mt-4 xl:mt-0 xl:ml-2">
              <button 
                onClick={() => setShowLangs(!showLangs)}
                className="flex items-center gap-2 hover:text-[#00DF59] text-gray-300 transition-colors p-2"
                title="Change Language"
              >
                <Globe size={22} />
              </button>
              <AnimatePresence>
                {showLangs && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                    className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-[#0c0907] border-2 border-[#FFE600]/40 flex flex-col gap-1 z-50 text-sm font-mono tracking-widest font-bold shadow-2xl p-2"
                  >
                    <button onClick={() => { setLang('pt'); setShowLangs(false); }} className={`transition-colors text-left whitespace-nowrap px-4 py-2 hover:bg-white/10 ${lang === 'pt' ? 'text-[#00DF59]' : 'text-gray-400 hover:text-white'}`}>PT-BR</button>
                    <button onClick={() => { setLang('en'); setShowLangs(false); }} className={`transition-colors text-left whitespace-nowrap px-4 py-2 hover:bg-white/10 ${lang === 'en' ? 'text-[#00DF59]' : 'text-gray-400 hover:text-white'}`}>EN</button>
                    <button onClick={() => { setLang('es'); setShowLangs(false); }} className={`transition-colors text-left whitespace-nowrap px-4 py-2 hover:bg-white/10 ${lang === 'es' ? 'text-[#00DF59]' : 'text-gray-400 hover:text-white'}`}>ES</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
