import React, { useEffect, useState } from 'react';

export default function EasterEggTrigger({ onTrigger, active }: { onTrigger: () => void, active: boolean }) {
  const [clickCount, setClickCount] = useState(0);
  const [keySequence, setKeySequence] = useState('');

  useEffect(() => {
    if (active) return;

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

    const handleKeyDown = (e: KeyboardEvent) => {
      setKeySequence(prev => {
        let seq = prev + e.key.toUpperCase();
        if (seq.length > 6) seq = seq.slice(-6);
        if (seq === 'DSCPLS') {
          setTimeout(() => onTrigger(), 0);
        }
        return seq;
      });
    };

    document.addEventListener('click', handleGlobalClick);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(clickTimer);
      document.removeEventListener('click', handleGlobalClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [active, onTrigger]);

  return null;
}
