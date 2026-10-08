import React, { useState, useEffect } from 'react';
import { Heart, Sparkles } from 'lucide-react';
import { SITE_DATA } from '../data';

export const HeaderNav: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }

      const sections = ['contrasts', 'ious', 'timeline', 'dictionary', 'locked-box'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navItems = [
    { id: 'contrasts', label: '双栏对照' },
    { id: 'ious', label: '四条欠条' },
    { id: 'timeline', label: '物件' },
    { id: 'dictionary', label: '词典' },
    { id: 'locked-box', label: '锁' },
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-50 pointer-events-none">
      {/* Top Reading Progress Bar */}
      <div className="h-[2.5px] w-full bg-pink-100/60">
        <div
          className="h-full bg-gradient-to-r from-pink-400 to-rose-400 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Floating Center Navbar */}
      <div className="max-w-2xl mx-auto px-4 pt-3.5 flex justify-center">
        <nav className="pointer-events-auto inline-flex items-center gap-1 sm:gap-2 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-pink-200/80 shadow-[0_4px_16px_rgba(244,114,182,0.12)]">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-serif font-medium text-pink-900 hover:text-pink-600 transition cursor-pointer"
          >
            <Heart className="w-3 h-3 text-pink-400 fill-pink-300" />
            <span className="hidden xs:inline">{SITE_DATA.cover.mainTitle}</span>
          </button>

          <span className="w-[1px] h-3 bg-pink-200 hidden xs:inline" />

          <div className="flex items-center gap-0.5 sm:gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`px-2 sm:px-2.5 py-1 rounded-full text-xs font-sans transition-colors cursor-pointer ${
                  activeSection === item.id
                    ? 'bg-pink-100/90 text-pink-700 font-medium'
                    : 'text-rose-800/70 hover:text-pink-600 hover:bg-pink-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
};
