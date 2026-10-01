import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { Radio as RadioIcon, ArrowRight, Menu, X, Globe } from 'lucide-react';

export default function Navigation() {
  const location = useLocation();
  const isRadioLanding = location.pathname === '/';
  const { lang, setLang, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLangs, setShowLangs] = useState(false);

  const isActive = (path: string) => {
    if (path === '/home' && (location.pathname === '/home' || location.pathname === '/inicio')) return true;
    return location.pathname === path;
  };

  const navLinks = [
    { to: '/home', label: t('nav.home') },
    { to: '/', label: t('nav.radio'), isRadio: true },
    { to: '/sobre', label: t('nav.sobre') },
    { to: '/discografia', label: t('nav.discografia') },
    { to: '/jogos', label: t('nav.jogos') },
    { href: 'https://dscpls.shop', label: t('nav.loja'), external: true },
    { to: '/diario', label: t('nav.diario') },
    { to: '/faq', label: t('nav.faq') },
  ];

  return (
    <header className="w-full border-b border-[#FFFFFF]/10 bg-[#080706]/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-3.5 flex items-center justify-between gap-4">
        
        {/* Brand / Logo Zone */}
        <div className="flex items-center gap-4 shrink-0">
          <Link
            to={isRadioLanding ? "/home" : "/"}
            className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00DF59]"
            title={isRadioLanding ? t('radio.back_to_site') : "DSCPLS"}
          >
            <img 
              src="https://i.imgur.com/P2TTE1s.png" 
              alt="DSCPLS" 
              id="easter-logo"
              className="h-7 sm:h-8 w-auto object-contain transition-transform duration-200 group-hover:scale-105 active:scale-95"
            />
          </Link>

          {/* Quick context badge for Radio mode */}
          {isRadioLanding && (
            <span className="hidden sm:inline-flex items-center gap-1.5 font-mono text-[10px] tracking-widest text-[#00DF59] uppercase border border-[#00DF59]/30 px-2 py-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00DF59] animate-pulse"></span>
              94.7 FM
            </span>
          )}
        </div>

        {/* Radio Mode: Direct access to main site right in the first frame */}
        {isRadioLanding ? (
          <div className="flex items-center gap-3">
            <Link
              to="/home"
              className="inline-flex items-center gap-2 bg-[#FFE600] text-black font-bold px-3.5 py-1.5 text-xs font-mono uppercase tracking-wider hover:bg-[#00DF59] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <span>{t('radio.back_to_site')}</span>
              <ArrowRight size={14} />
            </Link>

            {/* Language toggle for Radio view */}
            <div className="relative">
              <button
                onClick={() => setShowLangs(!showLangs)}
                className="flex items-center gap-1.5 font-mono text-xs uppercase px-2 py-1.5 border border-[#FFFFFF]/15 hover:border-[#FFE600] text-[#E0E0E0] hover:text-[#FFE600] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFE600]"
                aria-label={`Idioma atual: ${lang.toUpperCase()}`}
              >
                <Globe size={13} className="text-[#00DF59]" />
                <span className="font-bold">[{lang.toUpperCase()}]</span>
              </button>
              <AnimatePresence>
                {showLangs && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    className="absolute right-0 top-full mt-2 bg-[#111111] border border-[#FFFFFF]/20 flex flex-col p-1 z-50 min-w-[100px] shadow-2xl font-mono text-xs"
                  >
                    {(['pt', 'en', 'es'] as const).map((l) => (
                      <button
                        key={l}
                        onClick={() => { setLang(l); setShowLangs(false); }}
                        className={`text-left px-3 py-1.5 uppercase transition-colors hover:bg-white/10 ${
                          lang === l ? 'text-[#00DF59] font-bold' : 'text-[#E0E0E0]'
                        }`}
                      >
                        {l === 'pt' ? 'Português' : l === 'en' ? 'English' : 'Español'}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        ) : (
          /* Normal Site Desktop Navigation */
          <>
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2 font-mono text-xs uppercase tracking-wider">
              {navLinks.map((item) => {
                if (item.external) {
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1.5 text-[#E0E0E0]/80 hover:text-white hover:bg-white/5 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#00DF59]"
                    >
                      {item.label} ↗
                    </a>
                  );
                }

                const active = isActive(item.to!);
                if (item.isRadio) {
                  return (
                    <Link
                      key={item.to}
                      to={item.to!}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#00DF59] ${
                        active
                          ? 'text-[#00DF59] bg-[#00DF59]/10 font-bold border border-[#00DF59]/40'
                          : 'text-[#00DF59] hover:bg-[#00DF59]/10'
                      }`}
                    >
                      <RadioIcon size={13} />
                      <span>{item.label}</span>
                    </Link>
                  );
                }

                return (
                  <Link
                    key={item.to}
                    to={item.to!}
                    className={`px-2.5 py-1.5 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#00DF59] relative ${
                      active
                        ? 'text-white font-bold after:content-[""] after:absolute after:bottom-0 after:left-2.5 after:right-2.5 after:h-[2px] after:bg-[#00DF59]'
                        : 'text-[#E0E0E0]/80 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right Controls: Language Selector & Mobile Menu Button */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  onClick={() => setShowLangs(!showLangs)}
                  className="flex items-center gap-1.5 font-mono text-xs uppercase px-2.5 py-1 border border-[#FFFFFF]/15 hover:border-[#FFE600] text-[#E0E0E0] hover:text-[#FFE600] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFE600]"
                  aria-label={`Idioma atual: ${lang.toUpperCase()}`}
                  title="Alterar idioma / Switch language"
                >
                  <Globe size={13} className="text-[#00DF59]" />
                  <span className="font-bold">[{lang.toUpperCase()}]</span>
                </button>
                <AnimatePresence>
                  {showLangs && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      className="absolute right-0 top-full mt-2 bg-[#111111] border border-[#FFFFFF]/20 flex flex-col p-1 z-50 min-w-[110px] shadow-2xl font-mono text-xs"
                    >
                      {(['pt', 'en', 'es'] as const).map((l) => (
                        <button
                          key={l}
                          onClick={() => { setLang(l); setShowLangs(false); }}
                          className={`text-left px-3 py-1.5 uppercase transition-colors hover:bg-white/10 ${
                            lang === l ? 'text-[#00DF59] font-bold' : 'text-[#E0E0E0]'
                          }`}
                        >
                          {l === 'pt' ? 'PT-BR' : l === 'en' ? 'EN' : 'ES'}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Menu Trigger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-[#E0E0E0] hover:text-white border border-[#FFFFFF]/15 hover:border-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00DF59]"
                aria-label="Menu"
              >
                {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {!isRadioLanding && mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-[#FFFFFF]/10 bg-[#080706] px-4 py-4 overflow-hidden"
          >
            <div className="flex flex-col gap-2 font-mono text-sm uppercase">
              {navLinks.map((item) => {
                if (item.external) {
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-3 py-2 text-[#E0E0E0] hover:text-[#00DF59] hover:bg-white/5 transition-colors border-l-2 border-transparent hover:border-[#00DF59]"
                    >
                      {item.label} ↗
                    </a>
                  );
                }

                const active = isActive(item.to!);
                return (
                  <Link
                    key={item.to}
                    to={item.to!}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2 transition-colors border-l-2 ${
                      active
                        ? 'border-[#00DF59] text-[#00DF59] bg-[#00DF59]/5 font-bold'
                        : 'border-transparent text-[#E0E0E0] hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
