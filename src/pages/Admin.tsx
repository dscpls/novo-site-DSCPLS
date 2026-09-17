import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'motion/react';
import { db } from '../lib/firebase';
import { collection, query, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { Play, Pause, Download, Trash2, Mail, ExternalLink, Copy, Check, Radio as RadioIcon, CheckCircle2, Volume2 } from 'lucide-react';
import Newsletter from '../components/Newsletter';
import { useAdminAuth } from '../lib/authUtils';
import { useLanguage } from '../contexts/LanguageContext';

export interface RadioMessageItem {
  id: string;
  senderName: string;
  contact: string;
  location?: string;
  notes?: string;
  audioData: string;
  audioMimeType?: string;
  durationSeconds?: number;
  acceptedTerms: boolean;
  acceptedAt?: string;
  createdAt: number;
}

export default function Admin() {
  const { isAdmin, loginAdmin, logoutAdmin } = useAdminAuth();
  const [subscribers, setSubscribers] = useState<string[]>([]);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const { t } = useLanguage();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);

  // Radio interludes state
  const [radioMessages, setRadioMessages] = useState<RadioMessageItem[]>([]);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!isAdmin) return;
    const q = query(collection(db, 'newsletter_subs'));
    const unsub = onSnapshot(q, (snapshot) => {
      const subs = snapshot.docs.map(doc => doc.data().email as string).filter(Boolean);
      setSubscribers(subs);
    });
    return () => unsub();
  }, [isAdmin]);

  // Real-time listener for fan radio messages
  useEffect(() => {
    if (!isAdmin) return;
    const q = query(collection(db, 'radio_messages'));
    const unsub = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as RadioMessageItem[];
      msgs.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      setRadioMessages(msgs);
    });
    return () => unsub();
  }, [isAdmin]);

  // Clean audio on unmount
  useEffect(() => {
    return () => {
      if (activeAudioRef.current) {
        activeAudioRef.current.pause();
      }
    };
  }, []);

  const handlePlayAudio = (msg: RadioMessageItem) => {
    if (playingId === msg.id) {
      if (activeAudioRef.current) {
        activeAudioRef.current.pause();
      }
      setPlayingId(null);
      return;
    }

    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
    }

    const audio = new Audio(msg.audioData);
    activeAudioRef.current = audio;
    setPlayingId(msg.id);

    audio.onended = () => {
      setPlayingId(null);
    };

    audio.onerror = () => {
      alert("Erro ao reproduzir este áudio.");
      setPlayingId(null);
    };

    audio.play().catch((err) => {
      console.error("Playback error:", err);
      setPlayingId(null);
    });
  };

  const handleDownloadAudio = (msg: RadioMessageItem) => {
    try {
      const link = document.createElement('a');
      link.href = msg.audioData;
      const cleanName = (msg.senderName || 'recado').replace(/[^a-zA-Z0-9_-]/g, '_');
      link.download = `recado-dscpls-${cleanName}-${msg.id.slice(0, 6)}.webm`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      alert("Erro ao baixar áudio.");
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este recado?")) {
      if (playingId === id && activeAudioRef.current) {
        activeAudioRef.current.pause();
        setPlayingId(null);
      }
      try {
        await deleteDoc(doc(db, 'radio_messages', id));
      } catch (e) {
        alert("Erro ao excluir recado.");
      }
    }
  };

  const handleCopyContact = (contact: string, id: string) => {
    navigator.clipboard.writeText(contact);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatTime = (sec?: number) => {
    if (!sec) return '00:00';
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = Math.floor(sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

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
          {/* SEÇÃO RECADOS DA RÁDIO // INTERLÚDIOS DO ÁLBUM */}
          <div className="bg-[#111] border-2 border-[#00DF59]/60 p-6 md:p-8 rounded-lg shadow-[0_0_30px_rgba(0,223,89,0.1)]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#333] pb-6 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <RadioIcon size={20} className="text-[#00DF59]" />
                  <h2 className="text-xl md:text-2xl font-black tracking-widest text-[#00DF59] font-mono uppercase">
                    {t('radio.admin_messages_title')}
                  </h2>
                </div>
                <p className="text-xs md:text-sm text-gray-300 font-mono leading-relaxed">
                  {t('radio.admin_messages_desc')}
                </p>
              </div>
              <div className="bg-black border border-[#FFE600] px-4 py-2 text-right shrink-0">
                <span className="text-[10px] text-gray-400 font-mono block uppercase">Total de Recados</span>
                <span className="text-xl font-mono font-black text-[#FFE600]">{radioMessages.length}</span>
              </div>
            </div>

            {/* List of Messages */}
            {radioMessages.length === 0 ? (
              <div className="bg-black/60 border border-[#222] p-10 text-center rounded">
                <RadioIcon size={36} className="text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400 font-mono text-sm">
                  {t('radio.admin_no_messages')}
                </p>
                <p className="text-xs text-gray-500 font-mono mt-1">
                  Os ouvintes podem gravar áudios de até 40s diretamente na página da Rádio pelo botão "MANDE UM RECADO!".
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {radioMessages.map((msg) => {
                  const isPlayingThis = playingId === msg.id;
                  const isCopied = copiedId === msg.id;
                  const isInstagram = msg.contact.startsWith('@') || (!msg.contact.includes('.') && !msg.contact.includes(' ') && msg.contact.length > 2);
                  const isEmail = msg.contact.includes('@') && msg.contact.includes('.');
                  const cleanInsta = msg.contact.replace('@', '').trim();

                  return (
                    <div 
                      key={msg.id}
                      className="bg-[#0b0805] border-2 border-[#2b180d] hover:border-[#00DF59]/50 rounded-lg p-5 transition-all text-left space-y-4"
                    >
                      {/* Top Info Bar */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[#00DF59] font-black text-base md:text-lg uppercase font-mono">
                              {msg.senderName}
                            </span>
                            {msg.location && (
                              <span className="text-gray-400 text-xs font-mono bg-white/5 px-2 py-0.5 rounded border border-white/10">
                                📍 {msg.location}
                              </span>
                            )}
                            <span className="text-[#FFE600] text-xs font-mono bg-[#FFE600]/10 px-2 py-0.5 rounded border border-[#FFE600]/20">
                              ⏱ {formatTime(msg.durationSeconds)}
                            </span>
                          </div>
                          <span className="text-[10px] text-gray-500 font-mono block mt-1">
                            Enviado em {new Date(msg.createdAt).toLocaleString('pt-BR')}
                          </span>
                        </div>

                        {/* Terms badge */}
                        <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#00DF59] bg-[#00DF59]/10 px-2.5 py-1 rounded border border-[#00DF59]/30 shrink-0">
                          <CheckCircle2 size={14} className="text-[#00DF59]" />
                          <span>Direitos & Interlúdio Autorizados</span>
                        </div>
                      </div>

                      {/* Contact row */}
                      <div className="bg-[#120d09] border border-[#3d2415] p-3 rounded flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
                          <span className="text-gray-400 uppercase font-bold">Contato:</span>
                          <span className="text-white font-bold bg-black px-2 py-1 rounded border border-white/10 select-all">
                            {msg.contact}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          {/* Copy button */}
                          <button
                            onClick={() => handleCopyContact(msg.contact, msg.id)}
                            className="text-xs font-mono px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded border border-white/20 flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            {isCopied ? <Check size={13} className="text-[#00DF59]" /> : <Copy size={13} />}
                            <span>{isCopied ? 'Copiado!' : 'Copiar'}</span>
                          </button>

                          {/* 1-click Instagram link */}
                          {isInstagram && (
                            <a
                              href={`https://instagram.com/${cleanInsta}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-mono px-3 py-1 bg-gradient-to-r from-purple-700/60 to-pink-700/60 hover:from-purple-700 hover:to-pink-700 text-white rounded border border-pink-500/30 flex items-center gap-1.5 transition-colors"
                            >
                              <ExternalLink size={13} />
                              <span>Instagram</span>
                            </a>
                          )}

                          {/* 1-click Email link */}
                          {isEmail && (
                            <a
                              href={`mailto:${msg.contact}?subject=DISC%C3%8DPULOS%20-%20Seu%20recado%20na%20R%C3%A1dio%20pro%20%C3%81lbum!`}
                              className="text-xs font-mono px-3 py-1 bg-[#00DF59]/20 hover:bg-[#00DF59]/30 text-[#00DF59] rounded border border-[#00DF59]/40 flex items-center gap-1.5 transition-colors"
                            >
                              <Mail size={13} />
                              <span>E-mail</span>
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Optional Notes */}
                      {msg.notes && (
                        <div className="text-xs font-mono text-gray-300 bg-black/40 border-l-2 border-[#FFE600] pl-3 py-1 italic">
                          "{msg.notes}"
                        </div>
                      )}

                      {/* Audio Controls Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                        <div className="flex items-center gap-3">
                          {/* Play / Pause button */}
                          <button
                            onClick={() => handlePlayAudio(msg)}
                            className={`px-4 py-2 font-mono text-xs font-black uppercase tracking-wider rounded flex items-center gap-2 border transition-all ${
                              isPlayingThis
                                ? 'bg-[#FFE600] text-black border-[#FFE600] shadow-[0_0_15px_rgba(255,230,0,0.4)]'
                                : 'bg-[#00DF59] hover:bg-[#00DF59]/80 text-black border-[#00DF59]'
                            }`}
                          >
                            {isPlayingThis ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
                            <span>{isPlayingThis ? 'Pausar Áudio' : 'Escutar Áudio'}</span>
                          </button>

                          {/* Download Audio Button */}
                          <button
                            onClick={() => handleDownloadAudio(msg)}
                            className="px-3.5 py-2 bg-transparent hover:bg-white/10 text-gray-200 hover:text-white font-mono text-xs font-bold uppercase tracking-wider rounded border border-white/20 hover:border-[#FFE600] flex items-center gap-1.5 transition-colors"
                            title="Baixar arquivo de áudio no formato original"
                          >
                            <Download size={14} />
                            <span>{t('radio.admin_download')}</span>
                          </button>
                        </div>

                        {/* Delete button */}
                        <button
                          onClick={() => handleDeleteMessage(msg.id)}
                          className="text-gray-500 hover:text-red-400 p-2 transition-colors cursor-pointer"
                          title="Excluir recado"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>

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
