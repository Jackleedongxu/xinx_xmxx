import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, Sparkles } from 'lucide-react';
import { SITE_DATA } from '../data';

export const LockedBoxSection: React.FC = () => {
  const [shakeCount, setShakeCount] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const handleBoxClick = () => {
    setShakeCount((prev) => prev + 1);
    setShowHint(true);
  };

  return (
    <section id="locked-box" className="py-24 sm:py-32 px-4 sm:px-6 max-w-xl mx-auto text-center relative">
      {/* Gentle ambient halo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-100/70 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Box / Padlock container */}
      <div className="relative inline-block mb-10">
        <motion.div
          key={shakeCount}
          animate={shakeCount > 0 ? { x: [-3, 3, -3, 3, -2, 2, 0] } : {}}
          transition={{ duration: 0.45 }}
          onClick={handleBoxClick}
          className="relative group w-36 h-36 sm:w-44 sm:h-44 mx-auto rounded-3xl bg-gradient-to-b from-white/95 to-pink-50/90 border-2 border-pink-200/90 shadow-[0_12px_36px_rgba(244,114,182,0.18)] flex flex-col items-center justify-center cursor-pointer select-none transition-transform active:scale-95"
        >
          {/* Subtle decorative bow/rim at top */}
          <div className="w-16 h-2 bg-pink-200/70 rounded-full mb-3" />

          {/* Padlock Icon */}
          <div className="relative p-4 rounded-2xl bg-pink-100/70 text-rose-400 group-hover:text-pink-600 transition-colors">
            <Lock className="w-8 h-8 sm:w-10 sm:h-10" />
            <Sparkles className="w-3.5 h-3.5 text-pink-300 absolute -top-1 -right-1" />
          </div>

          <span className="text-[11px] font-sans text-rose-400/80 mt-2 tracking-wider">
            密封
          </span>
        </motion.div>
      </div>

      {/* Text from PRD */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="space-y-2 mb-6"
      >
        <p className="text-lg sm:text-xl font-serif text-pink-950 font-normal">
          {SITE_DATA.lockedBox.line1}
        </p>
        <p className="text-lg sm:text-xl font-serif text-pink-900 font-medium">
          {SITE_DATA.lockedBox.line2}
        </p>
      </motion.div>

      {/* Gentle feedback when clicked */}
      <div className="h-6">
        {showHint && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-rose-400 font-sans tracking-wide"
          >
            {SITE_DATA.lockedBox.tip}
          </motion.p>
        )}
      </div>
    </section>
  );
};
