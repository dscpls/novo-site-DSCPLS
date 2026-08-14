import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';

const normalizeStr = (str: string) => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
};

export default function Quiz() {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [inputVal, setInputVal] = useState('');
  const [errorShake, setErrorShake] = useState(false);
  const [factVisible, setFactVisible] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const questions = [
    {
      q: t('quiz.q1'),
      ans: ["brockhampton"]
    },
    {
      q: t('quiz.q2'),
      ans: ["brockhampton"]
    },
    {
      q: t('quiz.q3'),
      ans: ["discipulos", "dscpls"]
    }
  ];

  const playSound = (success: boolean) => {
     try {
        if (!audioCtxRef.current) {
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          if (!AudioContextClass) return;
          audioCtxRef.current = new AudioContextClass();
        }
        
        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') {
           ctx.resume();
        }

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        if (success) {
           osc.type = 'sine';
           osc.frequency.setValueAtTime(440, ctx.currentTime); 
           osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1); 
           gain.gain.setValueAtTime(0.2, ctx.currentTime);
           gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
           osc.start(ctx.currentTime);
           osc.stop(ctx.currentTime + 0.2);
        } else {
           osc.type = 'sawtooth';
           osc.frequency.setValueAtTime(200, ctx.currentTime); 
           osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.2); 
           gain.gain.setValueAtTime(0.2, ctx.currentTime);
           gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
           osc.start(ctx.currentTime);
           osc.stop(ctx.currentTime + 0.2);
        }
     } catch(e) {
       console.log('Audio error:', e);
     }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep >= questions.length) return;

    const normalizedInput = normalizeStr(inputVal);
    const validAnswers = questions[currentStep].ans;

    if (validAnswers.includes(normalizedInput)) {
      playSound(true);
      setInputVal('');
      setErrorShake(false);
      setCurrentStep(s => s + 1);
    } else {
      playSound(false);
      setErrorShake(true);
      setTimeout(() => setErrorShake(false), 500);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current && audioRef.current.currentTime >= 10 && !factVisible) {
      setFactVisible(true);
    }
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <AnimatePresence mode="wait">
        {currentStep < questions.length ? (
          <motion.div
            key={`q-${currentStep}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1, x: errorShake ? [-10, 10, -10, 10, 0] : 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-2xl"
          >
            <h1 className="text-4xl md:text-6xl font-black uppercase text-white mb-12 tracking-tighter">
              {questions[currentStep].q}
            </h1>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                autoFocus
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder={t('quiz.answer')}
                className="w-full bg-transparent border-b-4 border-white text-3xl md:text-5xl text-center text-[#00DF59] font-black uppercase focus:outline-none focus:border-[#00DF59] transition-colors pb-4 placeholder-white/20"
              />
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="w-full max-w-4xl flex flex-col items-center"
          >
            <h1 className="text-5xl md:text-7xl font-black text-[#FFE600] uppercase mb-6 tracking-tighter drop-shadow-[5px_5px_0_#00DF59] animate-pulse">
              {t('quiz.success')}
            </h1>
            
            <p className="text-xl md:text-2xl font-bold text-white mb-12 uppercase tracking-widest bg-black p-4 border border-white/20">
              {t('quiz.reward')}
            </p>

            <div className="w-full max-w-4xl flex flex-col gap-8 w-full max-w-2xl text-left bg-[#111] border-4 border-[#00DF59] p-6 shadow-[8px_8px_0_#FFE600]">
              <div>
                <h3 className="text-[#00DF59] mb-2 font-bold uppercase tracking-widest text-sm font-mono">BACKGROUND</h3>
                <audio 
                  ref={audioRef}
                  controls 
                  autoPlay 
                  crossOrigin="anonymous"
                  onTimeUpdate={handleTimeUpdate}
                  className="w-full h-10 object-contain"
                  src="https://audio.jukehost.co.uk/7b2arQLYzy4GHB2z68rlbO7oL9r4Kj6a"
                >
                  Seu navegador não suporta o áudio.
                </audio>
              </div>
              <div>
                <h3 className="text-[#FFE600] mb-2 font-bold uppercase tracking-widest text-sm font-mono">BRIGAS FÚTEIS REMIX (feat. NBA Younger & Kaio Valle)</h3>
                <audio 
                  controls 
                  crossOrigin="anonymous"
                  className="w-full h-10 object-contain"
                  src="https://audio.jukehost.co.uk/rl7WpCUpB6B2Fphs3OuFfG2OuKMLoLGm"
                >
                  Seu navegador não suporta o áudio.
                </audio>
              </div>
            </div>

            <AnimatePresence>
              {factVisible && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-12 p-4 border-l-4 border-[#FFE600] bg-black/70 text-left max-w-2xl"
                >
                  <p className="text-gray-300 font-mono text-sm leading-relaxed whitespace-pre-line">
                    <span className="text-[#FFE600] font-bold">fato curioso / fun fact:</span> {t('quiz.fact')}
                    <br/><br/>
                    <span className="text-[#00DF59] font-bold">- Henriz</span>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
