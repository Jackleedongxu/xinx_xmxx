import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, Volume2, VolumeX, Music, Disc3, Sparkles, Move, AlertTriangle, RefreshCw } from 'lucide-react';
import suiyuerugeAsset from '../assets/audio/suiyueruge.mp3';

export const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [needsGesture, setNeedsGesture] = useState(true);
  const [currentSourceIndex, setCurrentSourceIndex] = useState(0);

  // Multiple verified paths:
  // 1. Vite bundled asset (guaranteed in /assets/ by Vite build)
  // 2. Direct Netlify public root /suiyueruge.mp3
  // 3. Direct Netlify public root /岁月如歌.mp3
  const candidateSources = useRef<string[]>([
    suiyuerugeAsset,
    '/suiyueruge.mp3',
    '/岁月如歌.mp3',
  ]);

  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  // Sync volume and mute
  useEffect(() => {
    if (audioElementRef.current) {
      try {
        audioElementRef.current.volume = volume;
      } catch {
        // iOS ignores software volume adjustments
      }
      audioElementRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  const playAudio = () => {
    const audio = audioElementRef.current;
    if (!audio) return;

    try {
      setHasError(false);
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setNeedsGesture(false);
            setHasError(false);
          })
          .catch((err) => {
            console.warn('Playback error:', err);
            if (err?.name === 'NotAllowedError') {
              setNeedsGesture(true);
            } else {
              setHasError(true);
              setErrorMessage('轻触屏幕或点击播放按钮');
            }
          });
      }
    } catch {
      // Audio sync issue
    }
  };

  const pauseAudio = () => {
    const audio = audioElementRef.current;
    if (audio) {
      audio.pause();
    }
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  };

  // Expose play function to global window
  useEffect(() => {
    (window as any).playSiteAudio = () => {
      playAudio();
    };
    return () => {
      delete (window as any).playSiteAudio;
    };
  }, []);

  // WeChat & iOS Safari Autoplay & Gesture Unlock Engine
  useEffect(() => {
    const audio = audioElementRef.current;
    if (!audio) return;

    // 1. WeChat specific autoplay bridge
    const triggerWeChatPlay = () => {
      if ((window as any).WeixinJSBridge) {
        (window as any).WeixinJSBridge.invoke('getNetworkType', {}, () => {
          playAudio();
        });
      } else {
        document.addEventListener(
          'WeixinJSBridgeReady',
          () => {
            if ((window as any).WeixinJSBridge) {
              (window as any).WeixinJSBridge.invoke('getNetworkType', {}, () => {
                playAudio();
              });
            } else {
              playAudio();
            }
          },
          false
        );
      }
    };

    triggerWeChatPlay();

    // 2. Immediate autoplay attempt for desktop browsers
    playAudio();

    // 3. Mobile touch unlock listener (touchstart/touchend/click)
    const handleTouchUnlock = () => {
      const el = audioElementRef.current;
      if (el && el.paused) {
        playAudio();
      }
      cleanupListeners();
    };

    const cleanupListeners = () => {
      window.removeEventListener('touchstart', handleTouchUnlock);
      window.removeEventListener('touchend', handleTouchUnlock);
      window.removeEventListener('click', handleTouchUnlock);
      window.removeEventListener('pointerdown', handleTouchUnlock);
      window.removeEventListener('play-site-music', handleTouchUnlock);
    };

    window.addEventListener('touchstart', handleTouchUnlock, { passive: true, once: true });
    window.addEventListener('touchend', handleTouchUnlock, { passive: true, once: true });
    window.addEventListener('click', handleTouchUnlock, { once: true });
    window.addEventListener('pointerdown', handleTouchUnlock, { once: true });
    window.addEventListener('play-site-music', handleTouchUnlock);

    return () => {
      cleanupListeners();
    };
  }, [currentSourceIndex]);

  const handleAudioError = () => {
    const audio = audioElementRef.current;
    console.warn('Audio source failed:', candidateSources.current[currentSourceIndex], audio?.error);

    // Try next candidate source if available
    if (currentSourceIndex < candidateSources.current.length - 1) {
      const nextIndex = currentSourceIndex + 1;
      setCurrentSourceIndex(nextIndex);
      if (audio) {
        audio.src = candidateSources.current[nextIndex];
        audio.load();
        playAudio();
      }
    } else {
      setHasError(true);
      setErrorMessage('音频源加载受阻，请点击“重试”或重新进入页面');
      setIsPlaying(false);
    }
  };

  const handleRetry = () => {
    setHasError(false);
    setCurrentSourceIndex(0);
    const audio = audioElementRef.current;
    if (audio) {
      audio.src = candidateSources.current[0];
      audio.load();
      playAudio();
    }
  };

  return (
    <>
      {/* 
        Native HTML5 Audio element configured for iOS Safari & WeChat Webview
        Uses Vite bundled audio asset with automatic fallback
      */}
      <audio
        ref={audioElementRef}
        src={candidateSources.current[currentSourceIndex]}
        loop
        preload="auto"
        playsInline
        // @ts-ignore
        webkit-playsinline="true"
        x5-playsinline="true"
        x-webkit-airplay="allow"
        onPlay={() => {
          setIsPlaying(true);
          setNeedsGesture(false);
          setHasError(false);
        }}
        onPause={() => setIsPlaying(false)}
        onError={handleAudioError}
      />

      {/* Fixed at Bottom Left: fixed bottom-5 sm:bottom-6 left-3 sm:left-6 z-50 */}
      <div className="fixed bottom-5 sm:bottom-6 left-3 sm:left-6 z-50 pointer-events-none">
        <motion.div
          drag
          dragMomentum={false}
          dragElastic={0.08}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative pointer-events-auto select-none"
        >
          {/* Main Floating Capsule */}
          <div className="flex items-center gap-2 sm:gap-2.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full bg-white/95 backdrop-blur-md border border-pink-200/90 shadow-[0_6px_24px_rgba(244,114,182,0.22)] hover:shadow-[0_8px_28px_rgba(244,114,182,0.28)] transition-shadow">
            {/* Spinning Disc Button */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="relative flex items-center justify-center w-7 sm:w-8 h-7 sm:h-8 rounded-full bg-gradient-to-tr from-pink-400 to-rose-400 text-white shadow-xs cursor-pointer group flex-shrink-0"
              title="陈奕迅 · 岁月如歌"
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
              className="flex flex-col cursor-pointer max-w-[110px] sm:max-w-[130px]"
            >
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-serif font-medium text-pink-950 truncate">
                  岁月如歌
                </span>
                {isPlaying && (
                  <span className="flex items-center gap-0.5 h-2 flex-shrink-0">
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
              className="flex items-center justify-center w-6 sm:w-7 h-6 sm:h-7 rounded-full bg-pink-100/80 hover:bg-pink-200/90 text-pink-700 transition cursor-pointer flex-shrink-0"
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
              className="p-1 rounded-full text-rose-400 hover:text-pink-600 transition cursor-pointer flex-shrink-0"
            >
              {isMuted ? (
                <VolumeX className="w-3.5 h-3.5" />
              ) : (
                <Volume2 className="w-3.5 h-3.5" />
              )}
            </button>

            {/* Drag Handle Icon Hint */}
            <div
              className="pl-0.5 pr-0.5 text-rose-300 hover:text-rose-400 cursor-grab active:cursor-grabbing"
              title="按住可随意拖拽位置"
            >
              <Move className="w-3 h-3 opacity-60" />
            </div>
          </div>

          {/* Autoplay waiting prompt on mobile */}
          {needsGesture && !isPlaying && !hasError && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute -top-7 left-1 px-2.5 py-1 rounded-full bg-pink-500 text-white text-[10px] whitespace-nowrap shadow-xs pointer-events-none flex items-center gap-1"
            >
              <span>轻触屏幕任意处自动启播 ♫</span>
            </motion.div>
          )}

          {/* Expanded Drawer / Control Card */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-13 left-0 w-64 sm:w-72 bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-pink-200/90 shadow-[0_12px_36px_rgba(244,114,182,0.25)] text-left"
              >
                <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-pink-100">
                  <div className="flex items-center gap-1.5 text-xs font-serif font-medium text-pink-900">
                    <Music className="w-3.5 h-3.5 text-pink-500" />
                    <span>陈奕迅 ·《岁月如歌》</span>
                  </div>
                  <span className="text-[10px] text-pink-500 bg-pink-50 px-2 py-0.5 rounded-full">
                    {isPlaying ? '播放中' : '未播放'}
                  </span>
                </div>

                <p className="text-[11px] text-[#6b5560] leading-relaxed mb-2.5 font-serif">
                  “天气不似预期，但要走，总要飞。”
                </p>

                {/* Error Box if audio fails */}
                {hasError && (
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-[11px] mb-3 leading-normal">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1 font-medium text-rose-700">
                        <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>音频加载提示</span>
                      </div>
                      <button
                        onClick={handleRetry}
                        className="inline-flex items-center gap-0.5 text-[10px] text-pink-600 hover:text-pink-700 bg-pink-100/70 px-1.5 py-0.5 rounded cursor-pointer"
                      >
                        <RefreshCw className="w-2.5 h-2.5" />
                        <span>重试</span>
                      </button>
                    </div>
                    <p className="text-[10px] text-rose-600">
                      {errorMessage}
                    </p>
                  </div>
                )}

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

                <div className="mt-2.5 pt-2 border-t border-pink-100 text-[10px] text-rose-400/80 flex items-center justify-between">
                  <span>支持微信与Safari全端</span>
                  <button
                    onClick={() => setIsExpanded(false)}
                    className="text-pink-600 hover:text-pink-700 cursor-pointer"
                  >
                    收起
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  );
};
