import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, Volume2, VolumeX, Music, Disc3, Sparkles, Move, AlertCircle, CheckCircle2 } from 'lucide-react';

// Musical notes and chords for Eason Chan's classic "岁月如歌" fallback synthesizer
const NOTE_FREQS: Record<string, number> = {
  A3: 220.00, B3: 246.94,
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00,
};

const SUI_YUE_RU_GE_MELODY: { note: string; duration: number }[] = [
  // Verse: 爱若难以放进手中
  { note: 'E4', duration: 0.75 }, { note: 'G4', duration: 0.75 }, { note: 'A4', duration: 0.75 }, { note: 'G4', duration: 0.75 },
  { note: 'E4', duration: 0.5 }, { note: 'D4', duration: 0.5 }, { note: 'C4', duration: 0.75 }, { note: 'D4', duration: 1.5 },
  // 何不将这双手放进心里抱拥
  { note: 'E4', duration: 0.75 }, { note: 'G4', duration: 0.75 }, { note: 'A4', duration: 0.75 }, { note: 'G4', duration: 0.75 },
  { note: 'E4', duration: 0.5 }, { note: 'D4', duration: 0.5 }, { note: 'C4', duration: 0.75 },
  { note: 'E4', duration: 0.5 }, { note: 'D4', duration: 0.5 }, { note: 'C4', duration: 1.5 },

  // 拿到绝症也竭力微笑
  { note: 'E4', duration: 0.75 }, { note: 'G4', duration: 0.75 }, { note: 'A4', duration: 0.75 }, { note: 'G4', duration: 0.75 },
  { note: 'E4', duration: 0.5 }, { note: 'D4', duration: 0.5 }, { note: 'C4', duration: 0.75 }, { note: 'D4', duration: 1.5 },
  // 犹如放假 都不怕
  { note: 'E4', duration: 0.75 }, { note: 'G4', duration: 0.75 }, { note: 'A4', duration: 0.75 }, { note: 'G4', duration: 0.75 },
  { note: 'E4', duration: 0.5 }, { note: 'D4', duration: 0.5 }, { note: 'C4', duration: 0.75 },
  { note: 'D4', duration: 0.5 }, { note: 'C4', duration: 2.0 },

  // Chorus: 天气不似预期 但要走 总要飞
  { note: 'G4', duration: 0.75 }, { note: 'G4', duration: 0.75 }, { note: 'E4', duration: 0.5 },
  { note: 'D4', duration: 0.5 }, { note: 'C4', duration: 0.75 }, { note: 'D4', duration: 1.5 },
  { note: 'E4', duration: 0.75 }, { note: 'G4', duration: 0.75 }, { note: 'A4', duration: 1.5 },
  { note: 'G4', duration: 0.75 }, { note: 'A4', duration: 0.75 }, { note: 'C5', duration: 2.0 },

  // 道别不可再等待
  { note: 'D5', duration: 0.75 }, { note: 'C5', duration: 0.75 }, { note: 'A4', duration: 0.75 },
  { note: 'G4', duration: 0.75 }, { note: 'E4', duration: 0.75 }, { note: 'D4', duration: 0.75 }, { note: 'C4', duration: 1.5 },

  // 由我们在这一刹的飞跃中
  { note: 'D4', duration: 0.5 }, { note: 'E4', duration: 0.5 }, { note: 'G4', duration: 0.75 },
  { note: 'A4', duration: 0.75 }, { note: 'G4', duration: 0.5 }, { note: 'E4', duration: 0.5 },
  { note: 'D4', duration: 0.5 }, { note: 'C4', duration: 0.5 }, { note: 'D4', duration: 0.75 }, { note: 'E4', duration: 1.5 },

  // 当世界尚没原谅我 留紧一脸自豪
  { note: 'A4', duration: 0.75 }, { note: 'G4', duration: 0.75 }, { note: 'E4', duration: 0.75 },
  { note: 'C4', duration: 0.5 }, { note: 'D4', duration: 0.5 }, { note: 'E4', duration: 0.75 },
  { note: 'D4', duration: 0.75 }, { note: 'C4', duration: 1.0 },
  { note: 'A3', duration: 0.75 }, { note: 'C4', duration: 0.75 }, { note: 'D4', duration: 0.75 },
  { note: 'E4', duration: 0.75 }, { note: 'D4', duration: 0.75 }, { note: 'C4', duration: 3.0 },
];

