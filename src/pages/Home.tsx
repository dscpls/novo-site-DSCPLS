import React from 'react';
import { motion } from 'motion/react';
import Newsletter from '../components/Newsletter';
import { useLanguage } from '../contexts/LanguageContext';

export default function Home() {
  const { t } = useLanguage();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="w-full relative min-h-[60vh] flex flex-col items-center justify-center pt-10 pb-20"
    >
      {/* Atmospheric solid dark background */}
      <div className="fixed inset-0 z-[-1] bg-[#080706] pointer-events-none"></div>

      {/* Main Home Content that fades in later */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="w-full max-w-5xl flex flex-col gap-12 relative z-10"
      >
        {/* Lançamento: Brigas Fúteis */}
        <div className="w-full flex flex-col md:flex-row gap-12 items-center bg-[#090705] p-8 md:p-12 border-4 border-white/10 rounded-sm shadow-2xl">
          <div className="flex-1 space-y-6">
            <div className="inline-block border-2 border-[#00DF59] text-[#00DF59] px-4 py-1 text-sm font-bold tracking-widest uppercase">
              {t('home.hero.badge')}
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter uppercase leading-none text-white mb-4">{t('home.hero.title')}</h1>
            <p className="text-gray-400 font-bold leading-relaxed text-base md:text-lg">
              {t('home.hero.desc')}
            </p>
            <div className="pt-2">
               <a href="https://open.spotify.com/intl-pt/album/7lh4Vx29QbXMNAfUEu2E5y?si=vs4YVpTSRWiPkkL4459I2Q" target="_blank" rel="noopener noreferrer" className="text-[#00DF59] hover:text-[#0a0a0a] border-4 border-[#00DF59] px-8 py-3 hover:bg-[#00DF59] transition-all tracking-widest text-sm font-bold inline-block uppercase">
                {t('home.hero.cta')}
               </a>
            </div>
          </div>
          <div className="w-full md:w-1/2 flex items-center justify-center relative">
            <iframe 
              className="w-full aspect-video border-4 border-white/20 relative z-10 shadow-[8px_8px_0px_#00DF59] grayscale hover:grayscale-0 transition-all duration-300"
              src="https://www.youtube.com/embed/_RHGBo6Mqpg" 
              title="BRIGAS FÚTEIS" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>
        </div>

        {/* Anterior: flores */}
        <div className="w-full flex flex-col md:flex-row-reverse gap-12 items-center bg-[#090705] p-8 md:p-12 border-4 border-white/10 rounded-sm shadow-2xl mt-8">
          <div className="flex-1 space-y-6">
            <div className="inline-block border-2 border-[#FFE600] text-[#FFE600] px-4 py-1 text-sm font-bold tracking-widest uppercase">
              {t('home.flores.badge')}
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter uppercase leading-none text-white mb-4">{t('home.flores.title')}</h1>
            <p className="text-gray-400 font-bold leading-relaxed text-base md:text-lg">
              {t('home.flores.desc')}
            </p>
          </div>
          <div className="w-full md:w-1/2 flex items-center justify-center relative">
            <iframe 
              className="w-full aspect-video border-4 border-white/20 relative z-10 shadow-[8px_8px_0px_#FFE600] opacity-80 hover:opacity-100 transition-opacity duration-300"
              src="https://www.youtube.com/embed/WtwCkBN3i-M" 
              title="flores" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>
        </div>

        {/* Merch / Camisetas Section */}
        <div className="w-full mt-24">
          <div className="flex items-center gap-4 mb-10">
            <h2 className="text-4xl md:text-6xl tracking-tighter font-black text-white uppercase">{t('home.merch.title')}</h2>
            <div className="h-[2px] flex-1 bg-white/20"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Camiseta 1 */}
            <div className="bg-[#090705] border-4 border-white group overflow-hidden flex flex-col relative">
               <div className="aspect-square bg-gray-900 relative p-4 flex items-center justify-center overflow-hidden">
                 <img src="https://media.discordapp.net/attachments/1137467200245088317/1495844838644519085/1f357468-5c18-4605-a53e-fae85249b41d.png?ex=69e7b990&is=69e66810&hm=b561ec4548f6823c7d086bd4179ddad4aac4fa4dea1cfec600043bcacce942b6&animated=true" alt="não acredito mais no amor" className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
               </div>
               <div className="p-6 border-t-4 border-white flex-1 flex items-center justify-center text-center">
                 <h3 className="font-bold tracking-widest uppercase text-lg group-hover:text-[#00DF59] transition-colors">{t('home.merch.namna')}</h3>
               </div>
            </div>

            {/* Camiseta 2 */}
            <div className="bg-[#090705] border-4 border-white group overflow-hidden flex flex-col relative">
               <div className="aspect-square bg-gray-900 relative p-4 flex items-center justify-center overflow-hidden">
                 <img src="https://media.discordapp.net/attachments/1137467200245088317/1495844839391232211/9c174e84-4762-4315-88da-1da6695100a2.png?ex=69e7b991&is=69e66811&hm=8d264c34c2847300f518d4c4aec9d602ab188448b6b7b653931ec84a7937d64b&animated=true" alt="eu AMO a DISCÍPULOS" className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
               </div>
               <div className="p-6 border-t-4 border-white flex-1 flex items-center justify-center text-center">
                 <h3 className="font-bold tracking-widest uppercase text-lg group-hover:text-[#FFE600] transition-colors">{t('home.merch.eamo')}</h3>
               </div>
            </div>

            {/* Camiseta 3 */}
            <div className="bg-[#090705] border-4 border-white group overflow-hidden flex flex-col relative">
               <div className="aspect-square bg-gray-900 relative p-4 flex items-center justify-center overflow-hidden">
                 <img src="https://media.discordapp.net/attachments/1137467200245088317/1495844839693090947/834d206c-119f-42ce-a04b-7d4b0000e2b3.png?ex=69e7b991&is=69e66811&hm=0487b45089585c5e77a44e003ea3b7b92922b035bf66f36c49c578eace9ebe62&animated=true" alt="eros - caligrafia" className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
               </div>
               <div className="p-6 border-t-4 border-white flex-1 flex items-center justify-center text-center">
                 <h3 className="font-bold tracking-widest uppercase text-lg group-hover:text-[#00DF59] transition-colors">{t('home.merch.eros')}</h3>
               </div>
            </div>

            {/* Camiseta 4 */}
            <div className="bg-[#090705] border-4 border-white group overflow-hidden flex flex-col relative lg:col-span-2">
               <div className="aspect-video md:aspect-[21/9] bg-gray-900 relative p-4 flex items-center justify-center overflow-hidden">
                 <img src="https://media.discordapp.net/attachments/1137467200245088317/1495844840070582272/bace7562-6def-4e1d-9c72-6891a6473cd3.png?ex=69e7b991&is=69e66811&hm=3533e5aa508990e9f82d5240394018622e89f6b9ed9c8eb6ea2bbc63a3892f98&animated=true" alt="Coleção GROOVE" className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
               </div>
               <div className="p-6 border-t-4 border-white flex-1 flex flex-col items-center justify-center text-center">
                 <span className="text-xs text-[#FFE600] mb-1 tracking-widest font-bold">{t('home.merch.groove')}</span>
                 <h3 className="font-bold tracking-widest uppercase text-xl group-hover:text-[#00DF59] transition-colors">{t('home.merch.heroes')}</h3>
               </div>
            </div>

            {/* Camiseta 5 */}
            <div className="bg-[#090705] border-4 border-white group overflow-hidden flex flex-col relative">
               <div className="aspect-square bg-gray-900 relative p-4 flex items-center justify-center overflow-hidden">
                 <img src="https://media.discordapp.net/attachments/1137467200245088317/1495844840410452038/758267f3-c583-46ce-8b7e-f9c91caa082f.png?ex=69e7b991&is=69e66811&hm=0937917753cb7f32131486dfb77937cfc271ab58a454c3dbd0f106bf9171d496&animated=true" alt="o mundo é da DSCPLS" className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
               </div>
               <div className="p-6 border-t-4 border-white flex-1 flex items-center justify-center text-center">
                 <h3 className="font-bold tracking-widest uppercase text-lg group-hover:text-[#FFE600] transition-colors">{t('home.merch.world')}</h3>
               </div>
            </div>

          </div>
          <div className="mt-12 text-center">
             <a href="https://dscpls.shop" target="_blank" rel="noopener noreferrer" className="inline-block border-4 border-white px-12 py-4 bg-[#FFE600] text-black font-black uppercase tracking-widest hover:bg-[#00DF59] hover:text-black transition-colors text-xl shadow-[0_4px_20px_rgba(255,230,0,0.3)]">
               {t('home.merch.store')}
             </a>
             <p className="text-gray-400 mt-4 tracking-widest uppercase text-sm font-mono">{t('home.merch.available')}</p>
          </div>
        </div>

        <Newsletter />
      </motion.div>
    </motion.div>
  );
}
