import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import Radio from './pages/Radio';
import Home from './pages/Home';
import Sobre from './pages/Sobre';
import Discografia from './pages/Discografia';
import Jogos from './pages/Jogos';
import Diario from './pages/Diario';
import Admin from './pages/Admin';
import Quiz from './pages/Quiz';
import Bonus from './pages/Bonus';
import Faq from './pages/Faq';
import Navigation from './components/Navigation';
import CrtMode from './components/CrtMode';
import EasterEggTrigger from './components/EasterEggTrigger';
import { LanguageProvider } from './contexts/LanguageContext';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location}>
        <Route path="/" element={<Radio />} />
        <Route path="/home" element={<Home />} />
        <Route path="/inicio" element={<Home />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/discografia" element={<Discografia />} />
        <Route path="/jogos" element={<Jogos />} />
        <Route path="/diario" element={<Diario />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/bonus" element={<Bonus />} />
        <Route path="/faq" element={<Faq />} />
      </Routes>
    </AnimatePresence>
  );
}

function GlobalWordTrigger() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let keySeq = '';
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      const key = e.key.toLowerCase();
      if (key.length === 1) {
        keySeq = (keySeq + key).slice(-10);
        if (keySeq.includes('fases') || keySeq.includes('eros')) {
          navigate('/bonus');
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [location.pathname, navigate]);
  
  return null;
}

function Footer() {
  const navigate = useNavigate();
  let holdTimer: ReturnType<typeof setTimeout>;

  const handleTouchStart = () => {
    holdTimer = setTimeout(() => {
      navigate('/bonus');
    }, 2000); // 2 seconds hold to trigger Fases easter egg secretly
  };

  const handleTouchEnd = () => {
    clearTimeout(holdTimer);
  };

  return (
    <footer className="w-full border-t border-[#FFFFFF]/10 mt-20 py-8 px-6 font-mono text-[11px] tracking-[0.2em] uppercase text-[#E0E0E0]/60 max-w-7xl mx-auto flex-shrink-0">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
        <div className="flex items-center gap-3">
          <span 
            onClick={() => navigate('/quiz')} 
            className="cursor-pointer hover:text-[#00DF59] transition-colors"
            title="Quiz"
          >
            ©
          </span> 
          <span className="tabular-nums">2026</span>
          <span 
            onTouchStart={handleTouchStart} 
            onTouchEnd={handleTouchEnd}
            className="font-bold text-[#E0E0E0] hover:text-[#FFE600] transition-colors cursor-text"
          >
            LSU
          </span>
          <span aria-hidden="true" className="text-[#FFFFFF]/20">/</span>
          <span>DISCÍPULOS (DSCPLS)</span>
        </div>
        <div className="flex items-center gap-4 text-[10px] text-[#E0E0E0]/40">
          <span>ALL RIGHTS RESERVED</span>
          <span aria-hidden="true">·</span>
          <span>LIXO BRASILEIRO</span>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  const [crtActive, setCrtActive] = useState(false);

  return (
    <LanguageProvider>
      <BrowserRouter>
        <GlobalWordTrigger />
        {/* Background grain/noise globally */}
        <div className="fixed inset-0 pointer-events-none z-[900] mix-blend-screen bg-noise opacity-40"></div>
        
        {!crtActive && (
          <div className="main-layout flex flex-col min-h-screen bg-[#080706] text-[#E0E0E0] font-sans">
            <Navigation />
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 relative">
              <AnimatedRoutes />
            </main>
            <Footer />
          </div>
        )}

        <EasterEggTrigger onTrigger={() => setCrtActive(true)} active={crtActive} />
        {crtActive && <CrtMode onClose={() => setCrtActive(false)} />}
      </BrowserRouter>
    </LanguageProvider>
  );
}