export const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [volume, setVolume] = useState(0.75);
  const [audioMode, setAudioMode] = useState<'file' | 'synth'>('file');
  const [fileLoadError, setFileLoadError] = useState(false);
  const [waitingGesture, setWaitingGesture] = useState(true);

  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const isPlayingRef = useRef(false);
  const isMutedRef = useRef(false);
  const volumeRef = useRef(0.75);
  const timeoutIdsRef = useRef<number[]>([]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    isMutedRef.current = isMuted;
    if (audioElementRef.current) {
      audioElementRef.current.muted = isMuted;
    }
  }, [isMuted]);

  useEffect(() => {
    volumeRef.current = volume;
    if (audioElementRef.current) {
      audioElementRef.current.volume = volume;
    }
  }, [volume]);

  // Soft piano note generator for synthetic fallback
  const playPianoNote = (ctx: AudioContext, freq: number, durationSec: number, startTime: number) => {
    if (isMutedRef.current) return;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, startTime);
    filter.frequency.exponentialRampToValueAtTime(300, startTime + durationSec);

    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(freq, startTime);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 0.998, startTime);

    const masterVol = volumeRef.current * 0.45;
    gainNode.gain.setValueAtTime(0.0001, startTime);
    gainNode.gain.exponentialRampToValueAtTime(masterVol, startTime + 0.03);
    gainNode.gain.exponentialRampToValueAtTime(masterVol * 0.6, startTime + 0.25);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, startTime + durationSec + 0.4);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start(startTime);
    osc2.start(startTime);
    osc1.stop(startTime + durationSec + 0.5);
    osc2.stop(startTime + durationSec + 0.5);
  };

  const scheduleMelodyLoop = () => {
    if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
      audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }

    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    timeoutIdsRef.current.forEach(clearTimeout);
    timeoutIdsRef.current = [];

    let currentOffset = 0.2;
    const tempoSecondsPerBeat = 0.55;

    SUI_YUE_RU_GE_MELODY.forEach((item) => {
      const freq = NOTE_FREQS[item.note] || 261.63;
      const duration = item.duration * tempoSecondsPerBeat;

      const tId = window.setTimeout(() => {
        if (isPlayingRef.current && audioMode === 'synth' && audioCtxRef.current) {
          playPianoNote(audioCtxRef.current, freq, duration, audioCtxRef.current.currentTime);
        }
      }, currentOffset * 1000);

      timeoutIdsRef.current.push(tId);
      currentOffset += duration;
    });

    const loopDurationMs = (currentOffset + 2.5) * 1000;
    const loopTimeout = window.setTimeout(() => {
      if (isPlayingRef.current && audioMode === 'synth') {
        scheduleMelodyLoop();
      }
    }, loopDurationMs);

    timeoutIdsRef.current.push(loopTimeout);
  };

  const startPlayback = async () => {
    setWaitingGesture(false);

    // If in file mode and audio file is valid
    if (audioMode === 'file' && audioElementRef.current && !fileLoadError) {
      try {
        await audioElementRef.current.play();
        setIsPlaying(true);
        isPlayingRef.current = true;
        return;
      } catch (err: any) {
        console.warn('Audio element play failed, falling back to synth...', err);
        // If file playback fails (e.g. 404 or decode error), switch to synth
        setAudioMode('synth');
      }
    }

    // Play synthetic piano version of 岁月如歌
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      if (audioCtxRef.current.state === 'suspended') {
        await audioCtxRef.current.resume();
      }
      setIsPlaying(true);
      isPlayingRef.current = true;
      scheduleMelodyLoop();
    } catch {
      // AudioContext locked
    }
  };

  const stopPlayback = () => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
    }
    timeoutIdsRef.current.forEach(clearTimeout);
    timeoutIdsRef.current = [];
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

  // Handle audio error on Netlify (e.g., if /suiyueruge.mp3 was not in the GitHub push)
  const handleAudioError = (e: any) => {
    console.error('Audio file failed to load (/suiyueruge.mp3):', e);
    setFileLoadError(true);
    setAudioMode('synth');
    // If user already wanted to play, seamlessly transition to synth
    if (isPlayingRef.current) {
      scheduleMelodyLoop();
    }
  };

  // Autoplay attempt on load + fallback on user interaction
  useEffect(() => {
    const timer = setTimeout(() => {
      startPlayback().catch(() => {});
    }, 400);

    const handleFirstInteraction = () => {
      setWaitingGesture(false);
      if (!isPlayingRef.current) {
        startPlayback().catch(() => {});
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
      timeoutIdsRef.current.forEach(clearTimeout);
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('scroll', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, [audioMode, fileLoadError]);

  return (
    <>
      {/* Permanent Fixed Audio File bundled in /public/suiyueruge.mp3 */}
      <audio
        ref={audioElementRef}
        src="/suiyueruge.mp3"
        loop
        preload="auto"
        onPlay={() => {
          setIsPlaying(true);
          setWaitingGesture(false);
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
                陈奕迅 · {audioMode === 'file' && !fileLoadError ? '原版' : '伴奏'}
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

          {/* Touch Gesture Prompt on mobile if waiting */}
          {waitingGesture && !isPlaying && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute -top-7 left-1 px-2.5 py-1 rounded-full bg-pink-500/90 text-white text-[10px] whitespace-nowrap shadow-xs pointer-events-none"
            >
              轻触屏幕任意处出声 ♫
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
                    {isPlaying ? '播放中' : '已暂停'}
                  </span>
                </div>

                <p className="text-[11px] text-[#6b5560] leading-relaxed mb-2.5 font-serif">
                  “天气不似预期，但要走，总要飞。”
                </p>

                {/* Netlify / GitHub audio diagnosis badge */}
                <div className="p-2 rounded-xl bg-pink-50/70 border border-pink-100/80 mb-3 text-[11px]">
                  {fileLoadError ? (
                    <div className="text-amber-800">
                      <div className="flex items-center gap-1 font-medium text-amber-700">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                        <span>已启动备用轻音乐旋律</span>
                      </div>
                      <p className="text-[10px] text-amber-700/80 mt-1 leading-normal">
                        提示：Netlify未获取到 <code>/suiyueruge.mp3</code>，请检查GitHub仓库的 <code>public/</code> 文件夹中是否包含该MP3。
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-emerald-800">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span>已加载原版《岁月如歌》音频</span>
                    </div>
                  )}
                </div>

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
                  <span>按住胶囊可拖动</span>
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
