import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Volume2, VolumeX, MessageSquare, ArrowRight, Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import AudioVisualizer from '../components/AudioVisualizer';
import RadioMessageModal from '../components/RadioMessageModal';

// =========================================================================
// RÁDIO LIXO BRASILEIRO - ROTAÇÃO DE FAIXAS
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
    title: 'SANTINHO / carta pra alguém do passado',
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

// Vinhetas da Rádio
const RADIO_TAGS = [
  {
    id: 'tag-1',
    url: 'https://audio.jukehost.co.uk/01a00228-831d-723d-b3a1-5456ae3d9a68',
    triggerSongAt: 0.5,
  },
  {
    id: 'tag-2',
    url: 'https://audio.jukehost.co.uk/01a00228-8b0d-7205-8d72-2643c0e7dffe',
    triggerSongAt: 1.2,
  },
];

export default function Radio() {
  const { t } = useLanguage();
  const [currentTrackIdx, setCurrentTrackIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.85);
  const [showRecadoModal, setShowRecadoModal] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [currentTimeStr, setCurrentTimeStr] = useState('00:00');
  const [durationStr, setDurationStr] = useState('00:00');

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const tagAudioRef = useRef<HTMLAudioElement | null>(null);
  const recadoBtnRef = useRef<HTMLButtonElement | null>(null);
  const isTransitioningRef = useRef(false);
  const fallbackTimeoutRef = useRef<any>(null);

  const currentTrack = RADIO_PLAYLIST[currentTrackIdx];

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const changeToTrack = (targetIndex: number) => {
    if (fallbackTimeoutRef.current) {
      clearTimeout(fallbackTimeoutRef.current);
      fallbackTimeoutRef.current = null;
    }

    isTransitioningRef.current = true;

    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (tagAudioRef.current) {
      tagAudioRef.current.pause();
      tagAudioRef.current.onended = null;
      tagAudioRef.current.ontimeupdate = null;
    }

    setCurrentTrackIdx(targetIndex);
    setAudioProgress(0);
    setCurrentTimeStr('00:00');

    if (audioRef.current) {
      audioRef.current.src = RADIO_PLAYLIST[targetIndex].audioUrl;
      audioRef.current.load();
    }

    const chosenTagIdx = Math.floor(Math.random() * RADIO_TAGS.length);
    const selectedTag = RADIO_TAGS[chosenTagIdx];

    const tagAudio = tagAudioRef.current;
    if (!tagAudio) {
      if (audioRef.current) {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
      isTransitioningRef.current = false;
      return;
    }

    let songStarted = false;

    const startSong = () => {
      if (songStarted) return;
      songStarted = true;
      isTransitioningRef.current = false;

      if (fallbackTimeoutRef.current) {
        clearTimeout(fallbackTimeoutRef.current);
        fallbackTimeoutRef.current = null;
      }

      if (audioRef.current) {
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch((err) => {
            console.warn('Playback error:', err);
            setIsPlaying(false);
          });
      }
    };

    tagAudio.src = selectedTag.url;
    tagAudio.currentTime = 0;
    tagAudio.volume = isMuted ? 0 : volume;

    tagAudio.ontimeupdate = () => {
      if (tagAudio.currentTime >= selectedTag.triggerSongAt) {
        tagAudio.ontimeupdate = null;
        startSong();
      }
    };

    tagAudio.onended = () => {
      startSong();
    };

    fallbackTimeoutRef.current = setTimeout(() => {
      startSong();
    }, 4000);

    tagAudio.play().catch(() => {
      startSong();
    });
  };

  const handleNextTrack = () => {
    const nextIdx = (currentTrackIdx + 1) % RADIO_PLAYLIST.length;
    changeToTrack(nextIdx);
  };

  const handlePrevTrack = () => {
    const prevIdx = (currentTrackIdx - 1 + RADIO_PLAYLIST.length) % RADIO_PLAYLIST.length;
    changeToTrack(prevIdx);
  };

  const handleTogglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      if (tagAudioRef.current) tagAudioRef.current.pause();
      setIsPlaying(false);
    } else {
      audio.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.warn('Play interrupted:', err);
        });
    }
  };

  // Sync volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
    if (tagAudioRef.current) {
      tagAudioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Audio listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        const prog = (audio.currentTime / audio.duration) * 100;
        setAudioProgress(prog);
        setCurrentTimeStr(formatTime(audio.currentTime));
        setDurationStr(formatTime(audio.duration));
      }
    };

    const handleEnded = () => {
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
  }, [currentTrackIdx]);

  // Initial playback on mount
  useEffect(() => {
    if (audioRef.current) {
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
    };
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-[75vh] py-6 relative select-none">
      
      {/* Hidden audio elements */}
      <audio ref={audioRef} src={currentTrack.audioUrl} preload="auto" />
      <audio ref={tagAudioRef} preload="auto" />

      {/* =========================================================================
          📻 PHYSICAL RADIO CHASSIS
         ========================================================================= */}
      <div className="w-full max-w-3xl">
        
        {/* Outer Wooden Body */}
        <div className="bg-[#24150c] border-[6px] border-[#382012] p-5 sm:p-7 shadow-xl">
          
          {/* Radio Top: Brass Nameplate (Appears once) */}
          <div className="flex items-center justify-between border-b-2 border-[#3d2415] pb-4 mb-5">
            <div className="bg-[#b88c42] text-black px-4 py-1 font-title font-bold text-xs uppercase tracking-[0.2em] shadow-sm">
              RÁDIO LIXO BRASILEIRO
            </div>

            <div className="font-mono text-xs text-[#d6a858]/80 tabular-nums">
              FAIXA {currentTrackIdx + 1} DE {RADIO_PLAYLIST.length}
            </div>
          </div>

          {/* Radio Interior: Speaker + Main Area */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
            
            {/* Desktop Left / Mobile Bottom: Compact Speaker Grill */}
            <div className="order-2 md:order-1 md:col-span-4 bg-[#140e09] border border-[#3d2415] p-4 flex flex-col items-center justify-center relative overflow-hidden min-h-[160px]">
              {/* Speaker mesh texture */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-[#2b180d] bg-[#0c0805] flex items-center justify-center">
                <div className={`w-14 h-14 rounded-full border-2 border-[#472c1a] bg-[#1a110a] flex items-center justify-center ${isPlaying ? 'scale-105' : 'scale-100'} transition-transform duration-300`}>
                  <div className="w-6 h-6 rounded-full bg-black/80"></div>
                </div>
              </div>
            </div>

            {/* Desktop Right / Mobile Top: Tuning Scale + Display + Controls */}
            <div className="order-1 md:order-2 md:col-span-8 flex flex-col justify-between gap-4">
              
              {/* Single Analog Tuning Scale (94.7 FM appears strictly once) */}
              <div className="bg-[#0e0906] border border-[#3d2415] px-3.5 py-2">
                <div className="flex justify-between font-mono text-[11px] text-[#FFE600] font-bold tracking-wider">
                  <span>88</span>
                  <span>92</span>
                  <span className="text-[#00DF59] font-black underline decoration-2 underline-offset-2">94.7 FM</span>
                  <span>98</span>
                  <span>104</span>
                  <span>108</span>
                </div>
                {/* Scale Needle Indicator */}
                <div className="relative w-full h-1.5 bg-[#20140b] mt-1.5">
                  <div className="absolute top-0 bottom-0 left-[34%] w-0.5 bg-[#00DF59]"></div>
                </div>
              </div>

              {/* Single Integrated Digital Display (Track, Artist, Time, Visualizer) */}
              <div className="bg-[#050403] border-2 border-[#2b180d] p-4 space-y-3">
                <div className="flex flex-col gap-1">
                  <div className="font-title text-sm sm:text-base font-bold text-[#00DF59] tracking-tight leading-snug break-words">
                    {currentTrack.title}
                  </div>
                  <div className="font-mono text-xs text-[#d6a858]/90">
                    {currentTrack.artist}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-[#17100a] h-1.5 overflow-hidden">
                  <div 
                    className="h-full bg-[#00DF59] transition-all duration-200"
                    style={{ width: `${audioProgress}%` }}
                  ></div>
                </div>

                {/* Bottom row of display: Times + Audio Spectrum Bars */}
                <div className="flex items-center justify-between gap-3 pt-1">
                  <span className="font-mono text-xs text-[#FFE600] tabular-nums">
                    {currentTimeStr} / {durationStr}
                  </span>

                  {/* Discreet Audio Visualizer */}
                  <div className="w-28 sm:w-36 h-5">
                    <AudioVisualizer isPlaying={isPlaying} powerOn={true} barCount={18} />
                  </div>
                </div>
              </div>

              {/* Grouped Controls: Previous, Play/Pause (Priority), Next + Volume + Recado */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                
                {/* Playback Controls (Grouped Together) */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevTrack}
                    aria-label="Faixa anterior"
                    className="p-2.5 bg-[#17100a] hover:bg-[#2b180d] text-[#FFE600] border border-[#3d2415] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFE600]"
                  >
                    <SkipBack size={16} />
                  </button>

                  {/* Main Play/Pause Button (Highest Visual Priority) */}
                  <button
                    onClick={handleTogglePlay}
                    aria-label={isPlaying ? "Pausar rádio" : "Tocar rádio"}
                    className="flex items-center gap-2 bg-[#00DF59] hover:bg-[#FFE600] text-black font-mono font-bold text-xs uppercase px-5 py-2.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    {isPlaying ? <Pause size={16} fill="black" /> : <Play size={16} fill="black" />}
                    <span>{isPlaying ? 'PAUSAR' : 'TOCAR'}</span>
                  </button>

                  <button
                    onClick={handleNextTrack}
                    aria-label="Próxima faixa"
                    className="p-2.5 bg-[#17100a] hover:bg-[#2b180d] text-[#FFE600] border border-[#3d2415] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFE600]"
                  >
                    <SkipForward size={16} />
                  </button>
                </div>

                {/* Volume Slider */}
                <div className="flex items-center gap-2 bg-[#140e09] px-3 py-2 border border-[#3d2415]">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    aria-label={isMuted ? "Ativar som" : "Silenciar som"}
                    className="text-[#FFE600] hover:text-white transition-colors"
                  >
                    {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    aria-label="Volume da rádio"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => {
                      setVolume(parseFloat(e.target.value));
                      if (isMuted) setIsMuted(false);
                    }}
                    className="w-16 sm:w-20 accent-[#00DF59] cursor-pointer"
                  />
                </div>

                {/* Mandar Recado Action */}
                <button
                  ref={recadoBtnRef}
                  onClick={() => setShowRecadoModal(true)}
                  aria-label="Mandar um recado para o álbum"
                  className="inline-flex items-center gap-1.5 border border-[#00DF59]/50 hover:border-[#00DF59] text-[#00DF59] hover:bg-[#00DF59]/10 font-mono text-xs uppercase px-3 py-2 transition-colors"
                >
                  <MessageSquare size={14} />
                  <span>Mandar recado</span>
                </button>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Discrete return link */}
      <div className="mt-8">
        <Link 
          to="/home" 
          className="inline-flex items-center gap-2 text-[#E0E0E0]/60 hover:text-white font-mono text-xs uppercase tracking-wider transition-colors"
        >
          <span>{t('radio.back_to_site')}</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* Recado Recording Modal */}
      <RadioMessageModal 
        isOpen={showRecadoModal} 
        onClose={() => setShowRecadoModal(false)}
        triggerRef={recadoBtnRef}
      />

    </div>
  );
}
