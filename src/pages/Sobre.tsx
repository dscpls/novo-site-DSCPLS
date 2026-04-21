import React from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Sobre() {
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="max-w-6xl mx-auto pt-10 pb-40"
    >
      {/* ORIGEM / MANIFESTO */}
      <section className="mb-24">
        <div className="flex items-center gap-4 mb-10">
          <h1 className="text-4xl md:text-6xl tracking-tighter font-black text-white uppercase">{t('sobre.title')}</h1>
          <div className="h-[4px] flex-1 bg-white/20"></div>
        </div>

        <div className="columns-1 md:columns-2 gap-12 space-y-6 text-base md:text-lg leading-relaxed text-gray-300 font-bold">
          <p>
            {t('sobre.p1')}
          </p>
          <p>
            {t('sobre.p2')}
          </p>
          <p>
            {t('sobre.p3')}
          </p>
          <p>
            {t('sobre.p4')}
          </p>
          
          <div className="w-full break-inside-avoid my-8 border-4 border-white relative overflow-hidden group">
            <img 
              src="https://i.imgur.com/6if7kHL.jpeg" 
              alt="Henriz e Gebriel" 
              className="w-full h-auto object-cover transition-all duration-300"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;utf8,%3CSVG xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%22 height=%22100%22 filter=%22url(%23n)%22 opacity=%220.3%22/%3E%3C/SVG%3E')] pointer-events-none mix-blend-overlay"></div>
            <span className="absolute bottom-4 left-4 bg-black text-white px-3 py-1 font-mono text-xs border border-white/30 tracking-widest uppercase shadow-md">{t('sobre.img_caption')}</span>
          </div>

          <p>
            {t('sobre.p5')}
          </p>
          <p>
            {t('sobre.p6')}
          </p>
        </div>
      </section>

      {/* MEMBROS */}
      <section className="mb-24">
        <div className="flex items-center gap-4 mb-10">
          <div className="h-[4px] flex-1 bg-white/20"></div>
          <h1 className="text-4xl md:text-6xl tracking-tighter font-black text-white uppercase">{t('sobre.members')}</h1>
          <div className="h-[4px] flex-1 bg-white/20"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* HENRIZ */}
          <div className="bg-[#111] border-4 border-white flex flex-col relative group">
            <div className="absolute top-0 right-0 bg-white text-black px-4 py-1 font-black uppercase text-xl z-20 border-b-4 border-l-4 border-white group-hover:bg-red-500 group-hover:text-white transition-colors">
              01
            </div>
            
            {/* Foto Placeholder */}
            <div className="w-full aspect-[4/3] bg-[#222] border-b-4 border-white relative overflow-hidden flex items-center justify-center transition-all duration-500">
              <img 
                src="https://i.imgur.com/7szM0kT.jpeg" 
                alt="Henriz" 
                className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-screen"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;utf8,%3CSVG xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%22 height=%22100%22 filter=%22url(%23n)%22 opacity=%220.3%22/%3E%3C/SVG%3E')] pointer-events-none mix-blend-overlay"></div>
            </div>
            
            <div className="p-8 flex-1 flex flex-col">
              <h2 className="text-5xl font-black uppercase tracking-tighter mb-2">HENRIZ</h2>
              <div className="flex flex-wrap gap-2 mb-6">
                 <span className="bg-[#ff3e3e] text-white px-2 py-1 text-xs font-bold font-mono uppercase">{t('sobre.henriz.role1')}</span>
                 <span className="border border-white/30 px-2 py-1 text-xs font-bold font-mono uppercase">{t('sobre.henriz.role2')}</span>
                 <span className="border border-white/30 px-2 py-1 text-xs font-bold font-mono uppercase">{t('sobre.henriz.role3')}</span>
              </div>
              <div className="text-sm font-mono text-gray-400 mb-6 uppercase border-l-4 border-[#ff3e3e] pl-4">
                {t('sobre.henriz.loc')}
              </div>
              <p className="text-gray-300 font-bold leading-relaxed mb-6">
                {t('sobre.henriz.desc')}
              </p>
              
              <div className="mt-auto pt-6 border-t font-mono border-white/20">
                <p className="text-xs text-gray-500 italic">
                  <span className="text-red-500 not-italic font-bold">{t('sobre.henriz.note_title')}</span> {t('sobre.henriz.note')}
                </p>
              </div>
            </div>
          </div>

          {/* GEBRIEL */}
          <div className="bg-[#111] border-4 border-white flex flex-col relative group mt-12 md:mt-0">
             <div className="absolute top-0 right-0 bg-white text-black px-4 py-1 font-black uppercase text-xl z-20 border-b-4 border-l-4 border-white group-hover:bg-[#00ffff] group-hover:text-black transition-colors">
              02
            </div>
            
            {/* Foto Placeholder */}
            <div className="w-full aspect-[4/3] bg-[#222] border-b-4 border-white relative overflow-hidden flex items-center justify-center transition-all duration-500">
              <img 
                src="https://i.imgur.com/BHaiolL.png" 
                alt="Gebriel" 
                className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-screen"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;utf8,%3CSVG xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%22 height=%22100%22 filter=%22url(%23n)%22 opacity=%220.3%22/%3E%3C/SVG%3E')] pointer-events-none mix-blend-overlay"></div>
            </div>
            
            <div className="p-8 flex-1 flex flex-col">
              <h2 className="text-5xl font-black uppercase tracking-tighter mb-2">GEBRIEL</h2>
              <div className="flex flex-wrap gap-2 mb-6">
                 <span className="bg-[#00ffff] text-black px-2 py-1 text-xs font-bold font-mono uppercase">{t('sobre.gebriel.role1')}</span>
              </div>
              <div className="text-sm font-mono text-gray-400 mb-6 uppercase border-l-4 border-[#00ffff] pl-4">
                {t('sobre.gebriel.loc')}
              </div>
              <p className="text-gray-300 font-bold leading-relaxed mb-6">
                {t('sobre.gebriel.desc')}
              </p>
              
              <div className="mt-auto pt-6 border-t font-mono border-white/20">
                <p className="text-xs text-gray-500 italic">
                  <span className="text-teal-400 not-italic font-bold">{t('sobre.gebriel.note_title')}</span> {t('sobre.gebriel.note.p1')}
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* REDES SOCIAIS E NETWORK */}
      <section className="mb-10">
        <div className="flex items-center gap-4 mb-10">
          <h1 className="text-4xl md:text-6xl tracking-tighter font-black text-white uppercase">{t('sobre.network')}</h1>
          <div className="h-[4px] flex-1 bg-white/20"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {/* DSCPLS */}
           <a href="https://instagram.com/discipulosabanda" target="_blank" rel="noopener noreferrer" className="group bg-white text-black p-8 border-4 border-transparent hover:border-black hover:bg-black hover:text-white transition-all shadow-[8px_8px_0_#ff3e3e] hover:shadow-[12px_12px_0_#00ffff]">
              <div className="text-sm font-mono font-bold uppercase mb-4 text-gray-500 group-hover:text-gray-400">{t('sobre.net_ig1')}</div>
              <h3 className="text-4xl font-black uppercase tracking-tighter">@DISCIPULOSA<br/>BANDA</h3>
           </a>
           
           <a href="https://youtube.com/@ABandaDISCIPULOS" target="_blank" rel="noopener noreferrer" className="group bg-[#ff0000] text-white p-8 border-4 border-transparent hover:border-white transition-all shadow-[8px_8px_0_#000]">
              <div className="text-sm font-mono font-bold uppercase mb-4 text-white/70 group-hover:text-white">{t('sobre.net_yt')}</div>
              <h3 className="text-4xl font-black uppercase tracking-tighter">OS DISCIPULOS</h3>
           </a>

           <a href="https://tiktok.com/@discipulosabanda" target="_blank" rel="noopener noreferrer" className="group bg-black text-white p-8 border-4 border-[#ff0050] hover:bg-[#00f2fe] hover:text-black hover:border-black transition-all shadow-[8px_8px_0_#fff]">
              <div className="text-sm font-mono font-bold uppercase mb-4 text-gray-400 group-hover:text-black/70">{t('sobre.net_tt1')}</div>
              <h3 className="text-4xl font-black uppercase tracking-tighter">{t('sobre.net_tt2')}</h3>
           </a>

           {/* PESSOAL */}
           <a href="https://instagram.com/gqnzaroli" target="_blank" rel="noopener noreferrer" className="group bg-[#111] border-4 border-[#333] text-white p-8 hover:bg-[#ff3e3e] hover:border-[#ff3e3e] transition-all">
              <div className="text-sm font-mono font-bold uppercase mb-4 text-gray-500 group-hover:text-white/80">{t('sobre.net_ig2')}</div>
              <h3 className="text-3xl font-black uppercase tracking-tighter mb-2">HENRIZ</h3>
              <p className="font-mono text-sm text-gray-400 group-hover:text-white">@gqnzaroli</p>
           </a>

           <a href="https://instagram.com/o.garibel" target="_blank" rel="noopener noreferrer" className="group bg-[#111] border-4 border-[#333] text-white p-8 hover:bg-[#00ffff] hover:border-[#00ffff] hover:text-black transition-all">
              <div className="text-sm font-mono font-bold uppercase mb-4 text-gray-500 group-hover:text-black/80">{t('sobre.net_ig2')}</div>
              <h3 className="text-3xl font-black uppercase tracking-tighter mb-2">GEBRIEL</h3>
              <p className="font-mono text-sm text-gray-400 group-hover:text-black">@o.garibel</p>
           </a>
        </div>
      </section>

    </motion.div>
  );
}
