import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export const ScrollToTop: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      title="Revenir en haut de la page"
      aria-label="Retour en haut"
      className="fixed bottom-6 right-6 z-50 p-3 bg-slate-900/90 dark:bg-emerald-600/90 text-white hover:bg-slate-800 dark:hover:bg-emerald-500 rounded-full shadow-lg border border-slate-700 dark:border-emerald-400 backdrop-blur-sm transition-all transform hover:scale-105 active:scale-95 cursor-pointer no-print"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
};
