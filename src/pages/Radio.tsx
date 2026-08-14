import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, Radio as RadioIcon, MessageSquare, ArrowRight, Disc3, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

// =========================================================================
// 📻 RÁDIO LIXO BRASILEIRO - ROTAÇÃO DE FAIXAS (JUKEHOST)
// =========================================================================
export interface RadioTrack {
  id: string;
  title: string;
  artist: string;
  audioUrl: string;
}

export const RADIO_PLAYLIST: RadioTrack[] = [
  {
    id: 'santinho',
    title: 'SANTINHO / cartas para alguém do passado',
    artist: 'DISCÍPULOS',
    audioUrl: 'https://audio.jukehost.co.uk/01a0020d-c0c2-7383-816c-415eb5d518d0',
  },
  {
    id: 'brigas-futeis-remix',
    title: 'BRIGAS FÚTEIS (REMIX)',
    artist: 'DISCÍPULOS feat. NBA Younger & Kaio Valle',
    audioUrl: 'https://audio.jukehost.co.uk/rl7WpCUpB6B2Fphs3OuFfG2OuKMLoLGm',
  },
  {
    id: 'santo',
    title: 'SANTO!',
    artist: 'DISCÍPULOS',
    audioUrl: 'https://audio.jukehost.co.uk/7ci7BvkpQ6sEcOVaY38wa9dr32ax6lg7',
  },
  {
    id: 'corredor',
    title: 'corredor',
    artist: 'Henriz',
    audioUrl: 'https://audio.jukehost.co.uk/KrXFIc8Rp4VajY4OSX1mXybVVzx2j8Us',
  },
  {
    id: 'team-malibu',
    title: 'TEAM / MALIBU',
    artist: 'BROCKHAMPTON',
    audioUrl: 'https://audio.jukehost.co.uk/RXVePVjLYVfMKtUr9u2fZ3elSwAODbTm',
  },
  {
    id: 'background',
    title: 'background',
    artist: 'BROCKHAMPTON',
    audioUrl: 'https://audio.jukehost.co.uk/7b2arQLYzy4GHB2z68rlbO7oL9r4Kj6a',
  },
];

// Transições / Vinhetas da Rádio Lixo Brasileiro
const RADIO_TAGS = [
  {
    id: 'tag-1',
    url: 'https://audio.jukehost.co.uk/01a00228-831d-723d-b3a1-5456ae3d9a68',
    cutoff: 0, // toca até o final
  },
  {
    id: 'tag-2',
    url: 'https://audio.jukehost.co.uk/01a00228-8b0d-7205-8d72-2643c0e7dffe',
    cutoff: 3.0, // corta aos 3 segundos
  },
];

