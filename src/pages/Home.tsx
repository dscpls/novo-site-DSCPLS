import React from 'react';
import { Link } from 'react-router-dom';
import { Play, ExternalLink, Radio as RadioIcon, ArrowUpRight, ArrowRight } from 'lucide-react';
import Newsletter from '../components/Newsletter';
import { useLanguage } from '../contexts/LanguageContext';

function MerchCard({
  title,
  imgSrc,
  alt,
  link = "https://dscpls.shop",
  span2 = false,
}: {
  title: string;
  imgSrc: string;
  alt: string;
  link?: string;
  span2?: boolean;
}) {
  const { t } = useLanguage();
  const [hasError, setHasError] = React.useState(false);

  return (
    <a 
      href={link} 
      target="_blank" 
      rel="noopener noreferrer"
      className={`group border-2 border-[#FFFFFF]/15 bg-[#111111] hover:border-white transition-colors flex flex-col ${
        span2 ? 'sm:col-span-2' : ''
      }`}
    >
      <div className={`${span2 ? 'aspect-video md:aspect-[21/9]' : 'aspect-square'} bg-[#080706] p-6 flex items-center justify-center overflow-hidden border-b-2 border-[#FFFFFF]/15 relative`}>
        {!hasError ? (
          <img 
            src={imgSrc} 
            alt={alt} 
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
            referrerPolicy="no-referrer" 
            onError={() => setHasError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-center p-4 space-y-2 border border-dashed border-[#FFFFFF]/20">
            <span className="font-mono text-[10px] text-[#FFE600] border border-[#FFE600]/40 px-2 py-0.5 uppercase tracking-wider">
              CATÁLOGO OFICIAL · DSCPLS.SHOP
            </span>
            <div className="font-title font-bold text-sm sm:text-base text-white uppercase tracking-tight">
              {title}
            </div>
            <span className="font-mono text-[11px] text-[#00DF59] uppercase tracking-wider">
              {t('home.merch.store')}
            </span>
          </div>
        )}
      </div>
      <div className="p-5 flex-1 flex flex-col justify-between">
        <h3 className="font-title font-bold text-sm sm:text-base uppercase tracking-tight text-white group-hover:text-[#00DF59] transition-colors">
          {title}
        </h3>
        <span className="font-mono text-xs text-[#00DF59] uppercase tracking-wider mt-3 inline-block">
          {t('home.merch.store')}
        </span>
      </div>
    </a>
  );
}

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="w-full flex flex-col gap-16 pb-20">
      
      {/* =========================================================================
          1. DESTAQUE PRINCIPAL: SANTINHO / carta pra alguém do passado
         ========================================================================= */}
      <section className="w-full border-2 border-[#FFFFFF]/15 bg-[#111111]">
        
        {/* Release Top Ribbon */}
        <div className="flex items-center justify-between px-6 py-3 border-b-2 border-[#FFFFFF]/15 bg-[#080706] font-mono text-xs uppercase tracking-wider">
          <div className="flex items-center gap-3">
            <span className="inline-block w-2.5 h-2.5 bg-[#00DF59]"></span>
            <span className="font-bold text-[#00DF59]">{t('home.hero.badge')}</span>
            <span aria-hidden="true" className="text-[#FFFFFF]/20">/</span>
            <span className="text-[#E0E0E0]/80">{t('home.hero.release_date')}</span>
          </div>
        </div>

        {/* Main Release Grid: Cover + Info + Video */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          
          {/* Cover Art Column (Strict 1:1 Aspect Ratio, Served locally with fallback) */}
          <div className="lg:col-span-5 p-6 sm:p-8 md:p-10 flex flex-col items-center justify-center border-b-2 lg:border-b-0 lg:border-r-2 border-[#FFFFFF]/15 bg-[#080706]">
            <div className="w-full max-w-[420px] aspect-square border-2 border-[#FFFFFF]/20 relative overflow-hidden bg-black shadow-2xl">
              <img 
                src="/santinho.png" 
                alt="SANTINHO / carta pra alguém do passado"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://images.genius.com/e96155e60bf3aee39d248c77ca496b94.1000x1000x1.png";
                }}
              />
            </div>
          </div>

          {/* Release Information & Actions Column */}
          <div className="lg:col-span-7 p-6 sm:p-8 md:p-10 flex flex-col justify-between">
            <div>
              {/* Exact casing preserved */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.05] mb-6">
                SANTINHO <span className="text-[#00DF59]">/</span> <span className="font-bold text-[#E0E0E0] normal-case">carta pra alguém do passado</span>
              </h1>

              <p className="text-base sm:text-lg text-[#E0E0E0]/85 leading-relaxed max-w-2xl mb-8">
                {t('home.hero.desc')}
              </p>

              {/* Action Buttons: Spotify Primary, YouTube Secondary */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-8">
                <a 
                  href="https://open.spotify.com/intl-pt/album/3B8IoTNh5fDSwRqj48BXbU?si=fPTPcYqFRAC5j_Pie0rcKw" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-[#00DF59] text-black font-mono font-bold text-xs md:text-sm px-6 py-4 uppercase tracking-wider hover:bg-[#FFE600] transition-colors flex items-center justify-center gap-2.5 shadow-lg text-center"
                >
                  <Play size={16} fill="black" />
                  <span>{t('home.hero.cta')}</span>
                  <ArrowUpRight size={16} />
                </a>

                <a 
                  href="https://youtu.be/ylupN-eLKq4" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="border-2 border-[#FFFFFF]/30 text-white hover:border-[#FFE600] hover:text-[#FFE600] font-mono font-bold text-xs md:text-sm px-6 py-4 uppercase tracking-wider transition-colors flex items-center justify-center gap-2.5 text-center"
                >
                  <span>{t('home.hero.youtube')}</span>
                  <ExternalLink size={15} />
                </a>
              </div>
            </div>

            {/* Embedded 16:9 Player (Music on YouTube) */}
            <div className="pt-6 border-t-2 border-[#FFFFFF]/15">
              <div className="flex items-center justify-between font-mono text-xs uppercase tracking-wider text-[#E0E0E0]/60 mb-3">
                <span>{t('home.hero.yt_audio_badge')}</span>
                <a 
                  href="https://youtu.be/ylupN-eLKq4"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  {t('home.hero.yt_listen')}
                </a>
              </div>
              <div className="w-full aspect-video border border-[#FFFFFF]/20 bg-black overflow-hidden relative shadow-md">
                <iframe 
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/ylupN-eLKq4" 
                  title="SANTINHO / carta pra alguém do passado" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              </div>
            </div>

          </div>

        </div>

      </section>

      {/* =========================================================================
          2. RÁDIO LIXO BRASILEIRO
         ========================================================================= */}
      <section className="w-full border-2 border-[#FFE600]/40 bg-[#111111] p-6 sm:p-8 md:p-10 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-white flex items-center gap-3">
              <RadioIcon size={24} className="text-[#FFE600]" />
              <span>{t('home.radio.title')}</span>
            </h2>
            <p className="text-sm sm:text-base text-[#E0E0E0]/80 font-sans">
              {t('home.radio.desc')}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 shrink-0 w-full sm:w-auto">
            <Link 
              to="/" 
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-[#FFE600] hover:bg-[#00DF59] text-black font-mono font-bold text-xs uppercase px-6 py-4 tracking-wider transition-colors"
            >
              <span>{t('home.radio.tune')}</span>
              <ArrowRight size={15} />
            </Link>
            <Link 
              to="/?modal=recado" 
              state={{ openModal: true }}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 border-2 border-[#FFFFFF]/25 hover:border-white text-white font-mono text-xs uppercase px-5 py-4 tracking-wider transition-colors"
            >
              <span>{t('home.radio.record')}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. LANÇAMENTO SECUNDÁRIO: BRIGAS FÚTEIS
         ========================================================================= */}
      <section className="w-full space-y-6">
        <div className="flex items-baseline justify-between border-b-2 border-[#FFFFFF]/15 pb-4">
          <div className="flex items-baseline gap-3">
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">
              BRIGAS FÚTEIS
            </h2>
            <span className="font-mono text-xs text-[#00DF59] uppercase tracking-wider">
              {t('home.brigas.badge')}
            </span>
          </div>
          <Link 
            to="/discografia"
            className="font-mono text-xs uppercase tracking-wider text-[#E0E0E0]/60 hover:text-[#00DF59] transition-colors flex items-center gap-1"
          >
            <span>{t('home.brigas.all_disc')}</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        <div className="border-2 border-[#FFFFFF]/15 bg-[#111111] grid grid-cols-1 lg:grid-cols-12 gap-0">
          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between border-b-2 lg:border-b-0 lg:border-r-2 border-[#FFFFFF]/15">
            <div className="space-y-4">
              <span className="font-mono text-xs text-[#00DF59] uppercase tracking-wider block">
                {t('home.brigas.badge')} · SINGLE, 2026
              </span>
              <div className="space-y-3">
                <p className="font-mono text-xs text-[#FFE600] uppercase tracking-wider font-bold">
                  {t('home.brigas.check_video')}
                </p>
                <p className="text-sm sm:text-base text-[#E0E0E0]/95 leading-relaxed font-sans">
                  "{t('home.brigas.synopsis')}"
                </p>
                <p className="text-xs sm:text-sm font-mono text-[#00DF59] font-medium tracking-wide">
                  {t('home.brigas.teaser')}
                </p>
              </div>
            </div>
            <div className="pt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <a 
                href="https://open.spotify.com/intl-pt/album/7lh4Vx29QbXMNAfUEu2E5y?si=vs4YVpTSRWiPkkL4459I2Q" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 font-mono text-xs font-bold bg-[#00DF59] text-black px-5 py-3 uppercase tracking-wider hover:bg-[#FFE600] transition-colors"
              >
                <Play size={14} fill="black" />
                <span>{t('home.brigas.spotify')}</span>
                <ArrowUpRight size={14} />
              </a>

              <a 
                href="https://youtu.be/wxEF5UbhZ0s" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 font-mono text-xs font-bold border-2 border-[#FFFFFF]/30 text-white hover:border-[#FFE600] hover:text-[#FFE600] px-5 py-3 uppercase tracking-wider transition-colors"
              >
                <span>{t('home.brigas.youtube')}</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>

          <div className="lg:col-span-7 p-6 sm:p-8 bg-[#080706]">
            <div className="flex items-center justify-between font-mono text-xs uppercase tracking-wider text-[#E0E0E0]/60 mb-3">
              <span>VIDEOCLIPE OFICIAL</span>
              <a 
                href="https://youtu.be/wxEF5UbhZ0s"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                {t('home.brigas.open_yt')}
              </a>
            </div>
            <div className="w-full aspect-video border border-[#FFFFFF]/20 bg-black overflow-hidden relative shadow-md">
              <iframe 
                className="w-full h-full"
                src="https://www.youtube.com/embed/wxEF5UbhZ0s" 
                title="BRIGAS FÚTEIS (Clipe Oficial)" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. CAMISETAS (DSCPLS.SHOP)
         ========================================================================= */}
      <section className="w-full space-y-8">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b-2 border-[#FFFFFF]/15 pb-4 gap-4">
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
            {t('home.merch.title')}
          </h2>
          <a 
            href="https://dscpls.shop" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#FFE600] text-black font-mono font-bold text-xs uppercase px-5 py-3 tracking-wider hover:bg-[#00DF59] transition-colors self-start sm:self-auto"
          >
            <span>{t('home.merch.store')}</span>
            <ArrowUpRight size={15} />
          </a>
        </div>

        {/* Real Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Camiseta 1 */}
          <MerchCard
            title={t('home.merch.namna')}
            imgSrc="https://media.discordapp.net/attachments/1137467200245088317/1495844838644519085/1f357468-5c18-4605-a53e-fae85249b41d.png?ex=69e7b990&is=69e66810&hm=b561ec4548f6823c7d086bd4179ddad4aac4fa4dea1cfec600043bcacce942b6&animated=true"
            alt="Camiseta não acredito mais no amor"
          />

          {/* Camiseta 2 */}
          <MerchCard
            title={t('home.merch.eamo')}
            imgSrc="https://media.discordapp.net/attachments/1137467200245088317/1495844839391232211/9c174e84-4762-4315-88da-1da6695100a2.png?ex=69e7b991&is=69e66811&hm=8d264c34c2847300f518d4c4aec9d602ab188448b6b7b653931ec84a7937d64b&animated=true"
            alt="Camiseta eu AMO a DISCÍPULOS"
          />

          {/* Camiseta 3 */}
          <MerchCard
            title={t('home.merch.eros')}
            imgSrc="https://media.discordapp.net/attachments/1137467200245088317/1495844839693090947/834d206c-119f-42ce-a04b-7d4b0000e2b3.png?ex=69e7b991&is=69e66811&hm=0487b45089585c5e77a44e003ea3b7b92922b035bf66f36c49c578eace9ebe62&animated=true"
            alt="Camiseta eros - caligrafia"
          />

          {/* Camiseta 4 (Todos os meus heróis eram canibais) */}
          <MerchCard
            title={t('home.merch.heroes')}
            imgSrc="https://media.discordapp.net/attachments/1137467200245088317/1495844840070582272/bace7562-6def-4e1d-9c72-6891a6473cd3.png?ex=69e7b991&is=69e66811&hm=3533e5aa508990e9f82d5240394018622e89f6b9ed9c8eb6ea2bbc63a3892f98&animated=true"
            alt="Camiseta Todos os meus heróis eram canibais"
            span2={true}
          />

          {/* Camiseta 5 */}
          <MerchCard
            title={t('home.merch.world')}
            imgSrc="https://media.discordapp.net/attachments/1137467200245088317/1495844840410452038/758267f3-c583-46ce-8b7e-f9c91caa082f.png?ex=69e7b991&is=69e66811&hm=0937917753cb7f32131486dfb77937cfc271ab58a454c3dbd0f106bf9171d496&animated=true"
            alt="Camiseta o mundo é da DSCPLS"
          />

        </div>

      </section>

      {/* =========================================================================
          5. NEWSLETTER
         ========================================================================= */}
      <Newsletter />

    </div>
  );
}
