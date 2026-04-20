import React from 'react';
import { motion } from 'motion/react';
import Newsletter from '../components/Newsletter';

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
        <div className="w-full flex flex-col md:flex-row gap-12 items-center bg-[#050505] p-8 md:p-12 border-4 border-white/10 rounded-sm shadow-2xl">
          <div className="flex-1 space-y-6">
            <div className="inline-block border-2 border-[#ff3e3e] text-[#ff3e3e] px-4 py-1 text-sm font-bold tracking-widest uppercase">
              NOVO LANÇAMENTO
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter uppercase leading-none text-white mb-4">BRIGAS FÚTEIS</h1>
            <p className="text-gray-400 font-bold leading-relaxed text-base md:text-lg">
              O novo single <strong className="text-white">"BRIGAS FÚTEIS"</strong> já está disponível. Assista ao conteúdo oficial e mergulhe em mais um fragmento audiovisual do projeto DSCPLS.
            </p>
            <div className="pt-2">
               <a href="https://open.spotify.com/intl-pt/album/7lh4Vx29QbXMNAfUEu2E5y?si=vs4YVpTSRWiPkkL4459I2Q" target="_blank" rel="noopener noreferrer" className="text-[#1db954] hover:text-[#0a0a0a] border-4 border-[#1db954] px-8 py-3 hover:bg-[#1db954] transition-all tracking-widest text-sm font-bold inline-block uppercase">
                OUVIR NO SPOTIFY
               </a>
            </div>
          </div>
          <div className="w-full md:w-1/2 flex items-center justify-center relative">
            <div className="absolute inset-0 bg-[#ff3e3e]/20 blur-3xl rounded-full"></div>
            <iframe 
              className="w-full aspect-video border-4 border-white/20 relative z-10 shadow-[8px_8px_0px_rgba(255,0,0,0.5)] grayscale hover:grayscale-0 transition-all duration-300"
              src="https://www.youtube.com/embed/_RHGBo6Mqpg" 
              title="BRIGAS FÚTEIS" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>
        </div>

        {/* Anterior: flores */}
        <div className="w-full flex flex-col md:flex-row-reverse gap-12 items-center bg-[#050505] p-8 md:p-12 border-4 border-white/10 rounded-sm shadow-2xl mt-8">
          <div className="flex-1 space-y-6">
            <div className="inline-block border-2 border-gray-500 text-gray-500 px-4 py-1 text-sm font-bold tracking-widest uppercase">
              DEZEMBRO DE 2025
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter uppercase leading-none text-white mb-4">flores</h1>
            <p className="text-gray-400 font-bold leading-relaxed text-base md:text-lg">
              Uma peça mais antiga do quebra-cabeça. Explore a atmosfera estética de <strong className="text-white">"flores"</strong> na íntegra.
            </p>
          </div>
          <div className="w-full md:w-1/2 flex items-center justify-center relative">
            <div className="absolute inset-0 bg-blue-900/10 blur-3xl rounded-full"></div>
            <iframe 
              className="w-full aspect-video border-4 border-white/20 relative z-10 shadow-[8px_8px_0px_rgba(255,255,255,0.2)] opacity-80 hover:opacity-100 transition-opacity duration-300"
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
            <h2 className="text-4xl md:text-6xl tracking-tighter font-black text-white uppercase">ACERVO <span className="text-[#ff3e3e]">FÍSICO</span></h2>
            <div className="h-[4px] flex-1 bg-white/20"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Camiseta 1 */}
            <div className="bg-[#050505] border-4 border-white group overflow-hidden flex flex-col relative">
               <div className="aspect-square bg-gray-900 relative p-4 flex items-center justify-center overflow-hidden">
                 <img src="https://media.discordapp.net/attachments/1137467200245088317/1495844838644519085/1f357468-5c18-4605-a53e-fae85249b41d.png?ex=69e7b990&is=69e66810&hm=b561ec4548f6823c7d086bd4179ddad4aac4fa4dea1cfec600043bcacce942b6&animated=true" alt="não acredito mais no amor" className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
               </div>
               <div className="p-6 border-t-4 border-white flex-1 flex items-center justify-center text-center">
                 <h3 className="font-bold tracking-widest uppercase text-lg group-hover:text-[#ff3e3e] transition-colors">NÃO ACREDITO MAIS NO AMOR</h3>
               </div>
            </div>

            {/* Camiseta 2 */}
            <div className="bg-[#050505] border-4 border-white group overflow-hidden flex flex-col relative">
               <div className="aspect-square bg-gray-900 relative p-4 flex items-center justify-center overflow-hidden">
                 <img src="https://media.discordapp.net/attachments/1137467200245088317/1495844839391232211/9c174e84-4762-4315-88da-1da6695100a2.png?ex=69e7b991&is=69e66811&hm=8d264c34c2847300f518d4c4aec9d602ab188448b6b7b653931ec84a7937d64b&animated=true" alt="eu AMO a DISCÍPULOS" className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
               </div>
               <div className="p-6 border-t-4 border-white flex-1 flex items-center justify-center text-center">
                 <h3 className="font-bold tracking-widest uppercase text-lg group-hover:text-[#ff3e3e] transition-colors">EU AMO A DISCÍPULOS</h3>
               </div>
            </div>

            {/* Camiseta 3 */}
            <div className="bg-[#050505] border-4 border-white group overflow-hidden flex flex-col relative">
               <div className="aspect-square bg-gray-900 relative p-4 flex items-center justify-center overflow-hidden">
                 <img src="https://media.discordapp.net/attachments/1137467200245088317/1495844839693090947/834d206c-119f-42ce-a04b-7d4b0000e2b3.png?ex=69e7b991&is=69e66811&hm=0487b45089585c5e77a44e003ea3b7b92922b035bf66f36c49c578eace9ebe62&animated=true" alt="eros - caligrafia" className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
               </div>
               <div className="p-6 border-t-4 border-white flex-1 flex items-center justify-center text-center">
                 <h3 className="font-bold tracking-widest uppercase text-lg group-hover:text-[#ff3e3e] transition-colors">EROS - CALIGRAFIA</h3>
               </div>
            </div>

            {/* Camiseta 4 */}
            <div className="bg-[#050505] border-4 border-white group overflow-hidden flex flex-col relative lg:col-span-2">
               <div className="aspect-video md:aspect-[21/9] bg-gray-900 relative p-4 flex items-center justify-center overflow-hidden">
                 <img src="https://media.discordapp.net/attachments/1137467200245088317/1495844840070582272/bace7562-6def-4e1d-9c72-6891a6473cd3.png?ex=69e7b991&is=69e66811&hm=3533e5aa508990e9f82d5240394018622e89f6b9ed9c8eb6ea2bbc63a3892f98&animated=true" alt="Coleção GROOVE" className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
               </div>
               <div className="p-6 border-t-4 border-white flex-1 flex flex-col items-center justify-center text-center">
                 <span className="text-xs text-gray-500 mb-1 tracking-widest">COLEÇÃO GROOVE</span>
                 <h3 className="font-bold tracking-widest uppercase text-xl group-hover:text-blue-400 transition-colors">TODOS OS MEUS HERÓIS ERAM CANIBAIS</h3>
               </div>
            </div>

            {/* Camiseta 5 */}
            <div className="bg-[#050505] border-4 border-white group overflow-hidden flex flex-col relative">
               <div className="aspect-square bg-gray-900 relative p-4 flex items-center justify-center overflow-hidden">
                 <img src="https://media.discordapp.net/attachments/1137467200245088317/1495844840410452038/758267f3-c583-46ce-8b7e-f9c91caa082f.png?ex=69e7b991&is=69e66811&hm=0937917753cb7f32131486dfb77937cfc271ab58a454c3dbd0f106bf9171d496&animated=true" alt="o mundo é da DSCPLS" className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
               </div>
               <div className="p-6 border-t-4 border-white flex-1 flex items-center justify-center text-center">
                 <h3 className="font-bold tracking-widest uppercase text-lg group-hover:text-purple-500 transition-colors">O MUNDO É DA DSCPLS</h3>
               </div>
            </div>

          </div>
          <div className="mt-12 text-center">
             <button className="border-4 border-white px-12 py-4 bg-white text-black font-black uppercase tracking-widest hover:bg-black hover:text-white transition-colors text-xl">
               IR PARA A LOJA
             </button>
             <p className="text-gray-500 mt-4 tracking-widest uppercase text-sm">COLEÇÃO EM BREVE. PREPARE-SE.</p>
          </div>
        </div>

        <Newsletter />
      </motion.div>
    </motion.div>
  );
}
