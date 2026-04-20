import React, { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    
    // Fake API call
    setTimeout(() => {
      setStatus('success');
      setEmail('');
      
      // Reset back to idle after a while
      setTimeout(() => setStatus('idle'), 5000);
    }, 1200);
  };

  return (
    <div className="w-full bg-[#ff3e3e] border-y-4 border-white mt-24 flex flex-col md:flex-row items-center justify-between font-sans">
      <div className="w-full md:w-1/2 p-10 md:p-16 text-black border-b-4 md:border-b-0 md:border-r-4 border-white flex flex-col justify-center">
        <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-4">
          NÃO PERCA<br/>O SINAL
        </h2>
        <p className="text-lg md:text-xl font-bold tracking-tight mb-8">
          ASSINE O NOSSO CULTO (NEWSLETTER). ATUALIZAÇÕES, DROPS E SINAIS DE RÁDIO INTERROMPIDOS.
        </p>
        
        {status === 'success' ? (
          <div className="bg-black text-white p-6 border-4 border-black font-mono text-sm md:text-base animate-[jit2_0.1s_infinite]">
            [SISTEMA]: E-MAIL REGISTRADO COM SUCESSO. FIQUE ATENTO À SUA CAIXA DE ENTRADA. NÓS VEMOS VOCÊ.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-0 group">
            <input 
              type="email" 
              placeholder="SEU MELHOR E-MAIL AQUI" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 bg-black text-white px-6 py-4 outline-none border-4 border-black text-lg md:text-xl tracking-widest uppercase font-bold placeholder:text-gray-600 focus:bg-[#050505]"
            />
            <button 
              type="submit" 
              disabled={status === 'loading'}
              className="bg-transparent text-black border-4 border-l-4 sm:border-l-0 border-t-0 sm:border-t-4 border-black px-8 py-4 font-black uppercase text-xl hover:bg-black hover:text-white transition-colors tracking-widest disabled:opacity-50"
            >
              {status === 'loading' ? 'ENVIANDO...' : 'INSCREVER'}
            </button>
          </form>
        )}
      </div>

      <div className="w-full md:w-1/2 min-h-[300px] bg-[#050505] p-10 flex flex-col justify-center items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,0,0,0.2)_0%,transparent_70%)] pointer-events-none"></div>
        <div className="font-mono text-[#ff3e3e] text-xs md:text-sm tracking-[0.3em] uppercase opacity-70 z-10 text-center space-y-4">
          <p>{"// TEMPLATE INTERNAL MESSAGE LOG"}</p>
          <p>Subj: NOVO LANÇAMENTO DSCPLS</p>
          <p className="max-w-md bg-black/50 p-4 border border-[#ff3e3e]/30 inline-block text-left">
            Saudações do estúdio.<br/><br/>
            Se você recebeu esta transmissão, você faz parte do núcleo.<br/>
            Temos novidades em breve. Fiquem vivos.<br/><br/>
            - H & G
          </p>
        </div>
        {/* Grain overlay for side block */}
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('data:image/svg+xml;utf8,%3CSVG xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%22 height=%22100%22 filter=%22url(%23n)%22/%3E%3C/SVG%3E')]"></div>
      </div>
    </div>
  );
}
