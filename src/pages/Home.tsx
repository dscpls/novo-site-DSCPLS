import React from 'react';
import { motion } from 'motion/react';

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="w-full relative min-h-[60vh] flex flex-col items-center justify-center pt-10 pb-20"
    >
      {/* Complex atmospheric background - positioned fixed/absolute so it doesn't break flow */}
      <div className="fixed inset-0 z-[-1] overflow-hidden flex items-center justify-center pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#110000] via-[#050000] to-[#000000] opacity-80 mix-blend-multiply"></div>
        
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3] 
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-900/10 rounded-full blur-[100px]"
        ></motion.div>

        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black to-transparent opacity-90 z-0"></div>
      </div>

      {/* Main Home Content that fades in later */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1 }}
        className="w-full max-w-5xl flex flex-col gap-12 relative z-10"
      >
        {/* Lançamento: Brigas Fúteis */}
        <div className="w-full flex flex-col md:flex-row gap-12 items-center bg-[#0a0a0a]/60 p-8 md:p-12 border border-white/5 backdrop-blur-md rounded-lg shadow-2xl">
          <div className="flex-1 space-y-6">
            <div className="inline-block border border-[#ff3e3e] text-[#ff3e3e] px-4 py-1 text-xs tracking-[0.2em]">
              NOVO LANÇAMENTO
            </div>
            <h1 className="text-4xl md:text-5xl font-light tracking-tight text-white mb-4">BRIGAS FÚTEIS</h1>
            <p className="text-gray-400 font-light leading-relaxed text-sm md:text-base">
              O novo single <strong className="text-white">"BRIGAS FÚTEIS"</strong> já está disponível. Assista ao conteúdo oficial e mergulhe em mais um fragmento audiovisual do projeto DSCPLS.
            </p>
            <div className="pt-2">
               <a href="https://open.spotify.com/intl-pt/album/7lh4Vx29QbXMNAfUEu2E5y?si=vs4YVpTSRWiPkkL4459I2Q" target="_blank" rel="noopener noreferrer" className="text-[#1db954] hover:text-[#000] border border-[#1db954] px-6 py-2 hover:bg-[#1db954] transition-all tracking-widest text-xs inline-block">
                OUVIR NO SPOTIFY
               </a>
            </div>
          </div>
          <div className="w-full md:w-1/2 flex items-center justify-center relative">
            <div className="absolute inset-0 bg-[#ff3e3e]/20 blur-3xl rounded-full"></div>
            <iframe 
              className="w-full aspect-video border border-white/10 relative z-10 shadow-[0_0_30px_rgba(255,0,0,0.1)] rounded-sm grayscale hover:grayscale-0 transition-all duration-700"
              src="https://www.youtube.com/embed/_RHGBo6Mqpg" 
              title="BRIGAS FÚTEIS" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>
        </div>

        {/* Anterior: flores */}
        <div className="w-full flex flex-col md:flex-row-reverse gap-12 items-center bg-[#0a0a0a]/60 p-8 md:p-12 border border-white/5 backdrop-blur-md rounded-lg shadow-2xl mt-8">
          <div className="flex-1 space-y-6">
            <div className="inline-block border border-gray-500 text-gray-500 px-4 py-1 text-xs tracking-[0.2em]">
              DEZEMBRO DE 2025
            </div>
            <h1 className="text-4xl md:text-5xl font-light tracking-tight text-white mb-4">flores</h1>
            <p className="text-gray-400 font-light leading-relaxed text-sm md:text-base">
              Uma peça mais antiga do quebra-cabeça. Explore a atmosfera estética de <strong className="text-white">"flores"</strong> na íntegra.
            </p>
          </div>
          <div className="w-full md:w-1/2 flex items-center justify-center relative">
            <div className="absolute inset-0 bg-blue-900/10 blur-3xl rounded-full"></div>
            <iframe 
              className="w-full aspect-video border border-white/10 relative z-10 rounded-sm opacity-80 hover:opacity-100 transition-opacity duration-700 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]"
              src="https://www.youtube.com/embed/WtwCkBN3i-M" 
              title="flores" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
