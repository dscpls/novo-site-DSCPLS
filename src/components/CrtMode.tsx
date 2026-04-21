import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import BrigasFuteisGame from './BrigasFuteisGame';

// Shared Audio resources
let ax: AudioContext | null = null;
let _actx: AudioContext | null = null;
let vAudio: HTMLAudioElement | null = null;

export default function CrtMode({ onClose }: { onClose: () => void }) {
  const [channel, setChannel] = useState(1);
  const [glitching, setGlitching] = useState(true);
  
  // States specific to channel 3
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioTime, setAudioTime] = useState("00:00 / 00:00");
  const [activeLi, setActiveLi] = useState(-1);
  const curBlobRef = useRef<string | null>(null);

  // States specific to channel 4
  const [c4Text, setC4Text] = useState('TUDO NORMAL AQUI.');
  const [c4Class, setC4Class] = useState('');

  // States specific to channel 5
  const [c5Time, setC5Time] = useState('00:00:00');
  const [c5Messages, setC5Messages] = useState<string[]>([]);
  
  useEffect(() => {
    // Initial glitch overlay ends after 1.5s
    const t = setTimeout(() => {
      setGlitching(false);
    }, 1500);
    return () => clearTimeout(t);
  }, []);

  // Global AudioContext for UI sounds
  useEffect(() => {
    if (!ax) ax = new (window.AudioContext || (window as any).webkitAudioContext)();
    if (ax.state === 'suspended') ax.resume();
    
    // Background noise
    const bs = 2 * ax.sampleRate;
    const nb = ax.createBuffer(1, bs, ax.sampleRate);
    const out = nb.getChannelData(0);
    for (let i = 0; i < bs; i++) out[i] = (Math.random() * 2 - 1) * 0.1;
    const nn = ax.createBufferSource();
    nn.buffer = nb;
    nn.loop = true;
    const g = ax.createGain();
    const f = ax.createBiquadFilter();
    g.gain.value = 0.5;
    f.type = 'lowpass';
    f.frequency.value = 2000;
    nn.connect(f);
    f.connect(g);
    g.connect(ax.destination);
    nn.start();

    return () => {
      nn.stop();
      if (ax) ax.close();
      ax = null;
      if (vAudio && !vAudio.paused) {
        vAudio.pause();
      }
    };
  }, []);

  // Format Helper
  const fmt = (t: number) => {
    if (isNaN(t)) return "00:00";
    return Math.floor(t / 60).toString().padStart(2, '0') + ':' + Math.floor(t % 60).toString().padStart(2, '0');
  };

  // Init Music Audio
  useEffect(() => {
    if (!vAudio) {
      vAudio = new Audio();
      vAudio.addEventListener('timeupdate', () => {
        if (!vAudio || !vAudio.duration) return;
        setAudioProgress(vAudio.currentTime / vAudio.duration * 100);
        setAudioTime(`${fmt(vAudio.currentTime)} / ${fmt(vAudio.duration)}`);
      });
      vAudio.addEventListener('loadedmetadata', () => {
        if (!vAudio || !vAudio.duration) return;
        setAudioProgress(vAudio.currentTime / vAudio.duration * 100);
        setAudioTime(`${fmt(vAudio.currentTime)} / ${fmt(vAudio.duration)}`);
      });
      vAudio.addEventListener('ended', () => {
        setAudioPlaying(false);
        setAudioProgress(100);
      });
    }
  }, []);

  const clk = () => {
    if (!ax) return;
    if (ax.state === 'suspended') ax.resume();
    const o = ax.createOscillator();
    const g = ax.createGain();
    o.type = 'square';
    o.frequency.setValueAtTime(150, ax.currentTime);
    o.frequency.exponentialRampToValueAtTime(40, ax.currentTime + 0.1);
    g.gain.setValueAtTime(0.5, ax.currentTime);
    g.gain.exponentialRampToValueAtTime(0.01, ax.currentTime + 0.1);
    o.connect(g);
    g.connect(ax.destination);
    o.start();
    o.stop(ax.currentTime + 0.1);
  };

  const nextChannel = () => {
    clk();
    setChannel(prev => {
      const next = prev % 6 + 1;
      if (next !== 3 && vAudio) {
        vAudio.pause();
        setAudioPlaying(false);
      }
      return next;
    });
  };

  const playMusic = () => {
    if (!vAudio || !vAudio.src) return;
    const p = vAudio.play();
    if (p !== undefined) {
      p.catch(e => console.warn('Audio play prevented:', e));
    }
    setAudioPlaying(true);
  };

  const pauseMusic = () => {
    if (vAudio) {
      vAudio.pause();
      setAudioPlaying(false);
    }
  };

  const rewMusic = () => {
    if (vAudio) {
      vAudio.currentTime = 0;
      vAudio.pause();
      setAudioPlaying(false);
      setAudioProgress(0);
      if (vAudio.duration) {
         setAudioTime(`00:00 / ${fmt(vAudio.duration)}`);
      }
    }
  };

  const [audioError, setAudioError] = useState('');

  const loadAudio = async (idx: number, url: string) => {
    if (!vAudio) return;
    if (activeLi === idx && vAudio.src && !audioError) {
      playMusic();
      return;
    }
    setActiveLi(idx);
    setAudioError('');
    
    // Play static noise when audio plays (to simulate CRT filter) without tainting the canvas
    if (!_actx) {
      _actx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      const nb = _actx.createBuffer(1, _actx.sampleRate * 2, _actx.sampleRate);
      const od = nb.getChannelData(0);
      // Reduced Amplitude substantially for softer noise
      for (let i = 0; i < od.length; i++) od[i] = (Math.random() * 2 - 1) * 0.006;
      const _nz = _actx.createBufferSource(); _nz.buffer = nb; _nz.loop = true;
      const _ng = _actx.createGain(); _ng.gain.value = 0;
      _nz.connect(_ng); _ng.connect(_actx.destination); _nz.start();
      
      // Kept gain low even when active
      vAudio.addEventListener('play', () => _ng.gain.value = 0.5);
      vAudio.addEventListener('pause', () => _ng.gain.value = 0);
      vAudio.addEventListener('ended', () => _ng.gain.value = 0);
    }
    
    if (_actx && _actx.state === 'suspended') _actx.resume();

    try {
      if (curBlobRef.current) URL.revokeObjectURL(curBlobRef.current);
      curBlobRef.current = null;
      
      // Use direct URL and don't enforce crossOrigin (prevents CORS blocking on Discord CDNs)
      vAudio.removeAttribute('crossOrigin');
      vAudio.src = url;
      
      // Some CDNs like discord require this to be able to fetch the audio directly 
      // without failing due to sec-fetch-* and referer headers.
      vAudio.referrerPolicy = 'no-referrer';
      
      vAudio.oncanplay = () => {
        setAudioProgress(0);
        setAudioTime('00:00 / 00:00');
        playMusic();
        vAudio!.oncanplay = null; // remove listener once loaded
        vAudio!.onerror = null;
      };

      vAudio.onerror = () => {
        setAudioError('SINAL PERDIDO - LINK EXPIRADO OU BLOQUEADO');
        setActiveLi(-1);
        vAudio!.onerror = null;
        vAudio!.oncanplay = null;
      }
      
      vAudio.load();
    } catch(e) {
      console.error(e);
      setAudioError('SINAL PERDIDO - LINK EXPIRADO OU BLOQUEADO');
      setActiveLi(-1);
    }
  };

  // C4 Effect
  useEffect(() => {
    if (channel !== 4) return;
    let s = 0;
    const i = setInterval(() => {
      s++;
      if (s > 10 && s <= 20) { setC4Class('filter blur-[3px] -skew-x-[15deg]'); }
      if (s > 20 && s <= 30) { setC4Class('scale-110 invert'); setC4Text('TUDO NRMAL AQUI.'); }
      if (s > 30) { setC4Class('tracking-tighter !text-red-600 animate-[jit2_0.05s_infinite]'); setC4Text('NADA É NORMAL.'); }
    }, 300);
    return () => { clearInterval(i); setC4Class(''); setC4Text('TUDO NORMAL AQUI.'); };
  }, [channel]);

  // C5 Effect
  useEffect(() => {
    if (channel !== 5) return;
    let s = 0;
    const t = setInterval(() => {
      s++;
      const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sc = s % 60;
      setC5Time(`${h < 10 ? '0' : ''}${h}:${m < 10 ? '0' : ''}${m}:${sc < 10 ? '0' : ''}${sc}`);
    }, 1000);

    const ms = ["[user87]: cadê", "[unknown]: chegou a hr", "[void]: ...", "[sys]: signal lost"];
    const c = setInterval(() => {
      if (Math.random() > 0.4) return;
      setC5Messages(prev => {
        const next = [...prev, ms[Math.floor(Math.random() * ms.length)]];
        if (next.length > 8) next.shift();
        return next;
      });
    }, 800);

    return () => { clearInterval(t); clearInterval(c); };
  }, [channel]);

  return (
    <div className="fixed inset-0 bg-black z-[999] font-vt323 overflow-hidden select-none">
      <AnimatePresence>
        {glitching && (
          <motion.div 
            initial={{ opacity: 1, scale: 1, filter: "invert(0)" }}
            animate={{ 
              opacity: [1, 0.7, 1, 0, 0], 
              scale: [1, 1.1, 1.2, 0.5, 0],
              filter: ["invert(0)", "invert(1) hue-rotate(90deg)", "invert(0) drop-shadow(10px 10px red)", "invert(0)"],
              skewX: [0, 20, 0],
              skewY: [0, -20, 0]
            }}
            transition={{ duration: 1.5, times: [0, 0.2, 0.4, 0.6, 1] }}
            className="absolute inset-0 bg-white z-[1000] mix-blend-difference pointer-events-none"
          />
        )}
      </AnimatePresence>

      <div className="absolute inset-5 bg-[#111] rounded-[40px] border-[15px] border-[#222] shadow-[inset_0_0_100px_#000,0_0_50px_rgba(0,0,0,0.8)] flex flex-col">
        <div 
          className="flex-1 relative bg-[#050505] m-2.5 rounded-[30px] overflow-hidden cursor-crosshair group"
          onClick={(e) => {
            const target = e.target as HTMLElement;
            if (target.closest('.vbtn') || target.closest('li')) return;
            if (target.classList.contains('hmsg')) {
              target.classList.add('opacity-100', 'text-shadow-glitch', 'animate-[jit2_0.1s_infinite]');
              return;
            }
            nextChannel();
          }}
        >
          {/* Visual Overlays */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_2px,3px_100%] pointer-events-none z-10" />
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.1),rgba(0,0,0,0.1)_1px,transparent_1px,transparent_2px)] pointer-events-none z-[9]" />
          <div className="absolute inset-0 pointer-events-none z-8 bg-white/5 animate-[flk_0.15s_infinite]" />

          {/* CHANNELS */}
          <div className={`absolute inset-0 z-1 w-full h-full ${channel === 1 ? 'flex' : 'hidden'} flex-col justify-center items-center bg-[repeating-linear-gradient(90deg,#fff_0,#fff_14.2%,#ffed00_14.2%,#ffed00_28.4%,#0ff_28.4%,#0ff_42.6%,#0f0_42.6%,#0f0_56.8%,#f0f_56.8%,#f0f_71%,#f00_71%,#f00_85.2%,#00f_85.2%,#00f_100%)]`}>
            <h1 className="bg-black text-white py-2 md:py-4 px-4 md:px-12 text-3xl md:text-6xl text-center tracking-[5px] md:tracking-[10px] animate-[jit2_0.1s_infinite]">LIXO BRASILEIRO<br/>VOCÊ ESTÁ SINTONIZADO</h1>
          </div>

          <div className={`absolute inset-0 z-1 w-full h-full ${channel === 2 ? 'flex' : 'hidden'} flex-col justify-center items-center bg-[#111]`}>
            {channel === 2 && <BrigasFuteisGame />}
          </div>

          <div className={`absolute inset-0 z-1 w-full h-full ${channel === 3 ? 'flex' : 'hidden'} flex-col items-start justify-start p-[5%_10%] bg-[#0000aa] text-white text-xl md:text-3xl overflow-y-auto pb-20`}>
            <div className={`absolute top-[5%] md:top-[8%] right-[5%] text-2xl md:text-5xl ${audioPlaying ? 'animate-[blk_1s_infinite]' : ''}`}>{audioPlaying ? 'PLAY' : 'STOP'}</div>
            <ul className="list-none mt-[15vh] md:mt-[10vh] w-full space-y-2">
              {[
                { name: 'BROCKHAMPTON_nao_lancada.mp3', url: 'https://audio.jukehost.co.uk/RXVePVjLYVfMKtUr9u2fZ3elSwAODbTm' },
                { name: 'SANTO-nao-vai-ser-lancada.mp3', url: 'https://audio.jukehost.co.uk/7ci7BvkpQ6sEcOVaY38wa9dr32ax6lg7' },
                { name: 'track-album-solo-henriz.mp3',    url: 'https://audio.jukehost.co.uk/KrXFIc8Rp4VajY4OSX1mXybVVzx2j8Us' }
              ].map((trk, i) => (
                <li 
                  key={i} 
                  className={`p-2.5 cursor-pointer border border-transparent hover:bg-white hover:text-[#0000aa] whitespace-nowrap overflow-hidden text-ellipsis ${activeLi === i ? 'bg-white !text-[#0000aa]' : ''}`}
                  onClick={(e) => { e.stopPropagation(); loadAudio(i, trk.url); }}
                >
                  [ ] {trk.name}
                </li>
              ))}
            </ul>
            {audioError && <div className="mt-4 text-red-600 bg-black px-4 py-1 animate-[jit2_0.1s_infinite] break-words whitespace-normal">{audioError}</div>}
            
            <div className="mt-auto w-full border-t-4 border-white pt-4 md:pt-8 flex flex-row flex-wrap items-center gap-2 md:gap-4 fixed md:static bottom-0 left-0 p-4 md:p-0 bg-[#0000aa]/90 md:bg-transparent">
              <div className="flex gap-2 w-full md:w-auto">
                <button className="vbtn flex-1 md:flex-none bg-transparent border-2 border-white text-white font-vt323 text-lg md:text-2xl py-1 px-2 md:px-6 hover:bg-white hover:text-[#0000aa]" onClick={(e)=>{e.stopPropagation(); playMusic()}}>PLAY</button>
                <button className="vbtn flex-1 md:flex-none bg-transparent border-2 border-white text-white font-vt323 text-lg md:text-2xl py-1 px-2 md:px-6 hover:bg-white hover:text-[#0000aa]" onClick={(e)=>{e.stopPropagation(); pauseMusic()}}>STOP</button>
                <button className="vbtn flex-1 md:flex-none bg-transparent border-2 border-white text-white font-vt323 text-lg md:text-2xl py-1 px-2 md:px-6 hover:bg-white hover:text-[#0000aa]" onClick={(e)=>{e.stopPropagation(); rewMusic()}}>REW</button>
              </div>
              
              <div className="flex-grow w-full md:w-auto flex items-center gap-2 md:gap-4 mt-2 md:mt-0">
                <div className="flex-grow h-[10px] md:h-[15px] border-2 border-white flex">
                  <div className="h-full bg-white transition-[width] duration-100 ease-linear" style={{ width: `${audioProgress}%` }}></div>
                </div>
                <span className="text-sm md:text-2xl w-24 md:w-auto shrink-0 text-right">{audioTime}</span>
              </div>
            </div>
          </div>

          <div className={`absolute inset-0 z-1 w-full h-full ${channel === 4 ? 'flex' : 'hidden'} flex-col justify-center items-center bg-[#eee] text-[#111]`}>
            <h1 className={`text-[6vw] transition-all duration-200 ${c4Class}`}>{c4Text}</h1>
          </div>

          <div className={`absolute inset-0 z-1 w-full h-full ${channel === 5 ? 'flex' : 'hidden'} flex-col justify-center items-center bg-[#0a0a0a] text-[#0f0]`}>
            <div className="absolute top-[5%] left-[5%] text-red-600 text-5xl animate-[blk_1s_infinite]">REC</div>
            <div className="text-[6rem] mb-8">{c5Time}</div>
            <div className="w-[80%] h-[40vh] border border-[#333] overflow-hidden flex flex-col justify-end p-4 text-2xl">
              {c5Messages.map((msg, i) => (
                <div key={i} className="mt-1 animate-[sup_0.2s_forwards]">{msg}</div>
              ))}
            </div>
          </div>

          <div className={`absolute inset-0 z-1 w-full h-full ${channel === 6 ? 'block' : 'hidden'} bg-[#000] relative`}>
            {/* hidden elements that appear on hover */}
            <div className="hmsg absolute text-white text-3xl opacity-0 p-8 cursor-crosshair transition-opacity duration-100 hover:opacity-100 hover:text-shadow-glitch hover:animate-[jit2_0.1s_infinite]" style={{top: '10%', left: '10%'}}>A ARTE É CAOS</div>
            <div className="hmsg absolute text-white text-3xl opacity-0 p-8 cursor-crosshair transition-opacity duration-100 hover:opacity-100 hover:text-shadow-glitch hover:animate-[jit2_0.1s_infinite]" style={{top: '80%', left: '70%'}}>SINAL INTERROMPIDO</div>
            <div className="hmsg absolute text-white text-3xl opacity-0 p-8 cursor-crosshair transition-opacity duration-100 hover:opacity-100 hover:text-shadow-glitch hover:animate-[jit2_0.1s_infinite]" style={{top: '40%', left: '45%'}}>RUÍDO ESTRUTURADO</div>
            <div className="hmsg absolute text-white text-3xl opacity-0 p-8 cursor-crosshair transition-opacity duration-100 hover:opacity-100 hover:text-shadow-glitch hover:animate-[jit2_0.1s_infinite]" style={{top: '60%', left: '20%'}}>DSCPLS DSCPLS</div>
          </div>
        </div>
        
        <div className="absolute bottom-5 right-8 flex gap-2.5 z-[99]">
          <div 
            className="w-10 h-10 bg-[#333] rounded-full border-2 border-[#444] cursor-pointer flex items-center justify-center text-[10px] text-[#888] active:scale-90 active:rotate-[15deg] transition-transform"
            onClick={nextChannel}
          >
            TUNE
          </div>
          <div 
            className="w-10 h-10 bg-red-900 rounded-full border-2 border-[#444] cursor-pointer flex items-center justify-center text-[10px] text-white active:scale-90 transition-transform"
            onClick={onClose}
          >
            OFF
          </div>
        </div>
      </div>
    </div>
  );
}
