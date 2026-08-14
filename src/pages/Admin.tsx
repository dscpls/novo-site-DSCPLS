import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { db } from '../lib/firebase';
import { collection, query, onSnapshot } from 'firebase/firestore';
import Newsletter from '../components/Newsletter';
import { useAdminAuth } from '../lib/authUtils';
import { useLanguage } from '../contexts/LanguageContext';

export default function Admin() {
  const { isAdmin, loginAdmin, logoutAdmin } = useAdminAuth();
  const [subscribers, setSubscribers] = useState<string[]>([]);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const { t } = useLanguage();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);

  useEffect(() => {
    if (!isAdmin) return;
    const q = query(collection(db, 'newsletter_subs'));
    const unsub = onSnapshot(q, (snapshot) => {
      const subs = snapshot.docs.map(doc => doc.data().email as string).filter(Boolean);
      setSubscribers(subs);
    });
    return () => unsub();
  }, [isAdmin]);

  const handleSendEmail = () => {
    if (!subject || !message) {
      alert("Preencha título e mensagem para enviar.");
      return;
    }
    
    // Fallback funcional pro caso do sistema não ter SMTP de backend. 
    // Gera link mailto para o admin abrir o cliente de email com BCC.
    const bcc = subscribers.join(',');
    const mailto = `mailto:?bcc=${encodeURIComponent(bcc)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    
    window.open(mailto, '_blank');
    
    alert("DICA: Como não temos um servidor SMTP pago configurado, isso vai abrir seu aplicativo de e-mail (Gmail/Outlook) com todos os contatos em Cópia Oculta (BCC). É o jeito mais fácil e seguro de disparar os e-mails grátis e garantir que cheguem sem cair no SPAM!");
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginAdmin(username, password)) {
      setLoginError(false);
      setUsername('');
      setPassword('');
    } else {
      setLoginError(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6 }}
      className="max-w-4xl mx-auto pt-10 pb-40"
    >
      <div className="flex items-center gap-4 mb-12">
        <h1 className="text-3xl tracking-[0.2em] font-light text-[#00DF59] font-mono">{t('admin.title')}</h1>
        <div className="h-[2px] flex-1 bg-white/20"></div>
        {isAdmin && (
          <button onClick={logoutAdmin} className="text-xs text-[#FFE600] hover:text-white border border-[#FFE600]/30 px-3 py-1 font-mono">{t('diario.logout_btn')}</button>
        )}
      </div>

      {!isAdmin ? (
        <div className="text-center p-8 md:p-20 border-2 border-[#00DF59]/40 bg-[#111]">
          <h2 className="text-2xl font-black uppercase mb-4 text-white">{t('admin.restricted')}</h2>
          <p className="text-gray-400 mb-8">{t('admin.credentials')}</p>
          
          <form onSubmit={handleLogin} className="max-w-xs mx-auto flex flex-col gap-4">
            <input 
              type="text"
              placeholder={t('admin.user')}
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="bg-black border border-[#333] text-white px-4 py-3 focus:border-[#00DF59] outline-none text-center font-mono placeholder:text-gray-600"
            />
            <input 
              type="password"
              placeholder={t('admin.pass')}
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="bg-black border border-[#333] text-white px-4 py-3 focus:border-[#00DF59] outline-none text-center font-mono placeholder:text-gray-600"
            />
            {loginError && <p className="text-[#FFE600] text-xs font-bold uppercase mt-2 font-mono">{t('admin.auth_invalid')}</p>}
            <button type="submit" className="mt-4 bg-[#00DF59] font-black uppercase text-black px-8 py-3 tracking-widest hover:bg-[#00DF59]/80 font-mono transition-all">
              {t('admin.auth_btn')}
            </button>
          </form>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Visualizing Newsletter Template */}
          <div className="bg-[#111] border border-[#222] p-8">
            <h2 className="text-xl font-bold tracking-widest mb-2 border-b border-[#333] pb-4 text-[#00DF59] font-mono">O TEMPLATE OFICIAL DA NEWSLETTER</h2>
            <p className="text-sm text-gray-400 mb-6">Esta é a caixa de assinatura que os usuários veem. Você pode testar e ver como funciona.</p>
            <div className="scale-90 origin-top">
              <Newsletter />
            </div>
            
            <div className="mt-8 bg-black border border-[#FFE600]/30 p-6">
               <h3 className="text-[#FFE600] font-bold uppercase tracking-widest mb-2 font-mono">COMO ENVIAR EMAILS COM ESTE ESTILO:</h3>
               <p className="text-gray-300 text-sm leading-relaxed mb-4">
                 Sempre que quiser disparar um email com a estética da Newsletter, copie este código HTML e cole no modo "Código Fonte" ou no corpo do email se seu disparador aceitar envio em HTML:
               </p>
               <pre className="bg-[#1a1a1a] p-4 text-xs font-mono text-gray-400 overflow-x-auto border border-[#333]">
{`<div style="background-color: #00DF59; border-top: 4px solid #FFE600; border-bottom: 4px solid #FFE600; padding: 40px; color: black; font-family: sans-serif;">
  <h1 style="font-weight: 900; font-size: 32px; text-transform: uppercase; margin-bottom: 10px;">TITULO DA SUA NEWSLETTER</h1>
  <p style="font-weight: bold; font-size: 16px;">
    ESCREVA O CONTEÚDO DO SEU O SINAL AQUI.
  </p>
  <div style="margin-top: 20px; background: black; color: white; padding: 20px; border: 4px solid black; font-family: monospace;">
    [SISTEMA]: MENSAGEM DO SISTEMA AQUI
  </div>
</div>`}
               </pre>
            </div>
          </div>

          {/* Seção Newsletter Disparo */}
          <div className="bg-[#111] border border-[#222] p-8">
            <h2 className="text-xl font-bold tracking-widest mb-2 border-b border-[#333] pb-4 text-[#00DF59] font-mono">DISPARO DE NEWSLETTER</h2>
            <p className="text-sm text-gray-400 mb-6 font-mono">Inscritos totais: <span className="text-[#FFE600] font-bold">{subscribers.length}</span></p>

            <div className="space-y-4">
              <input 
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="Assunto do E-mail..."
                className="w-full bg-[#050505] border border-[#333] text-white p-3 font-bold focus:border-[#00DF59] outline-none font-mono"
              />
              <textarea 
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Corpo do E-mail. Você pode colar a mensagem aqui e disparar."
                rows={10}
                className="w-full bg-[#050505] border border-[#333] text-white p-3 focus:border-[#00DF59] outline-none resize-none font-sans"
              />
              
              <button 
                onClick={handleSendEmail}
                disabled={subscribers.length === 0}
                className="w-full bg-[#00DF59] hover:bg-[#00DF59]/80 text-black font-black tracking-widest uppercase p-4 border-2 border-[#FFE600] transition-colors disabled:opacity-50 font-mono"
              >
                PREPARAR DISPARO
              </button>
            </div>
          </div>
          
          <div className="bg-[#111] border border-[#222] p-8 flex justify-between items-center">
             <div>
               <h2 className="text-xl font-bold tracking-widest mb-2 font-mono">GERENCIAR DIÁRIO</h2>
               <p className="text-sm text-gray-400">Poste ou delete updates do Diário.</p>
             </div>
             <a href="/diario" className="border-2 border-[#00DF59] text-[#00DF59] hover:bg-[#00DF59] hover:text-black py-2 px-6 font-bold tracking-widest uppercase transition-colors font-mono">Abrir Diário</a>
          </div>
        </div>
      )}
    </motion.div>
  );
}
