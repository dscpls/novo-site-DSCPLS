import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { useAdminAuth } from '../lib/authUtils';
import { useLanguage } from '../contexts/LanguageContext';

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
      alert("Erro ao publicar.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Apagar registro?")) return;
    try {
      await deleteDoc(doc(db, 'diario', id));
    } catch (error) {
      console.error(error);
      alert("Erro ao deletar.");
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
        <h1 className="text-3xl tracking-[0.2em] font-light text-white">{t('diario.title')}</h1>
        <div className="h-[1px] flex-1 bg-gradient-to-r from-red-500/50 to-transparent"></div>
        {isAdmin ? (
          <button onClick={logoutAdmin} className="text-xs text-red-500 hover:text-red-400 border border-red-500/30 px-3 py-1">{t('diario.logout_btn')}</button>
        ) : (
          <a href="/admin" className="text-xs text-gray-500 hover:text-white border border-gray-500/30 px-3 py-1 cursor-pointer">{t('diario.admin_btn')}</a>
        )}
      </div>

      {isAdmin && (
        <div className="bg-[#111] border border-[#222] p-6 mb-12 space-y-4">
          <h2 className="text-red-500 text-sm tracking-widest">{">"} {t('diario.new_entry')}</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input 
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder={t('diario.entry_title')}
              className="bg-[#050505] border border-[#333] text-white p-3 focus:outline-none focus:border-red-500 transition-colors"
            />
            <textarea 
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder={t('diario.entry_msg')}
              rows={5}
              className="bg-[#050505] border border-[#333] text-white p-3 focus:outline-none focus:border-red-500 transition-colors resize-none"
            />
            <button type="submit" className="bg-red-900/50 text-white py-3 border border-red-500 hover:bg-red-500 transition-colors tracking-widest text-sm">
              {t('diario.publish')}
            </button>
          </form>
        </div>
      )}

      <div className="space-y-12">
        {entries.length === 0 ? (
          <p className="text-gray-600 text-center uppercase tracking-widest text-sm">Nenhum registro encontrado no vazio.</p>
        ) : (
          entries.map(entry => (
            <div key={entry.id} className="border-l-2 border-[#ff3e3e] pl-6 py-2 relative group">
              {isAdmin && (
                <button 
                  onClick={() => handleDelete(entry.id)}
                  className="absolute -left-10 top-2 text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  title={t('diario.delete')}
                >
                  ✕
                </button>
              )}
              <h3 className="text-white text-xl font-medium tracking-wide mb-1">{entry.title}</h3>
              <p className="text-xs text-gray-500 tracking-widest mb-4">
                {entry.createdAt?.toDate ? entry.createdAt.toDate().toLocaleDateString('pt-BR') : 'Agora'}
              </p>
              <div className="text-gray-300 font-light leading-relaxed whitespace-pre-wrap">
                {entry.content}
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}
