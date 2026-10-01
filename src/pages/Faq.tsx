import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { Plus, Minus, HelpCircle } from 'lucide-react';

export default function Faq() {
  const { t } = useLanguage();
  const [openSection, setOpenSection] = useState<'loja' | 'banda'>('loja');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const lojaFaqs = Array.from({ length: 10 }).map((_, i) => ({
    q: t(`faq.loja.q${i + 1}` as any),
    a: t(`faq.loja.a${i + 1}` as any)
  }));

  const bandaFaqs = Array.from({ length: 10 }).map((_, i) => ({
    q: t(`faq.banda.q${i + 1}` as any),
    a: t(`faq.banda.a${i + 1}` as any)
  }));

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const currentFaqs = openSection === 'loja' ? lojaFaqs : bandaFaqs;

  return (
    <div className="w-full max-w-4xl mx-auto pb-24 space-y-12">
      
      {/* Header */}
      <div className="border-b-2 border-[#FFFFFF]/15 pb-6">
        <div className="font-mono text-xs text-[#00DF59] uppercase tracking-[0.25em] mb-2 flex items-center gap-2">
          <HelpCircle size={14} />
          <span>DÚVIDAS & INFORMAÇÕES OFICIAIS</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white">
          {t('faq.title')}
        </h1>
      </div>

      {/* Section Switcher Tabs */}
      <div className="flex items-center gap-2 border-b-2 border-[#FFFFFF]/15 pb-2 font-mono text-xs uppercase">
        <button
          onClick={() => { setOpenSection('loja'); setOpenIndex(null); }}
          className={`px-4 py-2 border-b-2 transition-all font-bold tracking-wider ${
            openSection === 'loja'
              ? 'border-[#00DF59] text-[#00DF59] bg-[#00DF59]/5'
              : 'border-transparent text-[#E0E0E0]/60 hover:text-white'
          }`}
        >
          01. {t('faq.section.loja')} (10)
        </button>
        <button
          onClick={() => { setOpenSection('banda'); setOpenIndex(null); }}
          className={`px-4 py-2 border-b-2 transition-all font-bold tracking-wider ${
            openSection === 'banda'
              ? 'border-[#FFE600] text-[#FFE600] bg-[#FFE600]/5'
              : 'border-transparent text-[#E0E0E0]/60 hover:text-white'
          }`}
        >
          02. {t('faq.section.banda')} (10)
        </button>
      </div>

      {/* Accordion Questions List */}
      <div className="space-y-3">
        {currentFaqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div 
              key={index}
              className={`border-2 transition-colors ${
                isOpen 
                  ? (openSection === 'loja' ? 'border-[#00DF59] bg-[#111111]' : 'border-[#FFE600] bg-[#111111]')
                  : 'border-[#FFFFFF]/15 bg-[#0e0d0c] hover:border-[#FFFFFF]/35'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleAccordion(index)}
                aria-expanded={isOpen}
                className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00DF59]"
              >
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-xs text-[#E0E0E0]/40 tabular-nums">
                    {(index + 1).toString().padStart(2, '0')}.
                  </span>
                  <h2 className="font-sans font-bold text-base sm:text-lg text-white leading-snug">
                    {faq.q}
                  </h2>
                </div>
                <div className="shrink-0 mt-0.5 text-[#E0E0E0]/70">
                  {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                </div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 sm:px-6 pb-6 pt-2 font-mono text-xs sm:text-sm text-[#E0E0E0]/90 leading-relaxed border-t border-[#FFFFFF]/10 pl-11">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Bottom Contact Reminder */}
      <div className="p-6 border border-[#FFFFFF]/15 bg-[#111111] font-mono text-xs text-[#E0E0E0]/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <span>AINDA TEM DÚVIDAS NÃO LISTADAS?</span>
        <a 
          href="mailto:discipulosabanda@gmail.com" 
          className="text-[#00DF59] hover:underline uppercase font-bold"
        >
          discipulosabanda@gmail.com ↗
        </a>
      </div>

    </div>
  );
}
