import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import PongGame from '../components/PongGame';
import BrigasFuteisGame from '../components/BrigasFuteisGame';
import { useLanguage } from '../contexts/LanguageContext';
import { Gamepad2, Target, Swords } from 'lucide-react';

export default function Jogos() {
  const { t } = useLanguage();
  const [activeGame, setActiveGame] = useState<'pong' | 'aim' | 'fight'>('pong');
  
  // Aim game state
  const [score, setScore] = useState(0);
  const [isPlayingAim, setIsPlayingAim] = useState(false);
  const [target, setTarget] = useState({ x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement>(null);

  const startAimGame = () => {
    setIsPlayingAim(true);
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
    if (!isPlayingAim) return;
    playShootSound();
    setScore(s => s + 1);
    moveTarget();
  };

  return (
    <div className="w-full max-w-5xl mx-auto pb-24 space-y-10">
      
      {/* Page Header */}
      <div className="border-b-2 border-[#FFFFFF]/15 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <div className="font-mono text-xs text-[#00DF59] uppercase tracking-[0.25em] mb-2 flex items-center gap-2">
              <Gamepad2 size={15} />
              <span>ARCADE DE INTERLÚDIO // MINI-JOGOS DSCPLS</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white">
              {t('nav.jogos')}
            </h1>
          </div>

          {/* Game Selection Tabs */}
          <div className="flex items-center gap-1 p-1 bg-[#111111] border border-[#FFFFFF]/15 font-mono text-xs uppercase self-start sm:self-auto">
            <button
              onClick={() => setActiveGame('pong')}
              className={`px-3 py-2 transition-colors flex items-center gap-1.5 ${
                activeGame === 'pong'
                  ? 'bg-white text-black font-bold'
                  : 'text-[#E0E0E0]/70 hover:text-white'
              }`}
            >
              <span>01. PONG</span>
            </button>
            <button
              onClick={() => setActiveGame('aim')}
              className={`px-3 py-2 transition-colors flex items-center gap-1.5 ${
                activeGame === 'aim'
                  ? 'bg-[#00DF59] text-black font-bold'
                  : 'text-[#E0E0E0]/70 hover:text-white'
              }`}
            >
              <Target size={13} />
              <span>02. MIRA</span>
            </button>
            <button
              onClick={() => setActiveGame('fight')}
              className={`px-3 py-2 transition-colors flex items-center gap-1.5 ${
                activeGame === 'fight'
                  ? 'bg-[#FFE600] text-black font-bold'
                  : 'text-[#E0E0E0]/70 hover:text-white'
              }`}
            >
              <Swords size={13} />
              <span>03. BRIGAS FÚTEIS</span>
            </button>
          </div>
        </div>
      </div>

      {/* Active Game Stage */}
      <div className="border-2 border-[#FFFFFF]/20 bg-[#111111] p-6 sm:p-8">
        
        {/* GAME 1: PONG */}
        {activeGame === 'pong' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#FFFFFF]/10 pb-4">
              <div>
                <h2 className="text-2xl font-black uppercase text-white tracking-tight">
                  DSCPLS PONG // RETRO 1972
                </h2>
                <p className="font-mono text-xs text-[#E0E0E0]/60 mt-1">
                  CONTROLES: JOGADOR 1 (W / S) · JOGADOR 2 (SETA CIMA / SETA BAIXO)
                </p>
              </div>
              <div className="font-mono text-xs text-[#00DF59] uppercase tracking-wider">
                HI-FI ARCADE
              </div>
            </div>

            <PongGame />
          </div>
        )}

        {/* GAME 2: AIM TRAINER */}
        {activeGame === 'aim' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#FFFFFF]/10 pb-4">
              <div>
                <h2 className="text-2xl font-black uppercase text-white tracking-tight">
                  {t('jogos.aim.title')}
                </h2>
                <p className="font-mono text-xs text-[#E0E0E0]/60 mt-1">
                  {t('jogos.aim.desc')}
                </p>
              </div>

              <div className="flex items-center gap-4 font-mono text-xs">
                <span className="text-[#FFE600] uppercase font-bold text-sm tabular-nums">
                  {t('jogos.aim.pts')}: {score}
                </span>
                {!isPlayingAim ? (
                  <button 
                    onClick={startAimGame} 
                    className="bg-[#00DF59] text-black px-4 py-2 uppercase font-bold tracking-wider hover:bg-[#FFE600] transition-colors"
                  >
                    {t('jogos.aim.start')}
                  </button>
                ) : (
                  <button 
                    onClick={() => setIsPlayingAim(false)} 
                    className="border border-white/20 text-[#E0E0E0] hover:text-white px-4 py-2 uppercase tracking-wider transition-colors"
                  >
                    {t('jogos.aim.stop')}
                  </button>
                )}
              </div>
            </div>

            <div 
              ref={containerRef}
              className="w-full aspect-[16/9] max-h-[500px] bg-[#050505] border-2 border-[#FFFFFF]/15 relative overflow-hidden cursor-crosshair"
            >
              {!isPlayingAim && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/75 z-10 backdrop-blur-sm gap-3">
                  <Target size={36} className="text-[#00DF59]" />
                  <span className="font-mono text-xs sm:text-sm text-white uppercase tracking-widest">
                    {t('jogos.aim.msg')}
                  </span>
                  <button
                    onClick={startAimGame}
                    className="mt-2 bg-[#00DF59] text-black font-mono font-bold text-xs uppercase px-6 py-2.5 tracking-wider hover:bg-white transition-colors"
                  >
                    {t('jogos.aim.start')}
                  </button>
                </div>
              )}

              {isPlayingAim && (
                <div 
                  onClick={hitTarget}
                  className="absolute w-12 h-12 rounded-full border-2 border-[#00DF59] flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 cursor-crosshair group hover:bg-[#00DF59]/20 transition-colors"
                  style={{ left: `${target.x}%`, top: `${target.y}%` }}
                >
                  <div className="w-4 h-4 bg-[#00DF59] rounded-full group-active:scale-50 transition-transform"></div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* GAME 3: BRIGAS FÚTEIS */}
        {activeGame === 'fight' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#FFFFFF]/10 pb-4">
              <div>
                <h2 className="text-2xl font-black uppercase text-white tracking-tight">
                  BRIGAS FÚTEIS // FIGHTER
                </h2>
                <p className="font-mono text-xs text-[#E0E0E0]/60 mt-1">
                  P1 HENRIZ (A/D ANDA, ESPAÇO SOCO) · P2 GEBRIEL (←/→ ANDA, ENTER SOCO)
                </p>
              </div>
              <div className="font-mono text-xs text-[#FFE600] uppercase tracking-wider">
                DUELO 8-BIT
              </div>
            </div>

            <div className="w-full aspect-[16/9] max-h-[500px] bg-[#050505] border-2 border-[#FFFFFF]/15 relative overflow-hidden">
              <BrigasFuteisGame />
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
