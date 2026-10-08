import React from 'react';
import { motion } from 'motion/react';
import { Heart, Sparkles, ChevronDown } from 'lucide-react';
import { SITE_DATA } from '../data';

interface HeroSectionProps {
  onStart: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onStart }) => {
  const handleStartClick = () => {
    try {
      (window as any).playSiteAudio?.();
    } catch {
      // ignore
    }
    window.dispatchEvent(new CustomEvent('play-site-music'));
    onStart();
  };

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-4 sm:px-6 pt-16 pb-20 overflow-hidden">
      {/* Decorative ambient glowing orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-pink-200/40 rounded-full blur-3xl pointer-events-none -z-10 animate-soft-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-48 sm:w-64 h-48 sm:h-64 bg-rose-200/35 rounded-full blur-2xl pointer-events-none -z-10" />

      {/* Sweet micro badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 backdrop-blur-md border border-pink-200/80 shadow-[0_2px_12px_rgba(244,114,182,0.1)] mb-8"
      >
        <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-400" />
        <span className="text-xs sm:text-sm font-sans tracking-widest text-pink-700 font-medium">
          {SITE_DATA.cover.subTitleTag}
        </span>
        <Sparkles className="w-3.5 h-3.5 text-pink-400" />
      </motion.div>

      {/* Main Title */}
      <motion.h1
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.1, ease: "easeOut" }}
        className="text-4xl sm:text-6xl md:text-7xl font-serif font-semibold tracking-tight text-pink-950 mb-6 drop-shadow-xs"
      >
        {SITE_DATA.cover.mainTitle}
      </motion.h1>

      {/* Decorative divider */}
      <motion.div
        initial={{ opacity: 0, width: 0 }}
        animate={{ opacity: 1, width: "6rem" }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="h-[2px] bg-gradient-to-r from-transparent via-pink-300 to-transparent mb-7"
      />

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.4 }}
        className="max-w-md sm:max-w-xl text-base sm:text-lg text-rose-800/80 leading-relaxed font-light mb-12 px-2"
      >
        {SITE_DATA.cover.tagline}
      </motion.p>

      {/* Action button */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <button
          onClick={handleStartClick}
          className="group relative inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-gradient-to-r from-pink-400 via-rose-400 to-pink-400 text-white font-medium text-sm sm:text-base tracking-wider shadow-[0_8px_20px_rgba(244,114,182,0.3)] hover:shadow-[0_12px_28px_rgba(244,114,182,0.45)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer"
        >
          <span>{SITE_DATA.cover.buttonText}</span>
          <ChevronDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
        </button>
      </motion.div>

      {/* Bottom hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-6 flex flex-col items-center gap-1 text-xs text-rose-400/80"
      >
        <span>安静翻阅</span>
      </motion.div>
    </section>
  );
};
