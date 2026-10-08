import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Image as ImageIcon, Sparkles, Heart, Eye, EyeOff, Upload, Lock } from 'lucide-react';

export const PhotoSection: React.FC = () => {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isMasked, setIsMasked] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Restore saved photo from localStorage if present
  useEffect(() => {
    try {
      const saved = localStorage.getItem('xinxin_memory_photo');
      if (saved) {
        setPhotoUrl(saved);
      }
    } catch {
      // Local storage may be restricted in sandboxes
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setPhotoUrl(result);
        try {
          localStorage.setItem('xinxin_memory_photo', result);
        } catch {
          // ignore storage quota
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPhotoUrl(null);
    try {
      localStorage.removeItem('xinxin_memory_photo');
    } catch {
      // ignore
    }
  };

  return (
    <section id="photo-memory" className="py-20 sm:py-28 px-4 sm:px-6 max-w-3xl mx-auto relative">
      {/* Background ambient blush */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-100/50 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Title */}
      <div className="text-center mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100/70 border border-pink-200 text-xs font-sans text-pink-700 mb-3">
          <Camera className="w-3 h-3 text-pink-500" />
          <span>那张照片</span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-medium text-pink-950 mb-3 tracking-wide">
          私藏的一格记忆
        </h2>
        <p className="text-sm sm:text-base text-rose-800/70 font-light max-w-md mx-auto">
          在这里留存那一刻的她。仅保存在你的本地浏览器中。
        </p>
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Polaroid Container */}
      <div className="flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative group w-full max-w-xs sm:max-w-sm bg-white/95 rounded-3xl p-4 sm:p-5 pt-5 pb-7 border border-pink-200/90 shadow-[0_16px_40px_rgba(244,114,182,0.18)] transition-all duration-300 hover:shadow-[0_20px_48px_rgba(244,114,182,0.25)]"
        >
          {/* Decorative washi tape at top */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-pink-200/70 backdrop-blur-xs rounded-sm rotate-[-2deg] border border-pink-300/40 shadow-xs pointer-events-none" />

          {/* Photo Frame */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-gradient-to-b from-pink-50 to-rose-50 border border-pink-150 flex flex-col items-center justify-center cursor-pointer select-none group/frame"
          >
            {photoUrl ? (
              <>
                <img
                  src={photoUrl}
                  alt="鑫鑫的照片"
                  className={`w-full h-full object-cover transition-all duration-500 ${
                    isMasked ? 'filter blur-xl scale-105' : 'filter blur-0'
                  }`}
                />

                {/* Mask Overlay if privacy mode enabled */}
                {isMasked && (
                  <div className="absolute inset-0 bg-pink-900/20 backdrop-blur-xs flex flex-col items-center justify-center text-white px-4 text-center">
                    <Lock className="w-8 h-8 mb-2 opacity-80" />
                    <span className="text-xs font-sans tracking-wider">已开启隐私遮罩</span>
                  </div>
                )}

                {/* Hover overlay for changing photo */}
                <div className="absolute inset-0 bg-pink-950/30 opacity-0 group-hover/frame:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-2">
                  <Upload className="w-6 h-6" />
                  <span className="text-xs font-sans">点击更换照片</span>
                </div>
              </>
            ) : (
              /* Empty state / Prompt to upload */
              <div className="p-6 text-center flex flex-col items-center justify-center h-full">
                <div className="w-14 h-14 rounded-full bg-pink-100/80 text-pink-500 flex items-center justify-center mb-4 group-hover/frame:scale-110 transition-transform">
                  <ImageIcon className="w-7 h-7 text-pink-400" />
                </div>
                <p className="text-sm font-medium text-pink-950 font-serif mb-1">
                  载入鑫鑫的照片
                </p>
                <p className="text-xs text-rose-400 font-sans leading-relaxed max-w-[200px]">
                  点此选取你手中的照片，将她安放于此
                </p>
                <span className="inline-flex items-center gap-1 mt-4 px-3 py-1 rounded-full bg-pink-100/70 text-[11px] text-pink-600 font-sans">
                  <Upload className="w-3 h-3" /> 点击上传本地图片
                </span>
              </div>
            )}
          </div>

          {/* Polaroid Bottom Caption */}
          <div className="mt-4 px-2 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-serif font-medium text-pink-950">
                  鑫鑫
                </span>
                <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-300" />
              </div>
              <p className="text-[11px] font-sans text-rose-400/80 mt-0.5">
                安静窗边 · 真实记录
              </p>
            </div>

            {/* Quick Action Buttons */}
            {photoUrl && (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMasked(!isMasked);
                  }}
                  title={isMasked ? '查看照片' : '隐私遮罩'}
                  className="p-1.5 rounded-full text-rose-400 hover:text-pink-600 hover:bg-pink-50 transition cursor-pointer"
                >
                  {isMasked ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={handleClearPhoto}
                  title="移除照片"
                  className="text-[11px] font-sans text-rose-300 hover:text-rose-500 px-2 py-1 transition cursor-pointer"
                >
                  移除
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Gentle boundary & privacy reflection note */}
        <div className="mt-6 text-center max-w-md px-4">
          <p className="text-xs font-sans text-rose-400/85 leading-relaxed">
            温馨提示：原 PRD 的“不做清单”中曾列出不公开照片，是为了避免带给她被窥视与情感压力。
            此模块设计为<strong>仅你个人设备本地可见</strong>，你可以安心收藏，或随时切换隐私遮罩。
          </p>
        </div>
      </div>
    </section>
  );
};
