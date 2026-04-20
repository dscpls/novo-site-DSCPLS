import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import Home from './pages/Home';
import Sobre from './pages/Sobre';
import Discografia from './pages/Discografia';
import Jogos from './pages/Jogos';
import Diario from './pages/Diario';
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
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  const [crtActive, setCrtActive] = useState(false);

  return (
    <BrowserRouter>
      {/* Background grain/noise globally */}
      <div className="fixed inset-0 pointer-events-none z-[900] mix-blend-screen bg-noise"></div>
      
      {!crtActive && (
        <div className="main-layout flex flex-col min-h-screen bg-gradient-radial from-[#1a1a1a] to-[#050505] text-[#e0e0e0] font-sans">
          <Navigation />
          <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-8 relative">
            <AnimatedRoutes />
          </main>
          <footer className="text-center opacity-40 text-[9px] tracking-[2px] mt-10 py-6 border-t border-white/10 max-w-7xl mx-auto w-full px-6">
            <div className="flex justify-between w-full">
              <span>© 2026 GROOVE</span>
              <span>ALL RIGHTS RESERVED</span>
            </div>
          </footer>
        </div>
      )}

      <EasterEggTrigger onTrigger={() => setCrtActive(true)} active={crtActive} />
      {crtActive && <CrtMode onClose={() => setCrtActive(false)} />}
    </BrowserRouter>
  );
}
