import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, Volume2, VolumeX, Music, Disc3, Sparkles } from 'lucide-react';

export const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [volume, setVolume] = useState(0.75);

  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const isPlayingRef = useRef(false);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    if (audioElementRef.current) {
      audioElementRef.current.muted = isMuted;
    }
  }, [isMuted]);

  useEffect(() => {
    if (audioElementRef.current) {
      audioElementRef.current.volume = volume;
    }
  }, [volume]);

  const startPlayback = async () => {
    if (!audioElementRef.current) return;
    try {
      await audioElementRef.current.play();
      setIsPlaying(true);
      isPlayingRef.current = true;
    } catch {
      // Browser autoplay restriction before user interaction
    }
  };

  const stopPlayback = () => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
    }
    setIsPlaying(false);
    isPlayingRef.current = false;
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopPlayback();
    } else {
      startPlayback();
    }
  };

  // Autoplay on load + fallback on first user gesture (touch, scroll, click)
  useEffect(() => {
    // Attempt immediate autoplay
    const timer = setTimeout(() => {
      startPlayback();
    }, 300);

    // If mobile or browser blocks unprompted autoplay, start on very first interaction
    const handleFirstInteraction = () => {
      if (!isPlayingRef.current && audioElementRef.current) {
        audioElementRef.current.play().then(() => {
          setIsPlaying(true);
          isPlayingRef.current = true;
        }).catch(() => {});
      }
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('scroll', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction, { once: true });
    window.addEventListener('touchstart', handleFirstInteraction, { once: true });
    window.addEventListener('scroll', handleFirstInteraction, { once: true });
    window.addEventListener('keydown', handleFirstInteraction, { once: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('scroll', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, []);

  return (
    <>
      {/* Permanent Fixed Audio File bundled directly in the codebase (/public/suiyueruge.mp3) */}
      <audio
        ref={audioElementRef}
        src="/suiyueruge.mp3"
        loop
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Fixed at Top Left: fixed top-3.5 sm:top-4 left-3 sm:left-6 z-50 */}
      <div className="fixed top-3.5 sm:top-4 left-3 sm:left-6 z-50">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          {/* Main Floating Capsule */}
          <div className="flex items-center gap-2 sm:gap-2.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full bg-white/90 backdrop-blur-md border border-pink-200/90 shadow-[0_4px_20px_rgba(244,114,182,0.18)]">
            {/* Spinning Disc Button */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="relative flex items-center justify-center w-7 sm:w-8 h-7 sm:h-8 rounded-full bg-gradient-to-tr from-pink-400 to-rose-400 text-white shadow-xs cursor-pointer group"
              title="岁月如歌 · 播放详情"
            >
              <Disc3
                className={`w-4 h-4 transition-transform duration-700 ${
                  isPlaying ? 'animate-spin' : ''
                }`}
                style={{ animationDuration: '4s' }}
              />
              <Sparkles className="w-2 h-2 text-pink-200 absolute -top-0.5 -right-0.5" />
            </button>

            {/* Track Info (Click to expand) */}
            <div
              onClick={() => setIsExpanded(!isExpanded)}
              className="hidden sm:flex flex-col cursor-pointer select-none max-w-[130px]"
            >
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-serif font-medium text-pink-950 truncate">
                  岁月如歌
                </span>
                {isPlaying && (
                  <span className="flex items-center gap-0.5 h-2">
                    <span className="w-0.5 h-2 bg-pink-400 rounded-full animate-pulse" />
                    <span className="w-0.5 h-1.5 bg-rose-400 rounded-full animate-pulse delay-75" />
                    <span className="w-0.5 h-2 bg-pink-500 rounded-full animate-pulse delay-150" />
                  </span>
                )}
              </div>
              <span className="text-[10px] text-rose-400/80 font-sans truncate">
                陈奕迅 · 原版
              </span>
            </div>

            {/* Play/Pause Button */}
            <button
              onClick={togglePlay}
              aria-label={isPlaying ? '暂停音乐' : '播放音乐'}
              className="flex items-center justify-center w-6 sm:w-7 h-6 sm:h-7 rounded-full bg-pink-100/80 hover:bg-pink-200/90 text-pink-700 transition cursor-pointer"
            >
              {isPlaying ? (
                <Pause className="w-3 h-3 fill-pink-600" />
              ) : (
                <Play className="w-3 h-3 fill-pink-600 ml-0.5" />
              )}
            </button>

            {/* Mute/Unmute Button */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              aria-label={isMuted ? '取消静音' : '静音'}
              className="p-1 rounded-full text-rose-400 hover:text-pink-600 transition cursor-pointer"
            >
              {isMuted ? (
                <VolumeX className="w-3.5 h-3.5" />
              ) : (
                <Volume2 className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {/* Expanded Drawer / Control Card */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -8 }}
                transition={{ duration: 0.2 }}
                className="absolute top-12 left-0 w-64 sm:w-72 bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-pink-200/90 shadow-[0_12px_36px_rgba(244,114,182,0.22)] text-left"
              >
                <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-pink-100">
                  <div className="flex items-center gap-1.5 text-xs font-serif font-medium text-pink-900">
                    <Music className="w-3.5 h-3.5 text-pink-500" />
                    <span>陈奕迅 ·《岁月如歌》</span>
                  </div>
                  <span className="text-[10px] text-pink-500 bg-pink-50 px-2 py-0.5 rounded-full">
                    {isPlaying ? '自动播放中' : '已暂停'}
                  </span>
                </div>

                <p className="text-[11px] text-[#6b5560] leading-relaxed mb-3 font-serif">
                  “天气不似预期，但要走，总要飞。”
                </p>

                {/* Volume Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-rose-400">
                    <span>音量调节</span>
                    <span>{Math.round(volume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-full accent-pink-500 h-1.5 bg-pink-100 rounded-lg cursor-pointer"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  );
};
