import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { auth, login, logout, db } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, query, onSnapshot } from 'firebase/firestore';
import Newsletter from '../components/Newsletter';

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [subscribers, setSubscribers] = useState<string[]>([]);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAdmin(currentUser?.email === 'henrikingames@gmail.com');
    });
    return () => unsub();
  }, []);

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6 }}
      className="max-w-4xl mx-auto pt-10 pb-40"
    >
      <div className="flex items-center gap-4 mb-12">
        <h1 className="text-3xl tracking-[0.2em] font-light text-red-500">SISTEMA ADMIN</h1>
        <div className="h-[1px] flex-1 bg-gradient-to-r from-red-500/50 to-transparent"></div>
        {user ? (
          <button onClick={logout} className="text-xs text-red-500 hover:text-red-400 border border-red-500/30 px-3 py-1">LOGOUT</button>
        ) : (
          <button onClick={login} className="text-xs text-gray-500 hover:text-white border border-gray-500/30 px-3 py-1">LOGIN</button>
        )}
      </div>

      {!user ? (
        <div className="text-center p-20 border border-[#333] bg-[#111]">
          <h2 className="text-2xl font-black uppercase mb-4">Acesso Restrito</h2>
          <p className="text-gray-400">Faça login com sua conta de administrador para continuar.</p>
          <button onClick={login} className="mt-8 bg-red-600 font-bold uppercase text-white px-8 py-3 tracking-widest hover:bg-red-500">Autorizar Acesso</button>
        </div>
      ) : !isAdmin ? (
        <div className="text-center p-20 border border-red-500 bg-red-500/10 text-red-500">
          <h2 className="text-2xl font-black uppercase mb-4">ACESSO NEGADO</h2>
          <p>Você ({user.email}) não é o administrador do sistema.</p>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Visualizing Newsletter Template */}
          <div className="bg-[#111] border border-[#222] p-8">
            <h2 className="text-xl font-bold tracking-widest mb-2 border-b border-[#333] pb-4">O TEMPLATE OFICIAL DA NEWSLETTER</h2>
            <p className="text-sm text-gray-400 mb-6">Esta é a caixa de assinatura que os usuários veem. Você pode testar e ver como funciona.</p>
            <div className="scale-90 origin-top">
              <Newsletter />
            </div>
            
            <div className="mt-8 bg-black border border-white/20 p-6">
               <h3 className="text-red-500 font-bold uppercase tracking-widest mb-2">COMO ENVIAR EMAILS COM ESTE ESTILO:</h3>
               <p className="text-gray-300 text-sm leading-relaxed mb-4">
                 Sempre que quiser disparar um email com a estética da Newsletter, copie este código HTML e cole no modo "Código Fonte" ou no corpo do email se seu disparador aceitar envio em HTML:
               </p>
               <pre className="bg-[#1a1a1a] p-4 text-xs font-mono text-gray-400 overflow-x-auto border border-[#333]">
{`<div style="background-color: #ff3e3e; border-top: 4px solid white; border-bottom: 4px solid white; padding: 40px; color: black; font-family: sans-serif;">
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
            <h2 className="text-xl font-bold tracking-widest mb-2 border-b border-[#333] pb-4">DISPARO DE NEWSLETTER</h2>
            <p className="text-sm text-gray-400 mb-6">Inscritos totais: <span className="text-red-500 font-bold">{subscribers.length}</span></p>

            <div className="space-y-4">
              <input 
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="Assunto do E-mail..."
                className="w-full bg-[#050505] border border-[#333] text-white p-3 font-bold focus:border-red-500 outline-none"
              />
              <textarea 
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Corpo do E-mail. Você pode colar a mensagem aqui e disparar."
                rows={10}
                className="w-full bg-[#050505] border border-[#333] text-white p-3 focus:border-red-500 outline-none resize-none font-sans"
              />
              
              <button 
                onClick={handleSendEmail}
                disabled={subscribers.length === 0}
                className="w-full bg-red-900/50 hover:bg-red-600 text-white font-bold tracking-widest uppercase p-4 border border-red-500 transition-colors disabled:opacity-50"
              >
                PREPARAR DISPARO
              </button>
            </div>
          </div>
          
          <div className="bg-[#111] border border-[#222] p-8 flex justify-between items-center">
             <div>
               <h2 className="text-xl font-bold tracking-widest mb-2">GERENCIAR DIÁRIO</h2>
               <p className="text-sm text-gray-400">Poste ou delete updates do Diário.</p>
             </div>
             <a href="/diario" className="border border-white hover:bg-white hover:text-black py-2 px-6 font-bold tracking-widest uppercase transition-colors">Abrir Diário</a>
          </div>
        </div>
      )}
    </motion.div>
  );
}
