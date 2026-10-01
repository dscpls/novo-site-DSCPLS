import React, { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { useAdminAuth } from '../lib/authUtils';
import { useLanguage } from '../contexts/LanguageContext';
import { Plus, Trash2, LogOut } from 'lucide-react';

interface DiaryEntry {
  id: string;
  title: string;
  content: string;
  createdAt: any;
}

export default function Diario() {
  const { isAdmin, logoutAdmin } = useAdminAuth();
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    const q = query(collection(db, 'diario'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const posts: DiaryEntry[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as DiaryEntry[];
        setEntries(posts);
        setIsLoading(false);
      },
      (error) => {
        console.error('Error fetching diary entries:', error);
        setHasError(true);
        setIsLoading(false);
      }
    );
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
    if (!ts) return 'Hoje';
    if (ts.toDate) {
      const d = ts.toDate();
      return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }
    return 'Hoje';
  };

  return (
    <div className="w-full max-w-3xl mx-auto pb-24 space-y-12">
      
      {/* Header (No public admin login link, admin actions only when logged in) */}
      <div className="border-b-2 border-[#FFFFFF]/15 pb-6">
        <div className="flex items-end justify-between gap-4">
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white">
            {t('diario.title')}
          </h1>

          {isAdmin && (
            <button
              onClick={logoutAdmin}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#FFE600]/40 text-[#FFE600] hover:bg-[#FFE600] hover:text-black transition-colors font-mono text-xs uppercase font-bold"
            >
              <LogOut size={13} />
              <span>{t('diario.logout_btn')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Admin Publish Box */}
      {isAdmin && (
        <section className="border-2 border-[#00DF59] bg-[#111111] p-6 space-y-4">
          <div className="font-mono text-xs text-[#00DF59] uppercase tracking-wider font-bold flex items-center gap-2">
            <Plus size={14} />
            <span>Nova entrada no diário</span>
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
              {submitting ? 'Publicando...' : t('diario.publish')}
            </button>
          </form>
        </section>
      )}

      {/* Diary Entries List - Clean broadsheet spacing & simple dividers */}
      <div className="space-y-12">
        {isLoading ? (
          <div className="py-12 text-center font-mono text-xs text-[#E0E0E0]/60 uppercase tracking-wider">
            Carregando registros...
          </div>
        ) : hasError ? (
          <div className="py-12 text-center font-mono text-xs text-red-400 uppercase tracking-wider">
            Erro ao carregar o diário. Verifique sua conexão.
          </div>
        ) : entries.length === 0 ? (
          <div className="py-12 text-center font-mono text-xs text-[#E0E0E0]/50 uppercase tracking-wider">
            Nenhum registro encontrado.
          </div>
        ) : (
          entries.map((entry) => (
            <article 
              key={entry.id} 
              className="border-b border-[#FFFFFF]/15 pb-10 space-y-3 relative"
            >
              <div className="flex items-center justify-between gap-4 font-mono text-xs text-[#E0E0E0]/60">
                <time className="tabular-nums text-[#FFE600]">{formatDate(entry.createdAt)}</time>
                
                {isAdmin && (
                  <button 
                    onClick={() => handleDelete(entry.id)}
                    className="text-red-400 hover:text-red-300 font-mono text-xs uppercase flex items-center gap-1"
                    title={t('diario.delete')}
                  >
                    <Trash2 size={13} />
                    <span>Excluir</span>
                  </button>
                )}
              </div>

              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
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
