import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import Home from './pages/Home';
import Sobre from './pages/Sobre';
import Discografia from './pages/Discografia';
import Jogos from './pages/Jogos';
import Diario from './pages/Diario';
import Admin from './pages/Admin';
import Quiz from './pages/Quiz';
import Bonus from './pages/Bonus';
import Navigation from './components/Navigation';
import CrtMode from './components/CrtMode';
import EasterEggTrigger from './components/EasterEggTrigger';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/discografia" element={<Discografia />} />
        <Route path="/jogos" element={<Jogos />} />
        <Route path="/diario" element={<Diario />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/bonus" element={<Bonus />} />
      </Routes>
    </AnimatePresence>
  );
}

function GlobalWordTrigger() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname !== '/') return;

    let keySeq = '';
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      const key = e.key.toLowerCase();
      // Need only printable characters to make it easier to type "fases" or "eros"
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
    <footer className="text-center opacity-40 text-[9px] tracking-[2px] mt-10 py-6 border-t border-white/10 max-w-7xl mx-auto w-full px-6 flex-shrink-0">
      <div className="flex justify-between w-full">
        <span>
          <span onClick={() => navigate('/quiz')} className="cursor-pointer hover:text-white transition-colors">©</span> 
          <span> 2026 </span>
          <span 
            onTouchStart={handleTouchStart} 
            onTouchEnd={handleTouchEnd}
            className="cursor-text"
          >
            GROOVE
          </span>
        </span>
        <span>ALL RIGHTS RESERVED</span>
      </div>
    </footer>
  );
}

export default function App() {
  const [crtActive, setCrtActive] = useState(false);

  return (
    <BrowserRouter>
      <GlobalWordTrigger />
      {/* Background grain/noise globally */}
      <div className="fixed inset-0 pointer-events-none z-[900] mix-blend-screen bg-noise"></div>
      
      {!crtActive && (
        <div className="main-layout flex flex-col min-h-screen bg-gradient-radial from-[#1a1a1a] to-[#050505] text-[#e0e0e0] font-sans">
          <Navigation />
          <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-8 relative">
            <AnimatedRoutes />
          </main>
          <Footer />
        </div>
      )}

      <EasterEggTrigger onTrigger={() => setCrtActive(true)} active={crtActive} />
      {crtActive && <CrtMode onClose={() => setCrtActive(false)} />}
    </BrowserRouter>
  );
}
