import React, { useState } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useLanguage } from '../contexts/LanguageContext';
import { ArrowRight, Check, AlertCircle } from 'lucide-react';

export default function Newsletter() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus('loading');
    
    try {
      await addDoc(collection(db, 'newsletter_subs'), {
        email: email.trim().toLowerCase(),
        createdAt: new Date().toISOString()
      });
      
      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 6000);
    } catch (error) {
      console.error(error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  return (
    <section className="w-full my-16 border-y-2 border-[#FFFFFF]/15 bg-[#111111]">
      <div className="grid grid-cols-1 lg:grid-cols-12">
        
        {/* Left Column: Editorial Headline & Purpose */}
        <div className="lg:col-span-7 p-8 md:p-12 lg:border-r-2 lg:border-[#FFFFFF]/15 flex flex-col justify-center">
          <div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-none mb-6">
              {t('news.title')}
            </h2>
            <p className="text-[#E0E0E0]/80 font-sans text-base md:text-lg max-w-xl leading-relaxed">
              {t('news.desc')}
            </p>
          </div>
        </div>

        {/* Right Column: Interaction Form */}
        <div className="lg:col-span-5 p-8 md:p-12 bg-[#080706] flex flex-col justify-center">
          {status === 'success' ? (
            <div className="border border-[#00DF59] bg-[#00DF59]/10 p-6 flex items-start gap-4">
              <Check className="text-[#00DF59] shrink-0 mt-0.5" size={20} />
              <div>
                <div className="font-mono text-xs font-bold text-[#00DF59] uppercase tracking-wider mb-1">
                  CONFIRMADO
                </div>
                <div className="font-mono text-sm text-[#E0E0E0]">
                  {t('news.success')}
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <label htmlFor="newsletter-email" className="font-mono text-xs uppercase tracking-widest text-[#E0E0E0]/70">
                Endereço de e-mail:
              </label>

              <div className="flex flex-col sm:flex-row gap-0 border-2 border-[#FFFFFF]/20 focus-within:border-[#00DF59] transition-colors">
                <input 
                  id="newsletter-email"
                  type="email" 
                  placeholder={t('news.placeholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 bg-transparent text-white px-4 py-3.5 outline-none font-mono text-sm uppercase placeholder:text-[#E0E0E0]/30"
                />
                <button 
                  type="submit" 
                  disabled={status === 'loading'}
                  className="bg-[#00DF59] hover:bg-[#FFE600] text-black px-6 py-3.5 font-bold font-mono text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
                >
                  <span>{status === 'loading' ? t('news.wait') : t('news.subscribe')}</span>
                  <ArrowRight size={14} />
                </button>
              </div>

              {status === 'error' && (
                <div className="flex items-center gap-2 text-xs font-mono text-red-400 mt-2">
                  <AlertCircle size={14} />
                  <span>Erro ao registrar. Tente novamente em instantes.</span>
                </div>
              )}

              <p className="font-mono text-[11px] text-[#E0E0E0]/40 tracking-wide mt-2">
                Enviamos apenas comunicados de novos lançamentos, drops da loja e transmissões especiais.
              </p>
            </form>
          )}
        </div>

      </div>
    </section>
  );
}
