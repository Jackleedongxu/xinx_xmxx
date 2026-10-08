import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Sparkles, X, Heart } from 'lucide-react';
import { SITE_DATA, DictionaryItem } from '../data';

export const DictionarySection: React.FC = () => {
  const [selectedTerm, setSelectedTerm] = useState<DictionaryItem | null>(null);

  return (
    <section id="dictionary" className="py-20 sm:py-28 px-4 sm:px-6 max-w-4xl mx-auto relative">
      {/* Decorative ambient aura */}
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-pink-100/50 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Module Title */}
      <div className="text-center mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100/70 border border-pink-200 text-xs font-sans text-pink-700 mb-3">
          <BookOpen className="w-3 h-3 text-pink-500" />
          <span>词条归档</span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-medium text-pink-950 mb-3 tracking-wide">
          我们的词典
        </h2>
        <p className="text-sm sm:text-base text-rose-800/70 font-light max-w-md mx-auto">
          轻触每个词条，查看它的来历。
        </p>
      </div>

      {/* Tag Cloud / Pill Cards Grid */}
      <div className="flex flex-wrap justify-center gap-3 sm:gap-4 max-w-2xl mx-auto">
        {SITE_DATA.dictionary.map((item, index) => {
          const isSelected = selectedTerm?.term === item.term;
          const isSpecialLight = item.term === '慢慢';

          return (
            <motion.button
              key={item.term}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              onClick={() => setSelectedTerm(isSelected ? null : item)}
              className={`group relative px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-base sm:text-lg font-serif transition-all duration-300 border cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white border-pink-400 shadow-[0_6px_20px_rgba(244,114,182,0.35)] scale-105'
                  : isSpecialLight
                  ? 'bg-white/80 hover:bg-white text-rose-800 border-pink-200 hover:border-pink-300 shadow-[0_2px_10px_rgba(251,207,232,0.15)] hover:shadow-[0_4px_16px_rgba(244,114,182,0.2)]'
                  : 'bg-white/70 hover:bg-white text-pink-950 border-pink-150 hover:border-pink-300 shadow-[0_2px_10px_rgba(251,207,232,0.12)] hover:shadow-[0_4px_16px_rgba(244,114,182,0.2)]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span>{item.term}</span>
                {item.pinyin && (
                  <span
                    className={`text-[11px] font-sans transition-colors ${
                      isSelected ? 'text-pink-100' : 'text-rose-400 group-hover:text-pink-500'
                    }`}
                  >
                    {item.pinyin}
                  </span>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Details Box */}
      <div className="mt-8 min-h-[120px] max-w-xl mx-auto">
        <AnimatePresence mode="wait">
          {selectedTerm ? (
            <motion.div
              key={selectedTerm.term}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="bg-white/90 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 border border-pink-200/90 shadow-[0_10px_30px_rgba(244,114,182,0.15)] relative"
            >
              <button
                type="button"
                onClick={() => setSelectedTerm(null)}
                aria-label="关闭词条卡片"
                className="absolute top-4 right-4 p-1.5 rounded-full text-rose-300 hover:text-pink-600 hover:bg-pink-50 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl font-serif font-medium text-pink-950">
                  {selectedTerm.term}
                </span>
                {selectedTerm.pinyin && (
                  <span className="text-xs font-sans text-rose-400">
                    [{selectedTerm.pinyin}]
                  </span>
                )}
              </div>

              <div className="h-[1px] w-12 bg-pink-200 my-2.5" />

              <p className="text-sm sm:text-base text-[#5c4953] leading-relaxed font-normal">
                {selectedTerm.origin}
              </p>
            </motion.div>
          ) : (
            <div className="text-center py-6 text-xs sm:text-sm text-rose-400/80 font-sans tracking-wide">
              轻触上方词条标签查看出处
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