export default function Radio() {
  const { lang, t } = useLanguage();
  const [currentTrackIdx, setCurrentTrackIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.85);
  const [showRecadoModal, setShowRecadoModal] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [currentTimeStr, setCurrentTimeStr] = useState('00:00');
  const [durationStr, setDurationStr] = useState('00:00');
  const [powerOn, setPowerOn] = useState(true);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const tagAudioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const isTransitioningRef = useRef(false);
  const fallbackTimeoutRef = useRef<any>(null);

  const currentTrack = RADIO_PLAYLIST[currentTrackIdx];
  const STATION_FREQ = '94.7 FM';

  // Helper to format time seconds
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Change to target track with seamless tag transition
  const changeToTrack = (targetIndex: number) => {
    if (!powerOn) return;
    
    // Clear any previous fallback timeout
    if (fallbackTimeoutRef.current) {
      clearTimeout(fallbackTimeoutRef.current);
      fallbackTimeoutRef.current = null;
    }

    isTransitioningRef.current = true;

    // Immediately stop both audios
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (tagAudioRef.current) {
      tagAudioRef.current.pause();
      tagAudioRef.current.onended = null;
      tagAudioRef.current.ontimeupdate = null;
    }

    // Set UI directly to new track
    setCurrentTrackIdx(targetIndex);
    setAudioProgress(0);
    setCurrentTimeStr('00:00');

    // Preload next track URL onto main audio element
    if (audioRef.current) {
      audioRef.current.src = RADIO_PLAYLIST[targetIndex].audioUrl;
      audioRef.current.load();
    }

    // Truly random selection among available jingles/tags
    const chosenTagIdx = Math.floor(Math.random() * RADIO_TAGS.length);
    const selectedTag = RADIO_TAGS[chosenTagIdx];

    const tagAudio = tagAudioRef.current;
    if (!tagAudio) {
      // Direct play if tag element unavailable
      if (audioRef.current && powerOn) {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
      isTransitioningRef.current = false;
      return;
    }

    let tagFinished = false;

    const finishTagAndPlaySong = () => {
      if (tagFinished) return;
      tagFinished = true;

      if (fallbackTimeoutRef.current) {
        clearTimeout(fallbackTimeoutRef.current);
        fallbackTimeoutRef.current = null;
      }

      tagAudio.pause();
      tagAudio.onended = null;
      tagAudio.ontimeupdate = null;

      // Start playing main song directly without delay
      if (audioRef.current && powerOn) {
        audioRef.current.currentTime = 0;
        audioRef.current.volume = isMuted ? 0 : volume;
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            setIsPlaying(true);
            isTransitioningRef.current = false;
          }).catch((err) => {
            console.log('Direct play resolved/handled:', err);
            setIsPlaying(false);
            isTransitioningRef.current = false;
          });
        }
      } else {
        isTransitioningRef.current = false;
      }
    };

    tagAudio.src = selectedTag.url;
    tagAudio.volume = isMuted ? 0 : volume;
    tagAudio.currentTime = 0;
    tagAudio.load();

    tagAudio.onended = finishTagAndPlaySong;

    if (selectedTag.cutoff > 0) {
      tagAudio.ontimeupdate = () => {
        if (tagAudio.currentTime >= selectedTag.cutoff) {
          finishTagAndPlaySong();
        }
      };
    }

    // Safety timeout in case of network lag on tag
    const maxSafetyMs = selectedTag.cutoff > 0 ? (selectedTag.cutoff * 1000 + 400) : 6000;
    fallbackTimeoutRef.current = setTimeout(() => {
      if (!tagFinished) {
        finishTagAndPlaySong();
      }
    }, maxSafetyMs);

    const tagPromise = tagAudio.play();
    if (tagPromise !== undefined) {
      tagPromise.then(() => {
        setIsPlaying(true);
      }).catch((e) => {
        console.log('Tag playback skipped directly to song:', e);
        finishTagAndPlaySong();
      });
    }
  };

  const handleNextTrack = () => {
    const nextIdx = (currentTrackIdx + 1) % RADIO_PLAYLIST.length;
    changeToTrack(nextIdx);
  };

  const handlePrevTrack = () => {
    const prevIdx = (currentTrackIdx - 1 + RADIO_PLAYLIST.length) % RADIO_PLAYLIST.length;
    changeToTrack(prevIdx);
  };

  const handleTogglePower = () => {
    if (powerOn) {
      if (audioRef.current) audioRef.current.pause();
      if (tagAudioRef.current) tagAudioRef.current.pause();
      setIsPlaying(false);
      setPowerOn(false);
    } else {
      setPowerOn(true);
      if (audioRef.current) {
        if (!audioRef.current.src || audioRef.current.src === '') {
          audioRef.current.src = currentTrack.audioUrl;
          audioRef.current.load();
        }
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(err => {
          console.log('Autoplay blocked:', err);
        });
      }
    }
  };

  const handleTogglePlay = () => {
    if (!powerOn) {
      setPowerOn(true);
    }
    if (isPlaying) {
      if (audioRef.current) audioRef.current.pause();
      if (tagAudioRef.current) tagAudioRef.current.pause();
      setIsPlaying(false);
    } else {
      // If tag is in progress, resume tag; otherwise play main track
      if (isTransitioningRef.current && tagAudioRef.current && !tagAudioRef.current.ended) {
        tagAudioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {});
      } else if (audioRef.current) {
        if (!audioRef.current.src || !audioRef.current.src.includes('jukehost')) {
          audioRef.current.src = currentTrack.audioUrl;
          audioRef.current.load();
        }
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(err => {
          console.log('Play failed:', err);
        });
      }
    }
  };

  // Sync volume to both audios
  useEffect(() => {
    const activeVol = isMuted ? 0 : volume;
    if (audioRef.current) {
      audioRef.current.volume = activeVol;
    }
    if (tagAudioRef.current) {
      tagAudioRef.current.volume = activeVol;
    }
  }, [volume, isMuted]);

  // Handle main track events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      if (!audio.duration || isTransitioningRef.current) return;
      setAudioProgress((audio.currentTime / audio.duration) * 100);
      setCurrentTimeStr(formatTime(audio.currentTime));
      setDurationStr(formatTime(audio.duration));
    };

    const handleEnded = () => {
      // Auto-advance to next track on the radio with tag transition
      handleNextTrack();
    };

    const handleLoadedMetadata = () => {
      if (audio.duration) {
        setDurationStr(formatTime(audio.duration));
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [currentTrackIdx, powerOn]);

  // Initial setup on mount
  useEffect(() => {
    if (audioRef.current && powerOn) {
      audioRef.current.src = RADIO_PLAYLIST[0].audioUrl;
      audioRef.current.load();
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        setIsPlaying(false);
      });
    }

    return () => {
      if (fallbackTimeoutRef.current) {
        clearTimeout(fallbackTimeoutRef.current);
      }
      if (audioCtxRef.current) {
        try { audioCtxRef.current.close(); } catch (_) {}
      }
    };
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-[82vh] py-4 relative select-none">
      
      {/* Crisp Solid Dark Background (No glowing/vibe gradients) */}
      <div className="fixed inset-0 pointer-events-none z-[-1] bg-[#090706]"></div>

      {/* Hidden audio elements */}
      <audio
        ref={audioRef}
        src={currentTrack.audioUrl}
        preload="auto"
      />
      <audio
        ref={tagAudioRef}
        preload="auto"
      />

      {/* TOP BADGE: LIXO BRASILEIRO BROADCAST STATUS */}
      <div className="flex items-center gap-3 mb-6">
        <div className="inline-flex items-center gap-2 bg-[#120d09] border-2 border-[#FFE600] px-4 py-1.5 rounded-full shadow-md">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00DF59]"></span>
          <span className="text-[#FFE600] font-mono font-bold text-xs tracking-[0.25em] uppercase">
            {t('radio.live_badge')}{STATION_FREQ}
          </span>
        </div>
      </div>

      {/* =========================================================================
          📻 THE VINTAGE WOODEN RADIO CHASSIS
         ========================================================================= */}
      <div className="w-full max-w-4xl relative">
        
        {/* Outer Wooden Radio Cabinet */}
        <div className="relative rounded-2xl p-4 md:p-8 bg-[#22130a] border-[8px] md:border-[12px] border-[#382012] shadow-2xl">
          
          {/* Brass Corner Accents / Screws */}
          <div className="absolute top-2 left-2 w-4 h-4 rounded-full bg-[#b38b4d] border border-[#543b1b] flex items-center justify-center text-[8px] text-black font-bold">+</div>
          <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#b38b4d] border border-[#543b1b] flex items-center justify-center text-[8px] text-black font-bold">+</div>
          <div className="absolute bottom-2 left-2 w-4 h-4 rounded-full bg-[#b38b4d] border border-[#543b1b] flex items-center justify-center text-[8px] text-black font-bold">+</div>
          <div className="absolute bottom-2 right-2 w-4 h-4 rounded-full bg-[#b38b4d] border border-[#543b1b] flex items-center justify-center text-[8px] text-black font-bold">+</div>

          {/* Top Brand Nameplate (Solid Gold/Brass Style) */}
          <div className="flex justify-center mb-6">
            <div className="bg-[#b88c42] text-black px-6 md:px-10 py-1.5 rounded-sm border-2 border-[#f5dfa8] flex items-center gap-3">
              <RadioIcon size={18} className="text-black" />
              <span className="font-black text-xs md:text-sm tracking-[0.3em] uppercase">
                {t('radio.brand_title')}{STATION_FREQ}
              </span>
            </div>
          </div>

          {/* Main Front Panel: Speaker Grille + Digital VFD Screen */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#140e09] p-4 md:p-6 rounded-xl border-4 border-[#2b180d]">
            
            {/* LEFT: Vintage Speaker Grille with Speaker Cone */}
            <div className="lg:col-span-5 relative bg-[#100c08] rounded-lg border-2 border-[#3d2415] p-6 flex flex-col justify-between overflow-hidden min-h-[220px]">
              
              {/* Speaker Emblem */}
              <div className="relative z-10 flex items-center justify-between text-[#d6a858] font-mono text-[10px] tracking-widest uppercase">
                <span>{t('radio.hifi')}</span>
                <span>LB-2026</span>
              </div>

              {/* Speaker Cone */}
              <div className="relative z-10 my-auto flex items-center justify-center">
                <motion.div 
                  animate={isPlaying && powerOn ? { scale: [1, 1.03, 0.98, 1.02, 1] } : { scale: 1 }}
                  transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut" }}
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-[#3a2517] bg-[#0a0705] flex items-center justify-center shadow-inner"
                >
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-[#4d3220] bg-[#17100a] flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-black border border-[#d6a858]/30 flex items-center justify-center">
                      <Disc3 size={16} className={`text-[#00DF59] ${isPlaying && powerOn ? 'animate-spin' : ''}`} />
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Speaker base status */}
              <div className="relative z-10 flex justify-between items-center text-[10px] font-mono text-[#d6a858] tracking-wider">
                <span className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${powerOn ? 'bg-[#00DF59]' : 'bg-red-900'}`}></span>
                  {powerOn ? t('radio.signal_stable') : t('radio.power_off')}
                </span>
                <span>{t('radio.track_label')} {currentTrackIdx + 1} {t('radio.of')} {RADIO_PLAYLIST.length}</span>
              </div>
            </div>

            {/* RIGHT: Tuning Scale Dial + VFD Glowing Display */}
            <div className="lg:col-span-7 flex flex-col justify-between gap-4">
              
              {/* Analog Dial Scale (Fixed at 94.7 FM) */}
              <div className="relative bg-[#090705] border-2 border-[#3d2415] rounded-lg p-3 overflow-hidden">
                <div className="flex justify-between text-[11px] font-mono font-bold text-[#FFE600] mb-1 tracking-widest">
                  <span>FM</span>
                  <span>88</span>
                  <span>92</span>
                  <span className="text-[#00DF59] font-black underline decoration-2 underline-offset-2">94.7</span>
                  <span>98</span>
                  <span>102</span>
                  <span>106</span>
                  <span>108</span>
                  <span>MHz</span>
                </div>
                
                {/* Dial ruler tick marks */}
                <div className="h-6 w-full relative flex items-center bg-[#110d08] border-y border-[#3a2213] overflow-hidden">
                  <div className="absolute inset-0 flex justify-between px-2 items-center opacity-40">
                    {Array.from({ length: 45 }).map((_, idx) => (
                      <div key={idx} className={`w-[1px] ${idx % 5 === 0 ? 'h-4 bg-[#FFE600]' : 'h-2 bg-[#d6a858]'}`}></div>
                    ))}
                  </div>

                  {/* Frequency Needle (Locked at 94.7 FM) */}
                  <div 
                    className="absolute top-0 bottom-0 w-[3px] bg-[#00DF59] z-20"
                    style={{ left: '33.5%' }}
                  >
                    <div className="w-2.5 h-2 -ml-1 bg-[#FFE600] rounded-sm"></div>
                  </div>
                </div>
              </div>

              {/* Glowing VFD / Digital Screen */}
              <div className="relative bg-[#040605] border-2 border-[#00DF59] rounded-lg p-4 md:p-5 overflow-hidden flex flex-col justify-between min-h-[145px]">
                
                {/* CRT Scanline Texture */}
                <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(0,223,89,0.03),rgba(0,223,89,0.03)_1px,transparent_1px,transparent_3px)] pointer-events-none z-10"></div>

                {/* Display Header */}
                <div className="relative z-20 flex justify-between items-center text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="text-[#00DF59] font-bold tracking-widest uppercase">
                      {t('radio.station_title')}
                    </span>
                    <span className="text-[#FFE600] font-black">{STATION_FREQ}</span>
                  </div>
                  <span className={`px-2 py-0.5 text-[10px] font-bold font-mono tracking-widest rounded ${powerOn ? 'bg-[#00DF59] text-black' : 'bg-red-900 text-white'}`}>
                    {powerOn ? t('radio.live') : t('radio.offline')}
                  </span>
                </div>

                {/* Center: Current Track Title */}
                <div className="relative z-20 my-2">
                  <AnimatePresence mode="wait">
                    {powerOn ? (
                      <motion.div
                        key={currentTrack.id}
                        initial={{ opacity: 0, y: 3 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -3 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="text-[#00DF59] text-lg md:text-2xl font-black uppercase tracking-tight leading-snug">
                          {currentTrack.title}
                        </div>
                        <div className="text-[#FFE600] font-mono text-xs md:text-sm font-bold tracking-widest uppercase mt-0.5">
                          {currentTrack.artist}
                        </div>
                      </motion.div>
                    ) : (
                      <div className="text-gray-600 font-mono text-sm uppercase">
                        {t('radio.receiver_off')}
                      </div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Progress bar inside screen */}
                <div className="relative z-20 mt-1">
                  <div className="w-full bg-[#0d170f] h-2 rounded-full overflow-hidden border border-[#00DF59]/40">
                    <div 
                      className="bg-[#00DF59] h-full transition-[width] duration-200"
                      style={{ width: `${audioProgress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-[#00DF59] mt-1">
                    <span>{currentTimeStr}</span>
                    <span>{t('radio.continuous')}</span>
                    <span>{durationStr}</span>
                  </div>
                </div>

              </div>

            </div>

          </div>

          {/* Bottom Physical Controls Panel (Knobs, Switch, Buttons) */}
          <div className="mt-6 pt-5 border-t-2 border-[#472c1a] flex flex-wrap items-center justify-between gap-4">
            
            {/* Left: Volume, Power, Play/Pause */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Power Switch */}
              <button 
                onClick={handleTogglePower}
                className={`px-4 py-2 rounded font-mono text-xs font-black uppercase tracking-wider transition-all border-2 flex items-center gap-2 ${
                  powerOn 
                    ? 'bg-[#00DF59] border-[#00DF59] text-black' 
                    : 'bg-[#2b180d] border-[#472c1a] text-gray-400 hover:text-white'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${powerOn ? 'bg-black' : 'bg-red-500'}`}></span>
                {powerOn ? t('radio.power_on') : t('radio.turn_on')}
              </button>

              {/* Play / Pause Toggle */}
              <button 
                onClick={handleTogglePlay}
                disabled={!powerOn}
                className="px-4 py-2 bg-[#1f150e] hover:bg-[#332014] disabled:opacity-40 text-white font-mono text-xs font-bold uppercase tracking-wider border-2 border-[#472c1a] rounded transition-colors"
              >
                {isPlaying ? t('radio.pause') : t('radio.play')}
              </button>

              {/* Mute Toggle & Volume Slider */}
              <div className="flex items-center gap-2 bg-[#140e09] px-3 py-1.5 rounded border border-[#3d2415]">
                <button 
                  onClick={() => setIsMuted(!isMuted)} 
                  className="text-[#FFE600] hover:text-white transition-colors"
                  title={isMuted ? t('radio.unmute') : t('radio.mute')}
                >
                  {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    setVolume(parseFloat(e.target.value));
                    if (isMuted) setIsMuted(false);
                  }}
                  className="w-16 md:w-24 accent-[#00DF59] cursor-pointer"
                />
              </div>
            </div>

            {/* Right: Track Skip & Recado Button */}
            <div className="flex items-center gap-3">
              
              {/* Previous Track */}
              <button 
                onClick={handlePrevTrack}
                disabled={!powerOn}
                className="px-3 py-2 bg-[#1f150e] hover:bg-[#332014] disabled:opacity-40 text-[#FFE600] font-mono text-xs font-bold uppercase tracking-wider border-2 border-[#472c1a] rounded transition-colors"
                title={t('radio.prev_title')}
              >
                {t('radio.prev')}
              </button>

              {/* Next Track Button */}
              <button 
                onClick={handleNextTrack}
                disabled={!powerOn}
                className="px-5 py-2.5 bg-[#FFE600] text-black font-black text-xs md:text-sm tracking-widest uppercase rounded hover:bg-[#00DF59] active:scale-95 disabled:opacity-40 transition-all flex items-center gap-2 border-2 border-white"
              >
                <span>{t('radio.next')}</span>
                <ArrowRight size={16} />
              </button>

              {/* Easter Egg Button: "MANDE UM RECADO!" */}
              <button 
                onClick={() => setShowRecadoModal(true)}
                className="px-4 py-2.5 bg-[#17100a] hover:bg-[#241910] text-[#00DF59] hover:text-[#FFE600] border-2 border-[#00DF59] font-mono text-xs font-black uppercase tracking-wider rounded transition-all flex items-center gap-2 active:scale-95"
              >
                <MessageSquare size={16} />
                <span>{t('radio.message_btn')}</span>
              </button>

            </div>

          </div>

        </div>

      </div>

      {/* Discrete bottom link to return to the normal site experience */}
      <div className="mt-8 text-center">
        <Link 
          to="/home" 
          className="group inline-flex items-center gap-3 text-gray-400 hover:text-white font-mono text-xs md:text-sm tracking-[0.2em] uppercase border-b border-white/20 hover:border-[#00DF59] pb-1 transition-all"
        >
          <span>{t('radio.back_to_site')}</span>
          <ArrowRight size={16} className="text-[#00DF59] group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* =========================================================================
          📞 MODAL: "MANDE UM RECADO!"
         ========================================================================= */}
      <AnimatePresence>
        {showRecadoModal && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/85">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg bg-[#0e0c0a] border-4 border-[#FFE600] p-6 md:p-8 rounded-lg shadow-2xl relative overflow-hidden"
            >
              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between border-b-2 border-[#FFE600]/30 pb-3">
                  <span className="font-mono text-xs font-bold text-[#FFE600] tracking-widest uppercase flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
                    {t('radio.modal_hotline')}
                  </span>
                  <span className="font-mono text-xs text-red-500 font-bold">{t('radio.modal_closed_badge')}</span>
                </div>

                <div className="py-2">
                  <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white mb-3">
                    {t('radio.modal_closed_title')}
                  </h3>
                  <p className="text-gray-300 font-mono text-sm leading-relaxed mb-4">
                    {t('radio.modal_closed_p1_before')}<strong className="text-[#00DF59]">{t('radio.modal_closed_p1_brand')}</strong>{t('radio.modal_closed_p1_after')}
                  </p>
                  <p className="text-gray-400 font-mono text-xs leading-relaxed border-l-4 border-[#FFE600] pl-3 py-1">
                    {t('radio.modal_closed_p2')}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/10 flex justify-end">
                  <button 
                    onClick={() => setShowRecadoModal(false)}
                    className="px-6 py-2.5 bg-[#FFE600] text-black font-black uppercase text-xs md:text-sm tracking-widest hover:bg-white transition-colors"
                  >
                    {t('radio.modal_return')}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
