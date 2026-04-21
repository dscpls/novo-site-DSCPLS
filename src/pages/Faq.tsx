import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { Plus, Minus } from 'lucide-react';

export default function Faq() {
  const { t } = useLanguage();

  const lojaFaqs = Array.from({ length: 10 }).map((_, i) => ({
    q: t(`faq.loja.q${i + 1}` as any),
    a: t(`faq.loja.a${i + 1}` as any)
  }));

  const bandaFaqs = Array.from({ length: 10 }).map((_, i) => ({
    q: t(`faq.banda.q${i + 1}` as any),
    a: t(`faq.banda.a${i + 1}` as any)
  }));

  const [openSection, setOpenSection] = useState<'loja' | 'banda'>('loja');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="max-w-4xl mx-auto pt-10 pb-40 px-6"
    >
      <div className="flex items-center gap-4 mb-14">
        <h1 className="text-4xl md:text-6xl tracking-tighter font-black text-white uppercase">{t('faq.title')}</h1>
        <div className="h-[4px] flex-1 bg-white/20"></div>
      </div>

      <div className="flex gap-4 mb-10 border-b-4 border-white/20 pb-4">
         <button 
           onClick={() => { setOpenSection('loja'); setOpenIndex(null); }}
           className={`text-2xl font-black uppercase tracking-widest transition-colors ${openSection === 'loja' ? 'text-[#ff3e3e]' : 'text-gray-500 hover:text-white'}`}
         >
            {t('faq.section.loja')}
         </button>
         <span className="text-2xl text-white/20 font-black">/</span>
         <button 
           onClick={() => { setOpenSection('banda'); setOpenIndex(null); }}
           className={`text-2xl font-black uppercase tracking-widest transition-colors ${openSection === 'banda' ? 'text-[#00ffff]' : 'text-gray-500 hover:text-white'}`}
         >
            {t('faq.section.banda')}
         </button>
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={openSection}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-4"
          >
            {(openSection === 'loja' ? lojaFaqs : bandaFaqs).map((faq, index) => (
              <div 
                key={index} 
                className={`bg-[#111] border-2 transition-colors duration-300 ${openIndex === index ? (openSection === 'loja' ? 'border-[#ff3e3e]' : 'border-[#00ffff]') : 'border-white/10 hover:border-white/30'}`}
              >
                <button
                  className="w-full text-left p-6 flex items-center justify-between focus:outline-none"
                  onClick={() => toggleAccordion(index)}
                >
                  <h3 className="text-lg md:text-xl font-bold text-white uppercase pr-8 tracking-wide">
                    {faq.q}
                  </h3>
                  <div className="shrink-0 text-white/50">
                    {openIndex === index ? <Minus size={24} /> : <Plus size={24} />}
                  </div>
                </button>
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className={`p-6 pt-0 text-base md:text-lg font-mono text-gray-300 leading-relaxed border-t-2 ${openSection === 'loja' ? 'border-[#ff3e3e]/20' : 'border-[#00ffff]/20'} mt-2`}>
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
