import React from 'react';
import { motion } from 'motion/react';
import { BookmarkCheck, HeartHandshake, Compass } from 'lucide-react';
import { SITE_DATA } from '../data';

export const IouSection: React.FC = () => {
  return (
    <section id="ious" className="py-20 sm:py-28 px-4 sm:px-6 max-w-5xl mx-auto relative">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-80 h-80 bg-pink-100/60 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Module Title */}
      <div className="text-center mb-14 sm:mb-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100/70 border border-pink-200 text-xs font-sans text-pink-700 mb-3">
          <BookmarkCheck className="w-3 h-3 text-pink-500" />
          <span>四条欠条</span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-medium text-pink-950 mb-3 tracking-wide">
          她记下的四件事，和我这边的实情
        </h2>
        <p className="text-sm sm:text-base text-rose-800/70 font-light max-w-md mx-auto">
          那些被记下的时刻，和后来才明白的道理。
        </p>
      </div>

      {/* Desktop Column Header */}
      <div className="hidden lg:grid grid-cols-12 gap-4 pb-3 px-6 text-xs font-sans tracking-widest text-rose-400 border-b border-pink-100">
        <div className="col-span-3">她记的</div>
        <div className="col-span-4">我当时的实情</div>
        <div className="col-span-5 text-pink-600 font-medium">我后来明白的</div>
      </div>

      {/* 4 Cards */}
      <div className="space-y-4 sm:space-y-6 mt-4">
        {SITE_DATA.ious.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="bg-white/80 backdrop-blur-xs rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-pink-150/70 shadow-[0_6px_24px_rgba(251,207,232,0.15)] hover:shadow-[0_10px_32px_rgba(244,114,182,0.2)] transition-all duration-300"
          >
            {/* Card Index Tag */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-pink-100/60 lg:hidden">
              <span className="text-xs font-sans font-medium text-pink-500 bg-pink-50 px-2.5 py-0.5 rounded-full">
                条目 0{item.id}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-4 items-center">
              {/* Column 1: Recorded by her */}
              <div className="lg:col-span-3">
                <span className="lg:hidden block text-xs font-sans text-rose-400 mb-1">
                  她记的
                </span>
                <div className="flex items-start gap-2.5">
                  <span className="hidden lg:inline-flex items-center justify-center w-5 h-5 rounded-full bg-pink-100 text-[10px] text-pink-600 font-sans font-medium mt-0.5">
                    {item.id}
                  </span>
                  <p className="text-base sm:text-lg font-medium text-pink-900 leading-snug">
                    {item.recordedByHer}
                  </p>
                </div>
              </div>

              {/* Column 2: My reality then */}
              <div className="lg:col-span-4 lg:border-l lg:border-pink-100/80 lg:pl-5">
                <span className="lg:hidden block text-xs font-sans text-rose-400 mb-1">
                  我当时的实情
                </span>
                <p className="text-sm sm:text-base text-[#6b5560] leading-relaxed font-normal">
                  {item.myRealityThen}
                </p>
              </div>

              {/* Column 3: My realization now */}
              <div className="lg:col-span-5 lg:border-l lg:border-pink-100/80 lg:pl-5 bg-pink-50/50 lg:bg-transparent p-3.5 lg:p-0 rounded-xl">
                <div className="flex items-center gap-1.5 lg:hidden mb-1 text-xs font-sans text-pink-600 font-medium">
                  <Compass className="w-3.5 h-3.5" />
                  <span>我后来明白的</span>
                </div>
                <p className="text-sm sm:text-base text-pink-950 font-medium leading-relaxed italic lg:not-italic">
                  “{item.myRealizationNow}”
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
