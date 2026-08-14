import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import PongGame from '../components/PongGame';
import { useLanguage } from '../contexts/LanguageContext';

export default function Jogos() {
  const { t } = useLanguage();
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [target, setTarget] = useState({ x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement>(null);

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    moveTarget();
  };

  const moveTarget = () => {
    setTarget({
      x: Math.floor(Math.random() * 80) + 10,
      y: Math.floor(Math.random() * 80) + 10
    });
  };

  const playShootSound = () => {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.1);
  };

  const hitTarget = () => {
    if (!isPlaying) return;
    playShootSound();
    setScore(s => s + 1);
    moveTarget();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6 }}
      className="max-w-4xl mx-auto pt-10 pb-40"
    >
      <div className="flex items-center gap-4 mb-12">
        <h1 className="text-3xl tracking-[0.2em] font-light text-white uppercase">{t('nav.jogos')}</h1>
        <div className="h-[2px] flex-1 bg-white/20"></div>
      </div>

      <div className="bg-[#111] border border-[#222] rounded-lg p-6 flex flex-col items-center">
        <h2 className="text-xl text-gray-300 font-medium tracking-widest mb-4 uppercase">{t('jogos.aim.title')}</h2>
        <p className="text-sm text-gray-500 mb-8 max-w-md text-center">
          {t('jogos.aim.desc')}
        </p>

        <div className="flex justify-between w-full max-w-2xl mb-4 text-white font-mono">
          <span className="uppercase text-[#FFE600]">{t('jogos.aim.pts')}: {score}</span>
          {!isPlaying && <button onClick={startGame} className="text-[#00DF59] hover:underline uppercase font-bold">{t('jogos.aim.start')}</button>}
          {isPlaying && <button onClick={() => setIsPlaying(false)} className="text-gray-500 hover:text-white uppercase">{t('jogos.aim.stop')}</button>}
        </div>

        <div 
          ref={containerRef}
          className="w-full max-w-2xl aspect-[16/9] bg-[#050505] border border-[#333] relative overflow-hidden cursor-crosshair rounded-md"
        >
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10 backdrop-blur-sm">
              <span className="text-gray-400 tracking-widest text-sm uppercase">{t('jogos.aim.msg')}</span>
            </div>
          )}

          {isPlaying && (
            <div 
              onClick={hitTarget}
              className="absolute w-12 h-12 rounded-full border border-[#00DF59] flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 cursor-crosshair group hover:bg-[#00DF59]/20 transition-colors duration-75"
              style={{ left: `${target.x}%`, top: `${target.y}%` }}
            >
              <div className="w-4 h-4 bg-[#00DF59] rounded-full group-active:scale-50 transition-transform"></div>
            </div>
          )}
        </div>
      </div>

      <PongGame />
    </motion.div>
  );
}
