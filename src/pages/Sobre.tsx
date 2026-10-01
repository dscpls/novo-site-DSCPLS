import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { ArrowUpRight } from 'lucide-react';

export default function Sobre() {
  const { t } = useLanguage();

  return (
    <div className="w-full pb-24 space-y-16">
      
      {/* Header */}
      <div className="border-b-2 border-[#FFFFFF]/15 pb-6">
        <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white">
          {t('sobre.title')}
        </h1>
      </div>

      {/* Narrative Section */}
      <section className="space-y-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
          
          {/* Main Narrative Text */}
          <div className="lg:col-span-7 space-y-6 text-[#E0E0E0] font-sans text-base sm:text-lg leading-relaxed">
            <p className="font-medium text-white text-lg sm:text-xl leading-relaxed border-l-2 border-[#00DF59] pl-4">
              {t('sobre.p1')}
            </p>
            <p className="text-[#E0E0E0]/85">
              {t('sobre.p2')}
            </p>
            <p className="text-[#E0E0E0]/85">
              {t('sobre.p3')}
            </p>
            <p className="text-[#E0E0E0]/85">
              {t('sobre.p4')}
            </p>
          </div>

          {/* Archival Photo with short factual caption */}
          <div className="lg:col-span-5 space-y-3">
            <div className="border-2 border-[#FFFFFF]/20 bg-[#111111] p-3 shadow-xl">
              <div className="aspect-[4/3] bg-black overflow-hidden relative">
                <img 
                  src="https://i.imgur.com/6if7kHL.jpeg" 
                  alt="Henriz e Gebriel na Liberdade, São Paulo"
                  className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-500"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = "/henriz.jpg";
                  }}
                />
              </div>
            </div>

            <p className="font-mono text-xs text-[#E0E0E0]/70">
              {t('sobre.duo_caption')}
            </p>
          </div>

        </div>

        {/* Story Continuation */}
        <div className="border-t-2 border-[#FFFFFF]/10 pt-8 grid grid-cols-1 md:grid-cols-2 gap-8 text-[#E0E0E0]/85 text-base leading-relaxed">
          <div>
            <p>{t('sobre.p5')}</p>
          </div>
          <div>
            <p>{t('sobre.p6')}</p>
          </div>
        </div>

      </section>

      {/* =========================================================================
          MEMBROS DA BANDA
         ========================================================================= */}
      <section className="space-y-8 pt-8 border-t-2 border-[#FFFFFF]/15">
        
        <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
          {t('sobre.members')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* HENRIZ */}
          <article className="border-2 border-[#FFFFFF]/15 bg-[#111111] flex flex-col justify-between">
            <div>
              {/* Photo Area: Portrait proportion showing Henriz clearly in the lower/mid region */}
              <div className="aspect-[3/4] sm:aspect-[4/5] bg-[#0c0c0c] border-b-2 border-[#FFFFFF]/15 overflow-hidden relative">
                <img 
                  src="/henriz.jpg" 
                  alt="Henriz"
                  className="w-full h-full object-cover object-[center_65%] grayscale hover:grayscale-0 transition-all duration-500"
                  onError={(e) => {
                    e.currentTarget.src = "https://i.imgur.com/7szM0kT.jpeg";
                  }}
                />
              </div>

              {/* Info */}
              <div className="p-6 md:p-8 space-y-4">
                <div>
                  <h3 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white mb-2">
                    HENRIZ
                  </h3>
                  <div className="flex flex-wrap gap-2 font-mono text-xs uppercase text-[#E0E0E0]/70">
                    <span className="text-[#00DF59] font-bold">{t('sobre.henriz.role1')}</span>
                    <span aria-hidden="true">·</span>
                    <span>{t('sobre.henriz.role2')}</span>
                    <span aria-hidden="true">·</span>
                    <span>{t('sobre.henriz.role3')}</span>
                  </div>
                </div>

                <div className="font-mono text-xs text-[#E0E0E0]/60">
                  {t('sobre.henriz.loc')}
                </div>

                <p className="text-sm sm:text-base text-[#E0E0E0]/85 font-sans leading-relaxed">
                  {t('sobre.henriz.desc')}
                </p>
              </div>
            </div>

            {/* Note Quote */}
            <div className="p-6 md:p-8 pt-0">
              <div className="p-4 border border-[#FFFFFF]/15 bg-[#080706] font-mono text-xs leading-relaxed text-[#E0E0E0]/75">
                <span className="text-[#00DF59] font-bold block mb-1">{t('sobre.henriz.note_title')}</span>
                {t('sobre.henriz.note')}
              </div>
            </div>
          </article>

          {/* GEBRIEL */}
          <article className="border-2 border-[#FFFFFF]/15 bg-[#111111] flex flex-col justify-between">
            <div>
              {/* Photo Area: Preserving full face (eyes, nose, mouth, chin) */}
              <div className="aspect-[3/4] sm:aspect-[4/5] bg-[#0c0c0c] border-b-2 border-[#FFFFFF]/15 overflow-hidden relative">
                <img 
                  src="/gebriel.webp" 
                  alt="Gebriel"
                  className="w-full h-full object-cover object-[center_25%] grayscale hover:grayscale-0 transition-all duration-500"
                  onError={(e) => {
                    e.currentTarget.src = "https://i.imgur.com/BHaiolL.png";
                  }}
                />
              </div>

              {/* Info */}
              <div className="p-6 md:p-8 space-y-4">
                <div>
                  <h3 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white mb-2">
                    GEBRIEL
                  </h3>
                  <div className="flex flex-wrap gap-2 font-mono text-xs uppercase text-[#E0E0E0]/70">
                    <span className="text-[#FFE600] font-bold">{t('sobre.gebriel.role1')}</span>
                    <span aria-hidden="true">·</span>
                    <span>{t('sobre.gebriel.role2')}</span>
                    <span aria-hidden="true">·</span>
                    <span>{t('sobre.gebriel.role3')}</span>
                  </div>
                </div>

                <div className="font-mono text-xs text-[#E0E0E0]/60">
                  {t('sobre.gebriel.loc')}
                </div>

                <p className="text-sm sm:text-base text-[#E0E0E0]/85 font-sans leading-relaxed">
                  {t('sobre.gebriel.desc')}
                </p>
              </div>
            </div>

            {/* Note Quote */}
            <div className="p-6 md:p-8 pt-0">
              <div className="p-4 border border-[#FFFFFF]/15 bg-[#080706] font-mono text-xs leading-relaxed text-[#E0E0E0]/75">
                <span className="text-[#FFE600] font-bold block mb-1">{t('sobre.gebriel.note_title')}</span>
                {t('sobre.gebriel.note.p1')}
              </div>
            </div>
          </article>

        </div>

      </section>

      {/* =========================================================================
          A REDE
         ========================================================================= */}
      <section className="space-y-6 pt-8 border-t-2 border-[#FFFFFF]/15">
        <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
          {t('sobre.network')}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          
          <a
            href="https://instagram.com/discipulosabanda"
            target="_blank"
            rel="noopener noreferrer"
            className="p-5 border-2 border-[#FFFFFF]/15 bg-[#111111] hover:border-[#00DF59] transition-colors flex items-center justify-between group"
          >
            <div>
              <div className="font-mono text-[11px] text-[#00DF59] uppercase tracking-wider mb-1">
                {t('sobre.net_ig1')}
              </div>
              <div className="font-bold text-lg text-white group-hover:text-[#00DF59] transition-colors">
                @discipulosabanda
              </div>
            </div>
            <ArrowUpRight size={18} className="text-[#E0E0E0]/40 group-hover:text-[#00DF59] transition-colors" />
          </a>

          <a
            href="https://youtube.com/@ABandaDISCIPULOS"
            target="_blank"
            rel="noopener noreferrer"
            className="p-5 border-2 border-[#FFFFFF]/15 bg-[#111111] hover:border-red-500 transition-colors flex items-center justify-between group"
          >
            <div>
              <div className="font-mono text-[11px] text-red-400 uppercase tracking-wider mb-1">
                {t('sobre.net_yt')}
              </div>
              <div className="font-bold text-lg text-white group-hover:text-red-400 transition-colors">
                DISCÍPULOS
              </div>
            </div>
            <ArrowUpRight size={18} className="text-[#E0E0E0]/40 group-hover:text-red-400 transition-colors" />
          </a>

          <a
            href="https://instagram.com/radiolixobrasileiro"
            target="_blank"
            rel="noopener noreferrer"
            className="p-5 border-2 border-[#FFFFFF]/15 bg-[#111111] hover:border-[#FFE600] transition-colors flex items-center justify-between group"
          >
            <div>
              <div className="font-mono text-[11px] text-[#FFE600] uppercase tracking-wider mb-1">
                {t('sobre.net_radio_ig')}
              </div>
              <div className="font-bold text-lg text-white group-hover:text-[#FFE600] transition-colors">
                @radiolixobrasileiro
              </div>
            </div>
            <ArrowUpRight size={18} className="text-[#E0E0E0]/40 group-hover:text-[#FFE600] transition-colors" />
          </a>

          <a
            href="https://tiktok.com/@discipulosabanda"
            target="_blank"
            rel="noopener noreferrer"
            className="p-5 border-2 border-[#FFFFFF]/15 bg-[#111111] hover:border-[#FFE600] transition-colors flex items-center justify-between group"
          >
            <div>
              <div className="font-mono text-[11px] text-[#FFE600] uppercase tracking-wider mb-1">
                TIKTOK
              </div>
              <div className="font-bold text-lg text-white group-hover:text-[#FFE600] transition-colors">
                @discipulosabanda
              </div>
            </div>
            <ArrowUpRight size={18} className="text-[#E0E0E0]/40 group-hover:text-[#FFE600] transition-colors" />
          </a>

          <a
            href="https://instagram.com/gqnzaroli"
            target="_blank"
            rel="noopener noreferrer"
            className="p-5 border-2 border-[#FFFFFF]/15 bg-[#111111] hover:border-[#00DF59] transition-colors flex items-center justify-between group"
          >
            <div>
              <div className="font-mono text-[11px] text-[#E0E0E0]/60 uppercase tracking-wider mb-1">
                Henriz ({t('sobre.personal')})
              </div>
              <div className="font-bold text-base text-white group-hover:text-[#00DF59] transition-colors">
                @gqnzaroli
              </div>
            </div>
            <ArrowUpRight size={16} className="text-[#E0E0E0]/40 group-hover:text-[#00DF59] transition-colors" />
          </a>

          <a
            href="https://instagram.com/o.garibel"
            target="_blank"
            rel="noopener noreferrer"
            className="p-5 border-2 border-[#FFFFFF]/15 bg-[#111111] hover:border-[#FFE600] transition-colors flex items-center justify-between group"
          >
            <div>
              <div className="font-mono text-[11px] text-[#E0E0E0]/60 uppercase tracking-wider mb-1">
                Gebriel ({t('sobre.personal')})
              </div>
              <div className="font-bold text-base text-white group-hover:text-[#FFE600] transition-colors">
                @o.garibel
              </div>
            </div>
            <ArrowUpRight size={16} className="text-[#E0E0E0]/40 group-hover:text-[#FFE600] transition-colors" />
          </a>

          <a
            href="mailto:discipulosabanda@gmail.com"
            className="p-5 border-2 border-[#FFFFFF]/15 bg-[#111111] hover:border-white transition-colors flex items-center justify-between group"
          >
            <div>
              <div className="font-mono text-[11px] text-[#E0E0E0]/60 uppercase tracking-wider mb-1">
                {t('sobre.contact')}
              </div>
              <div className="font-mono text-sm font-bold text-white group-hover:text-white transition-colors truncate">
                discipulosabanda@gmail.com
              </div>
            </div>
            <ArrowUpRight size={16} className="text-[#E0E0E0]/40 group-hover:text-white transition-colors" />
          </a>

        </div>

      </section>

    </div>
  );
}
