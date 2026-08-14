import React, { useState } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useLanguage } from '../contexts/LanguageContext';

export default function Newsletter() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    
    try {
      // Using ISO string instead of serverTimestamp to prevent infinite hanging when offline
      await addDoc(collection(db, 'newsletter_subs'), {
        email: email.trim(),
        createdAt: new Date().toISOString()
      });
      
      setStatus('success');
      setEmail('');
      
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error(error);
      if(error instanceof Error && error.message.includes('the client is offline')) {
         alert("Você precisa estar online ou com o firebase configurado para se inscrever na newsletter.")
      }
      setStatus('error');
      // Show error briefly before resetting
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <div className="w-full bg-[#FFE600] border-y-4 border-white my-10 flex flex-col md:flex-row items-stretch justify-between font-sans shadow-lg shadow-yellow-500/10">
      <div className="w-full md:w-1/2 p-8 md:p-12 text-black border-b-4 md:border-b-0 md:border-r-4 border-white flex flex-col justify-center">
        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-4 whitespace-pre-line">
          {t('news.title')}
        </h2>
        <p className="text-base md:text-lg font-bold tracking-tight mb-8">
          {t('news.desc')}
        </p>
        
        {status === 'success' ? (
          <div className="bg-black text-white p-6 border-4 border-black font-mono text-sm shadow-[8px_8px_0_0_rgba(0,0,0,1)] uppercase">
            {t('news.success')}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row w-full bg-black sm:bg-transparent shadow-none sm:shadow-[8px_8px_0_0_rgba(0,0,0,1)] border-4 border-black sm:border-none group">
            <input 
              type="email" 
              placeholder={t('news.placeholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-[2] min-w-0 bg-black text-white px-4 py-4 outline-none border-b-4 sm:border-y-4 sm:border-l-4 sm:border-r-0 border-black text-base tracking-widest uppercase font-bold placeholder:text-gray-600 focus:bg-[#111]"
            />
            <button 
              type="submit" 
              disabled={status === 'loading'}
              className="flex-1 bg-[#00DF59] sm:bg-transparent text-black sm:border-y-4 sm:border-r-4 border-black px-6 py-4 font-black uppercase text-base sm:text-lg hover:bg-white transition-colors tracking-widest disabled:opacity-50 min-w-max"
            >
              {status === 'loading' ? t('news.wait') : (status === 'error' ? 'ERRO' : t('news.subscribe'))}
            </button>
          </form>
        )}
      </div>

      <div className="w-full md:w-1/2 min-h-[300px] bg-[#0c0907] p-10 flex flex-col justify-center items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,223,89,0.2)_0%,transparent_70%)] pointer-events-none"></div>
        <div className="font-mono text-[#00DF59] text-xs md:text-sm tracking-[0.3em] uppercase opacity-80 z-10 text-center space-y-4 max-w-full">
          <p>{"// LOG_INTERNO_LIXO_BRASILEIRO"}</p>
          <p>{t('news.log_title')}</p>
          <p className="max-w-md w-full bg-black/70 p-4 border border-[#00DF59]/40 inline-block text-left text-xs sm:text-sm break-words sm:break-normal whitespace-pre-line text-white">
            {t('news.log_body')}
          </p>
        </div>
        {/* Grain overlay for side block */}
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('data:image/svg+xml;utf8,%3CSVG xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%22 height=%22100%22 filter=%22url(%23n)%22/%3E%3C/SVG%3E')]"></div>
      </div>
    </div>
  );
}
