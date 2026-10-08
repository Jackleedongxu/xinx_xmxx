import React from 'react';
import { motion } from 'motion/react';
import { Heart } from 'lucide-react';
import { SITE_DATA } from '../data';

export const EndingSection: React.FC = () => {
  return (
    <section className="min-h-[85vh] flex flex-col items-center justify-center text-center px-6 py-20 relative bg-gradient-to-b from-transparent via-pink-100/30 to-pink-50/60">
      {/* Gentle center glow */}
      <div className="w-48 sm:w-64 h-48 sm:h-64 bg-pink-200/30 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-md sm:max-w-lg mx-auto space-y-10 sm:space-y-12">
        {/* Line 1: 8 条语音。0 条回复。 */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <p className="text-xl sm:text-2xl font-serif text-[#6b5560] font-normal tracking-wide">
            {SITE_DATA.ending.line1}
          </p>
        </motion.div>

        {/* Subtle floral/heart divider */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex justify-center"
        >
          <div className="inline-flex items-center gap-2 text-pink-300">
            <span className="w-8 h-[1px] bg-pink-200" />
            <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-300/60" />
            <span className="w-8 h-[1px] bg-pink-200" />
          </div>
        </motion.div>

        {/* Line 2: 我以前冷漠，并没有什么好结果。我决定重新爱一次。 */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
          className="space-y-2"
        >
          {SITE_DATA.ending.line2.split('\n').map((line, idx) => (
            <p
              key={idx}
              className="text-xl sm:text-2xl font-serif text-pink-950 font-medium leading-relaxed"
            >
              {line}
            </p>
          ))}
        </motion.div>
      </div>

      {/* Gentle silent footer */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.6 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 1 }}
        className="mt-24 text-xs font-sans text-rose-400/80 tracking-widest"
      >
        <span>10.2 — 10.7 记录</span>
      </motion.div>
    </section>
  );
};
