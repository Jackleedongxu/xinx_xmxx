import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Package, ChevronDown, ChevronUp } from 'lucide-react';
import { SITE_DATA } from '../data';

export const TimelineSection: React.FC = () => {
  // Store expanded item IDs
  const [expandedIds, setExpandedIds] = useState<number[]>([1, 2]);

  const toggleExpand = (id: number) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const expandAll = () => {
    if (expandedIds.length === SITE_DATA.objectsTimeline.length) {
      setExpandedIds([]);
    } else {
      setExpandedIds(SITE_DATA.objectsTimeline.map((item) => item.id));
    }
  };

  return (
    <section id="timeline" className="py-20 sm:py-28 px-4 sm:px-6 max-w-3xl mx-auto relative">
      {/* Module Title */}
      <div className="text-center mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100/70 border border-pink-200 text-xs font-sans text-pink-700 mb-3">
          <Package className="w-3 h-3 text-pink-500" />
          <span>时间线</span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-medium text-pink-950 mb-3 tracking-wide">
          那些物件
        </h2>
        <p className="text-sm sm:text-base text-rose-800/70 font-light max-w-md mx-auto">
          不用日期做节点，用物件做节点。轻触节点展开细节。
        </p>

        <button
          onClick={expandAll}
          className="mt-4 text-xs font-sans text-pink-600 hover:text-pink-700 bg-pink-50 hover:bg-pink-100/70 px-3 py-1 rounded-full border border-pink-200/80 transition cursor-pointer"
        >
          {expandedIds.length === SITE_DATA.objectsTimeline.length ? '全部收起' : '全部展开'}
        </button>
      </div>

      {/* Vertical Timeline Container */}
      <div className="relative pl-6 sm:pl-10">
        {/* Continuous sweet pink timeline line */}
        <div className="absolute left-[15px] sm:left-[23px] top-4 bottom-6 w-[2px] bg-gradient-to-b from-pink-200 via-rose-300 to-pink-200" />

        <div className="space-y-6 sm:space-y-8">
          {SITE_DATA.objectsTimeline.map((item, index) => {
            const isExpanded = expandedIds.includes(item.id);

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.5, delay: index * 0.06 }}
                className="relative"
              >
                {/* Node Dot / Heart Icon */}
                <button
                  type="button"
                  onClick={() => toggleExpand(item.id)}
                  aria-expanded={isExpanded}
                  aria-label={`${item.word}：${isExpanded ? '收起详情' : '展开详情'}`}
                  className={`absolute -left-[27px] sm:-left-[39px] top-3.5 w-6 sm:w-8 h-6 sm:h-8 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer ${
                    isExpanded
                      ? 'bg-pink-400 text-white shadow-[0_0_12px_rgba(244,114,182,0.6)] scale-110'
                      : 'bg-white border-2 border-pink-300 text-pink-400 hover:border-pink-400 shadow-xs'
                  }`}
                >
                  <span className="text-[10px] sm:text-xs font-sans font-semibold">
                    {item.id}
                  </span>
                </button>

                {/* Timeline Card */}
                <div
                  onClick={() => toggleExpand(item.id)}
                  className={`rounded-2xl sm:rounded-3xl p-4 sm:p-6 transition-all duration-300 border cursor-pointer ${
                    isExpanded
                      ? 'bg-white/95 border-pink-200/90 shadow-[0_8px_24px_rgba(244,114,182,0.15)]'
                      : 'bg-white/60 hover:bg-white/85 border-pink-100/70 shadow-[0_2px_10px_rgba(251,207,232,0.1)]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg sm:text-xl font-medium font-serif text-pink-950">
                        {item.word}
                      </h3>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-rose-400 font-sans">
                      <span>{isExpanded ? '收起' : '展开'}</span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-pink-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-pink-300" />
                      )}
                    </div>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.35, ease: 'easeOut' }}
                        className="overflow-hidden"
                      >
                        <div className="mt-3.5 pt-3 border-t border-pink-100/70">
                          <p className="text-sm sm:text-base text-[#5c4953] leading-relaxed font-normal">
                            {item.detail}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
