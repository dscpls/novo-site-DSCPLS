import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, translations } from '../lib/i18n';

interface LanguageContextType {
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: keyof typeof translations.pt) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>('pt');

  useEffect(() => {
    const saved = localStorage.getItem('dscpls_lang') as Language;
    if (saved && (saved === 'pt' || saved === 'en' || saved === 'es')) {
      setLang(saved);
    }
  }, []);

  const changeLang = (l: Language) => {
    setLang(l);
    localStorage.setItem('dscpls_lang', l);
  };

  const t = (key: keyof typeof translations.pt) => {
    const dict = translations[lang] || translations.pt;
    return dict[key] || translations.pt[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang: changeLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
}
