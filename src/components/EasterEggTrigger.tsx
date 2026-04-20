import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function EasterEggTrigger({ onTrigger, active }: { onTrigger: () => void, active: boolean }) {
  const [clickCount, setClickCount] = useState(0);
  const location = useLocation();

  useEffect(() => {
    if (active) return;
    if (location.pathname === '/quiz') return; // Do not trigger CRT on the quiz page

    let clickTimer: ReturnType<typeof setTimeout>;

    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target && target.id === 'easter-logo') {
        setClickCount(prev => {
          const newCount = prev + 1;
          if (newCount >= 3) {
            setTimeout(() => onTrigger(), 0);
            return 0;
          }
          return newCount;
        });

        clearTimeout(clickTimer);
        clickTimer = setTimeout(() => {
          setClickCount(0);
        }, 1200);
      }
    };

    let keySeq = '';
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore keydown when typing in inputs
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (location.pathname === '/quiz') return; // Do not trigger keyboard DSCPLS on quiz page

      keySeq = (keySeq + e.key.toUpperCase()).slice(-6);
      if (keySeq === 'DSCPLS') {
        setTimeout(() => onTrigger(), 0);
      }
    };

    document.addEventListener('click', handleGlobalClick);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(clickTimer);
      document.removeEventListener('click', handleGlobalClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [active, onTrigger, location.pathname]);

  return null;
}
