import React, { useEffect, useRef, useState } from 'react';

export default function BrigasFuteisGame() {
  const [p1, setP1] = useState({ x: 20, hp: 100, punching: false, hit: false, facing: 1 }); // 1 = right, -1 = left
  const [p2, setP2] = useState({ x: 70, hp: 100, punching: false, hit: false, facing: -1 });
  const [winner, setWinner] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  
  const keys = useRef<{ [key: string]: boolean }>({});
  const p1Ref = useRef(p1);
  const p2Ref = useRef(p2);
  const winnerRef = useRef(winner);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || navigator.maxTouchPoints > 0);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Sound function using Web Audio API to avoid CORS or fetch issues (Instant retro SFX)
  const playSound = (type: 'punch' | 'hit' | 'win') => {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'punch') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.1);
    } else if (type === 'hit') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.5, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.2);
    } else if (type === 'win') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.setValueAtTime(600, ctx.currentTime + 0.1);
      osc.frequency.setValueAtTime(800, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.5, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.5);
    }
  };

  // Keep refs synced
  useEffect(() => { p1Ref.current = p1; }, [p1]);
  useEffect(() => { p2Ref.current = p2; }, [p2]);
  useEffect(() => { winnerRef.current = winner; }, [winner]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { keys.current[e.code] = true; };
    const handleKeyUp = (e: KeyboardEvent) => { keys.current[e.code] = false; };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    let animationId: number;
    let lastTime = performance.now();

    const loop = (time: number) => {
      animationId = requestAnimationFrame(loop);
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      if (winnerRef.current !== 0) return;

      const speed = 40 * dt;
      let newP1 = { ...p1Ref.current };
      let newP2 = { ...p2Ref.current };

      const distance = Math.abs(newP1.x - newP2.x);

      // P1 Movement
      if (!newP1.punching && !newP1.hit) {
        if (keys.current['KeyA']) { newP1.x = Math.max(0, newP1.x - speed); newP1.facing = -1; }
        if (keys.current['KeyD']) { newP1.x = Math.min(newP2.x - 5, newP1.x + speed); newP1.facing = 1; } // Don't cross P2
        if (keys.current['Space']) {
          newP1.punching = true;
          playSound('punch');
          // Check Hit
          if (distance < 15 && newP1.facing === 1) {
            newP2.hp = Math.max(0, newP2.hp - 10);
            newP2.hit = true;
            newP2.x = Math.min(90, newP2.x + 5); // Knockback
            playSound('hit');
            setTimeout(() => { if(p2Ref.current) setP2(p => ({ ...p, hit: false })); }, 300);
            if (newP2.hp <= 0) {
              setWinner(1);
              playSound('win');
            }
          }
          setTimeout(() => { if(p1Ref.current) setP1(p => ({ ...p, punching: false })); }, 250);
        }
      }

      // P2 Movement
      if (!newP2.punching && !newP2.hit) {
        if (keys.current['ArrowLeft']) { newP2.x = Math.max(newP1.x + 5, newP2.x - speed); newP2.facing = -1; }
        if (keys.current['ArrowRight']) { newP2.x = Math.min(90, newP2.x + speed); newP2.facing = 1; }
        if (keys.current['Enter'] || keys.current['NumpadEnter']) {
          newP2.punching = true;
          playSound('punch');
          // Check Hit
          if (distance < 15 && newP2.facing === -1) {
            newP1.hp = Math.max(0, newP1.hp - 10);
            newP1.hit = true;
            newP1.x = Math.max(0, newP1.x - 5); // Knockback
            playSound('hit');
            setTimeout(() => { if(p1Ref.current) setP1(p => ({ ...p, hit: false })); }, 300);
            if (newP1.hp <= 0) {
              setWinner(2);
              playSound('win');
            }
          }
          setTimeout(() => { if(p2Ref.current) setP2(p => ({ ...p, punching: false })); }, 250);
        }
      }

      setP1(newP1);
      setP2(newP2);
    };

    animationId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full flex justify-center items-center pointer-events-none">
      <div className="absolute top-[10%] w-[80%] flex justify-between z-50 text-white font-vt323 text-2xl">
        <div className="flex flex-col items-start gap-1 w-[40%]">
          <span>P1 HP [{p1.hp}] (A/D Move, Espaço Bate)</span>
          <div className="h-4 bg-red-900 w-full border border-white"><div className="h-full bg-[#ff3e3e]" style={{ width: `${p1.hp}%` }}></div></div>
        </div>
        <div className="flex flex-col items-end gap-1 w-[40%]">
          <span>P2 HP [{p2.hp}] (←/→ Move, Enter Bate)</span>
          <div className="h-4 bg-blue-900 w-full border border-white flex justify-end"><div className="h-full bg-[#00ffff]" style={{ width: `${p2.hp}%` }}></div></div>
        </div>
      </div>

      {winner !== 0 && (
        <div className="absolute inset-0 z-[60] flex flex-col justify-center items-center bg-black/80">
          <h1 className="text-[#ff3e3e] text-6xl font-vt323 tracking-widest animate-[jit2_0.1s_infinite]">PLAYER {winner} WINS</h1>
          <button 
            className="mt-8 pointer-events-auto border-2 border-white text-white px-6 py-2 text-2xl hover:bg-white hover:text-black font-vt323"
            onClick={() => { setP1({x: 20, hp: 100, punching: false, hit: false, facing: 1}); setP2({x: 70, hp: 100, punching: false, hit: false, facing: -1}); setWinner(0); }}
          >
            REMATCH
          </button>
        </div>
      )}

      {/* Mobile Touch Controls */}
      {isMobile && winner === 0 && (
        <div className="absolute inset-0 pointer-events-none z-[80] flex justify-between items-end pb-[10vh] px-[5vw]">
          {/* P1 Controls */}
          <div className="flex gap-2">
            <div className="flex bg-white/10 rounded-full border-2 border-white/30 backdrop-blur-sm pointer-events-auto overflow-hidden">
              <button 
                className="w-14 h-14 md:w-16 md:h-16 bg-transparent text-white font-bold text-2xl active:bg-white/30 touch-none"
                onTouchStart={(e) => { e.preventDefault(); keys.current['KeyA'] = true; }}
                onTouchEnd={(e) => { e.preventDefault(); keys.current['KeyA'] = false; }}
              >◄</button>
              <div className="w-[2px] bg-white/30"></div>
              <button 
                className="w-14 h-14 md:w-16 md:h-16 bg-transparent text-white font-bold text-2xl active:bg-white/30 touch-none"
                onTouchStart={(e) => { e.preventDefault(); keys.current['KeyD'] = true; }}
                onTouchEnd={(e) => { e.preventDefault(); keys.current['KeyD'] = false; }}
              >►</button>
            </div>
            <button 
              className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#ff3e3e]/40 border-2 border-[#ff3e3e] text-white font-bold pointer-events-auto active:bg-[#ff3e3e]/80 backdrop-blur-sm touch-none"
              onTouchStart={(e) => { e.preventDefault(); keys.current['Space'] = true; }}
              onTouchEnd={(e) => { e.preventDefault(); keys.current['Space'] = false; }}
            >👊</button>
          </div>

          {/* P2 Controls */}
          <div className="flex gap-2">
            <button 
              className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#00ffff]/40 border-2 border-[#00ffff] text-white font-bold pointer-events-auto active:bg-[#00ffff]/80 backdrop-blur-sm touch-none"
              onTouchStart={(e) => { e.preventDefault(); keys.current['Enter'] = true; }}
              onTouchEnd={(e) => { e.preventDefault(); keys.current['Enter'] = false; }}
            >👊</button>
            <div className="flex bg-white/10 rounded-full border-2 border-white/30 backdrop-blur-sm pointer-events-auto overflow-hidden">
              <button 
                className="w-14 h-14 md:w-16 md:h-16 bg-transparent text-white font-bold text-2xl active:bg-white/30 touch-none"
                onTouchStart={(e) => { e.preventDefault(); keys.current['ArrowLeft'] = true; }}
                onTouchEnd={(e) => { e.preventDefault(); keys.current['ArrowLeft'] = false; }}
              >◄</button>
              <div className="w-[2px] bg-white/30"></div>
              <button 
                className="w-14 h-14 md:w-16 md:h-16 bg-transparent text-white font-bold text-2xl active:bg-white/30 touch-none"
                onTouchStart={(e) => { e.preventDefault(); keys.current['ArrowRight'] = true; }}
                onTouchEnd={(e) => { e.preventDefault(); keys.current['ArrowRight'] = false; }}
              >►</button>
            </div>
          </div>
        </div>
      )}

      {/* P1 Character */}
      <div 
        className={`w-[12vh] h-[35vh] absolute bottom-[20%] clip-polygon-[20%_0,80%_0,100%_100%,0_100%] bg-[#ff3e3e] transition-transform duration-75`}
        style={{ 
          left: `${p1.x}%`, 
          transform: `scaleX(${p1.facing}) ${p1.punching ? 'rotate(30deg) scale(1.1)' : ''} ${p1.hit ? 'rotate(-15deg) opacity-[0.5]' : ''}` 
        }}
      ></div>

      {/* P2 Character */}
      <div 
        className={`w-[12vh] h-[35vh] absolute bottom-[20%] clip-polygon-[20%_0,80%_0,100%_100%,0_100%] bg-[#00ffff] transition-transform duration-75`}
        style={{ 
          left: `${p2.x}%`, 
          transform: `scaleX(${-p2.facing}) ${p2.punching ? 'rotate(-30deg) scale(1.1)' : ''} ${p2.hit ? 'rotate(15deg) opacity-[0.5]' : ''}` 
        }}
      ></div>

      <h2 className="absolute top-[30%] text-[5rem] text-white drop-shadow-[5px_5px_0_#000] font-vt323 z-40 opacity-70">BRIGAS FÚTEIS</h2>
    </div>
  );
}
