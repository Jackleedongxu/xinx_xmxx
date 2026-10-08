import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Eye, Sparkles, CheckCircle2 } from 'lucide-react';
import { SITE_DATA } from '../data';

export const ContrastSection: React.FC = () => {
  // Track which items have their right side revealed by tap (or all revealed)
  const [revealedIds, setRevealedIds] = useState<number[]>(() =>
    SITE_DATA.contrasts.map((c) => c.id) // Default all revealed for smooth reading, but with interactive highlight
  );
  const [spotlightId, setSpotlightId] = useState<number | null>(null);

  const toggleReveal = (id: number) => {
    setRevealedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
    setSpotlightId(id);
  };

  return (
    <section id="contrasts" className="py-20 sm:py-28 px-4 sm:px-6 max-w-4xl mx-auto relative">
      {/* Module Title & Intro */}
      <div className="text-center mb-14 sm:mb-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100/70 border border-pink-200 text-xs font-sans text-pink-700 mb-3">
          <Sparkles className="w-3 h-3 text-pink-500" />
          <span>核心记录 · 对照</span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-medium text-pink-950 mb-3 tracking-wide">
          双栏对照
        </h2>
        <p className="text-sm sm:text-base text-rose-800/70 font-light max-w-md mx-auto">
          左边是我当时以为的，右边是后来的实情。
        </p>
      </div>

      {/* Column Headers for Desktop */}
      <div className="hidden sm:grid grid-cols-2 gap-6 pb-4 px-4 text-xs font-sans tracking-widest text-rose-400 border-b border-pink-100">
        <div className="pl-2">当时以为的</div>
        <div className="pl-2">后来的实情</div>
      </div>

      {/* 8 Contrast Groups */}
      <div className="space-y-4 sm:space-y-5 mt-4">
        {SITE_DATA.contrasts.map((item, index) => {
          const isRevealed = revealedIds.includes(item.id);
          const isSpotlight = spotlightId === item.id;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
              onClick={() => toggleReveal(item.id)}
              className={`group relative rounded-2xl sm:rounded-3xl p-5 sm:p-6 transition-all duration-300 border cursor-pointer ${
                isSpotlight
                  ? 'bg-white/95 border-pink-300 shadow-[0_12px_32px_rgba(244,114,182,0.18)] scale-[1.01]'
                  : 'bg-white/70 hover:bg-white/90 border-pink-100/80 hover:border-pink-200/90 shadow-[0_4px_20px_rgba(251,207,232,0.12)]'
              }`}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 items-center">
                {/* Left: What I thought */}
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full bg-pink-50 border border-pink-200/60 text-[11px] font-sans font-medium text-rose-400">
                    {index + 1}
                  </span>
                  <div>
                    <span className="block sm:hidden text-[11px] font-sans text-rose-300 mb-0.5 tracking-wider">
                      我当时以为的
                    </span>
                    <p className="text-base sm:text-[17px] text-[#6b5560] font-normal leading-relaxed">
                      {item.thought}
                    </p>
                  </div>
                </div>

                {/* Right: The truth */}
                <div className="relative pt-3 sm:pt-0 sm:border-l sm:border-pink-100 sm:pl-6 border-t sm:border-t-0 border-pink-100/70">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <span className="block sm:hidden text-[11px] font-sans text-pink-500 font-medium mb-0.5 tracking-wider">
                        后来的实情
                      </span>
                      <motion.p
                        initial={false}
                        animate={{
                          opacity: isRevealed ? 1 : 0.35,
                          filter: isRevealed ? 'blur(0px)' : 'blur(2px)',
                        }}
                        transition={{ duration: 0.4 }}
                        className={`text-base sm:text-[17px] font-medium leading-relaxed ${
                          isRevealed ? 'text-pink-950 font-medium' : 'text-rose-400/70 select-none'
                        }`}
                      >
                        {item.truth}
                      </motion.p>
                    </div>

                    {!isRevealed && (
                      <span className="flex-shrink-0 inline-flex items-center gap-1 text-[11px] text-pink-400 bg-pink-50 px-2 py-0.5 rounded-full">
                        <Eye className="w-3 h-3" /> 点击
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Sweet indicator line on hover */}
              <div className="absolute inset-x-8 -bottom-[1px] h-[1px] bg-gradient-to-r from-transparent via-pink-200/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          );
        })}
      </div>

      <div className="text-center mt-8">
        <p className="text-xs text-rose-400/80 font-sans tracking-wider">
          轻触任意卡片聚焦对照
        </p>
      </div>
    </section>
  );
};
