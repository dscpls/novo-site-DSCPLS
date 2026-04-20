import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Bonus() {
  const [revealed, setRevealed] = useState(false);
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="min-h-[80vh] flex flex-col items-center justify-center p-6 w-full"
    >
      <motion.div 
        layout
        onClick={() => setRevealed(true)}
        className={`cursor-pointer ${!revealed ? 'animate-pulse' : ''}`}
        animate={revealed ? { scale: 0.3, y: -50 } : { scale: 1, y: 0 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      >
        <img 
          src="https://i.imgur.com/P2TTE1s.png" 
          alt="DSCPLS Logo" 
          className="w-[200px] md:w-[280px] drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] active:scale-95"
        />
      </motion.div>

      <AnimatePresence>
        {revealed && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="w-full max-w-5xl flex flex-col gap-16 pb-20"
          >
            <div className="flex flex-col md:flex-row items-center gap-8 bg-[#111] p-8 border-4 border-white/20">
              <p className="text-white font-bold text-lg md:text-xl leading-relaxed flex-1">
                {t('bonus.p1')} <span className="text-[#ff3e3e]">{t('bonus.p2')}</span> {t('bonus.p3')}
              </p>
              <img src="https://i.imgur.com/18NBD10.png" alt="Assinatura Henriz" className="h-24 md:h-32 object-contain filter invert" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Eros */}
              <div className="flex flex-col gap-4">
                <h3 className="text-2xl font-black uppercase text-white tracking-tighter">eros (visualizer)</h3>
                <div className="w-full aspect-video border-4 border-white/10 bg-black">
                  <iframe className="w-full h-full" src="https://www.youtube.com/embed/8evJDQapvHs" title="eros visualizer" allowFullScreen></iframe>
                </div>
              </div>

              {/* Farol */}
              <div className="flex flex-col gap-4">
                <h3 className="text-2xl font-black uppercase text-white tracking-tighter">farol (clipe original)</h3>
                <div className="w-full aspect-video border-4 border-white/10 bg-black">
                  <iframe className="w-full h-full" src="https://www.youtube.com/embed/OEIS-xgXQzs" title="farol clipe" allowFullScreen></iframe>
                </div>
              </div>
            </div>

            {/* Flores com Fato Curioso */}
            <div className="flex flex-col md:flex-row gap-8 items-center bg-[#050505] p-8 border-4 border-[#ff3e3e]/30">
              <div className="flex-1 flex flex-col gap-2">
                <h3 className="text-3xl font-black uppercase text-white tracking-tighter mb-2">flores</h3>
                <div className="bg-black/50 p-6 border-l-4 border-[#ff3e3e]">
                  <p className="text-gray-300 font-bold leading-relaxed text-sm md:text-base">
                    <span className="text-[#ff3e3e]">{t('bonus.fact_title')}</span> {t('bonus.fact1')}
                    <br/><br/>
                    <span className="text-white font-mono">- Henriz</span>
                  </p>
                </div>
              </div>
              <div className="w-full md:w-3/5 aspect-[16/9] border-4 border-white/10 bg-black shrink-0 relative">
                <iframe className="absolute inset-0 w-full h-full" src="https://www.youtube.com/embed/WtwCkBN3i-M" title="flores" allowFullScreen></iframe>
              </div>
            </div>

            {/* Calmaria ANTES DA TEMPESTADE */}
            <div className="flex flex-col md:flex-row gap-8 items-center bg-[#00ffff]/5 p-8 border-4 border-[#00ffff]/30">
              <div className="w-full md:w-1/2 aspect-video border-4 border-white/10 bg-black shrink-0">
                <iframe className="w-full h-full grayscale hover:grayscale-0 transition-all duration-500" src="https://drive.google.com/file/d/1XZPC9qJ6Iis7l0ItTKp-xe-LSBQWL-I5/preview" title="calmaria" allowFullScreen></iframe>
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <h3 className="text-3xl lg:text-4xl font-black uppercase text-white tracking-tighter mb-2">A Calmaria Antes da Tempestade</h3>
                <span className="text-[#00ffff] font-mono font-bold tracking-widest text-sm mb-4 block">UNRELEASED / CRINGE</span>
                <p className="text-gray-400 font-bold leading-relaxed">
                  {t('bonus.fact2')}
                </p>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
