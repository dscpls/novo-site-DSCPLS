import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { useAdminAuth } from '../lib/authUtils';
import { useLanguage } from '../contexts/LanguageContext';
import { BookOpen, Plus, Trash2, LogOut, Lock } from 'lucide-react';

interface DiaryEntry {
  id: string;
  title: string;
  content: string;
  createdAt: any;
}

export default function Diario() {
  const { isAdmin, logoutAdmin } = useAdminAuth();
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const q = query(collection(db, 'diario'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const posts: DiaryEntry[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as DiaryEntry[];
      setEntries(posts);
    });
    return () => unsub();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'diario'), {
        title: title.trim(),
        content: content.trim(),
        createdAt: serverTimestamp()
      });
      setTitle('');
      setContent('');
    } catch (error) {
      console.error(error);
      alert("Erro ao publicar no diário.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Confirmar exclusão deste registro?")) return;
    try {
      await deleteDoc(doc(db, 'diario', id));
    } catch (error) {
      console.error(error);
      alert("Erro ao deletar registro.");
    }
  };

  const formatDate = (ts: any) => {
    if (!ts) return 'HOJE';
    if (ts.toDate) {
      const d = ts.toDate();
      return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }
    return 'HOJE';
  };

  return (
    <div className="w-full max-w-4xl mx-auto pb-24 space-y-12">
      
      {/* Header */}
      <div className="border-b-2 border-[#FFFFFF]/15 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="font-mono text-xs text-[#00DF59] uppercase tracking-[0.25em] mb-2 flex items-center gap-2">
              <BookOpen size={14} />
              <span>CADERNO DE CAMPO & ATUALIZAÇÕES</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white">
              {t('diario.title')}
            </h1>
          </div>

          <div className="font-mono text-xs">
            {isAdmin ? (
              <button
                onClick={logoutAdmin}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#FFE600]/40 text-[#FFE600] hover:bg-[#FFE600] hover:text-black transition-colors uppercase font-bold"
              >
                <LogOut size={13} />
                <span>{t('diario.logout_btn')}</span>
              </button>
            ) : (
              <a
                href="/admin"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#FFFFFF]/15 text-[#E0E0E0]/50 hover:text-white hover:border-white transition-colors uppercase"
              >
                <Lock size={12} />
                <span>{t('diario.admin_btn')}</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Admin Publish Box */}
      {isAdmin && (
        <section className="border-2 border-[#00DF59] bg-[#111111] p-6 space-y-4">
          <div className="font-mono text-xs text-[#00DF59] uppercase tracking-wider font-bold flex items-center gap-2">
            <Plus size={14} />
            <span>NOVA ENTRADA NO DIÁRIO</span>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input 
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder={t('diario.entry_title')}
              className="bg-[#080706] border border-[#FFFFFF]/20 text-white p-3 font-mono text-sm focus:outline-none focus:border-[#00DF59] transition-colors"
              required
            />
            <textarea 
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder={t('diario.entry_msg')}
              rows={5}
              className="bg-[#080706] border border-[#FFFFFF]/20 text-white p-3 font-sans text-sm focus:outline-none focus:border-[#00DF59] transition-colors resize-none leading-relaxed"
              required
            />
            <button 
              type="submit" 
              disabled={submitting}
              className="bg-[#00DF59] text-black py-3 font-mono text-xs uppercase font-bold tracking-widest hover:bg-[#FFE600] transition-colors self-start px-6 disabled:opacity-50"
            >
              {submitting ? 'PUBLICANDO...' : t('diario.publish')}
            </button>
          </form>
        </section>
      )}

      {/* Diary Entries List */}
      <div className="space-y-8">
        {entries.length === 0 ? (
          <div className="p-12 border-2 border-dashed border-[#FFFFFF]/15 text-center font-mono text-xs text-[#E0E0E0]/50 uppercase tracking-widest">
            Nenhum registro encontrado no diário.
          </div>
        ) : (
          entries.map((entry, idx) => (
            <article 
              key={entry.id} 
              className="border-2 border-[#FFFFFF]/15 bg-[#111111] p-6 sm:p-8 space-y-4 relative group"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#FFFFFF]/10 pb-3">
                <span className="font-mono text-xs text-[#FFE600] uppercase tracking-widest tabular-nums">
                  REGISTRO #{entries.length - idx} · {formatDate(entry.createdAt)}
                </span>
                
                {isAdmin && (
                  <button 
                    onClick={() => handleDelete(entry.id)}
                    className="text-red-400 hover:text-red-300 p-1 font-mono text-xs uppercase flex items-center gap-1"
                    title={t('diario.delete')}
                  >
                    <Trash2 size={13} />
                    <span>EXCLUIR</span>
                  </button>
                )}
              </div>

              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                {entry.title}
              </h2>

              <div className="text-base sm:text-lg text-[#E0E0E0]/85 font-sans leading-relaxed whitespace-pre-wrap max-w-[70ch]">
                {entry.content}
              </div>
            </article>
          ))
        )}
      </div>

    </div>
  );
}
