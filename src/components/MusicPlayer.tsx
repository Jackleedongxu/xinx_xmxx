import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, Volume2, VolumeX, Music, Disc3, Sparkles, Folder } from 'lucide-react';

// Musical notes and chords for Eason Chan's classic "岁月如歌"
// Key: C Major / Gentle Piano Arrangement
interface Note {
  pitch: number; // Hz
  duration: number; // in beats
}

const NOTE_FREQS: Record<string, number> = {
  C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00, A3: 220.00, B3: 246.94,
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00,
};

// "岁月如歌" iconic theme sequence
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
  const [audioSourceType, setAudioSourceType] = useState<'synth' | 'custom'>('synth');
  const [volume, setVolume] = useState(0.65);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const isPlayingRef = useRef(false);
  const isMutedRef = useRef(false);
  const volumeRef = useRef(0.65);
  const timeoutIdsRef = useRef<number[]>([]);
  const customAudioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync refs
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);
  useEffect(() => {
    isMutedRef.current = isMuted;
    if (customAudioRef.current) {
      customAudioRef.current.muted = isMuted;
    }
  }, [isMuted]);
  useEffect(() => {
    volumeRef.current = volume;
    if (customAudioRef.current) {
      customAudioRef.current.volume = volume;
    }
  }, [volume]);

  // Clean Web Audio synthesis of a warm, gentle piano note
  const playPianoNote = (ctx: AudioContext, freq: number, durationSec: number, startTime: number) => {
    if (isMutedRef.current) return;

    // Fundamental tone
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    // Warmth: gentle low-pass filter
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, startTime);
    filter.frequency.exponentialRampToValueAtTime(300, startTime + durationSec);

    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(freq, startTime);

    // Warm octave undertone / slight detune
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 0.998, startTime);

    const masterVol = volumeRef.current * 0.45;
    gainNode.gain.setValueAtTime(0.0001, startTime);
    // Soft attack
    gainNode.gain.exponentialRampToValueAtTime(masterVol, startTime + 0.03);
    // Decay & release
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

  // Play the full melody in an ongoing peaceful loop
  const scheduleMelodyLoop = () => {
    if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
      audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }

    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    // Clear previous timeouts
    timeoutIdsRef.current.forEach(clearTimeout);
    timeoutIdsRef.current = [];

    let currentOffset = 0.2;
    const tempoSecondsPerBeat = 0.55; // gentle, relaxed and peaceful tempo

    SUI_YUE_RU_GE_MELODY.forEach((item) => {
      const freq = NOTE_FREQS[item.note] || 261.63;
      const duration = item.duration * tempoSecondsPerBeat;

      const tId = window.setTimeout(() => {
        if (isPlayingRef.current && audioSourceType === 'synth' && audioCtxRef.current) {
          playPianoNote(audioCtxRef.current, freq, duration, audioCtxRef.current.currentTime);
        }
      }, currentOffset * 1000);

      timeoutIdsRef.current.push(tId);
      currentOffset += duration;
    });

    // Schedule next loop
    const loopDurationMs = (currentOffset + 2.5) * 1000;
    const loopTimeout = window.setTimeout(() => {
      if (isPlayingRef.current && audioSourceType === 'synth') {
        scheduleMelodyLoop();
      }
    }, loopDurationMs);

    timeoutIdsRef.current.push(loopTimeout);
  };

  const startPlayback = async () => {
    try {
      if (audioSourceType === 'custom' && customAudioRef.current) {
        await customAudioRef.current.play();
        setIsPlaying(true);
        return;
      }

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
      // Browser autoplay restriction
    }
  };

  const stopPlayback = () => {
    setIsPlaying(false);
    isPlayingRef.current = false;
    timeoutIdsRef.current.forEach(clearTimeout);
    timeoutIdsRef.current = [];
    if (customAudioRef.current) {
      customAudioRef.current.pause();
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopPlayback();
    } else {
      startPlayback();
    }
  };

  // Autoplay attempt on mount + browser fallback interaction listener
  useEffect(() => {
    // Attempt autoplay
    const timer = setTimeout(() => {
      startPlayback();
    }, 400);

    // If browser blocks unprompted autoplay, start on very first interaction (scroll, click, touch)
    const handleFirstInteraction = () => {
      if (!isPlayingRef.current) {
        startPlayback();
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
  }, []);

  // Handle local audio file upload if user wants their own MP3 version
  const handleCustomAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (customAudioRef.current) {
        customAudioRef.current.src = url;
        customAudioRef.current.loop = true;
        setAudioSourceType('custom');
        // Stop synth and play custom
        stopPlayback();
        setTimeout(() => {
          customAudioRef.current?.play().then(() => setIsPlaying(true));
        }, 100);
      }
    }
  };

  return (
    <>
      <audio ref={customAudioRef} loop preload="auto" />
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleCustomAudioUpload}
        accept="audio/*"
        className="hidden"
      />

      {/* Fixed Bottom Player Container */}
      <div className="fixed bottom-4 sm:bottom-6 right-3 sm:right-6 z-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          {/* Main Floating Pill / Card */}
          <div className="flex items-center gap-2.5 sm:gap-3 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full bg-white/90 backdrop-blur-md border border-pink-200/90 shadow-[0_8px_24px_rgba(244,114,182,0.22)]">
            {/* Spinning Disc / Note Avatar */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="relative flex items-center justify-center w-8 sm:w-9 h-8 sm:h-9 rounded-full bg-gradient-to-tr from-pink-400 to-rose-400 text-white shadow-xs cursor-pointer group"
              title="轻音乐播放详情"
            >
              <Disc3
                className={`w-4 sm:w-5 h-4 sm:h-5 transition-transform duration-700 ${
                  isPlaying ? 'animate-spin' : ''
                }`}
                style={{ animationDuration: '4s' }}
              />
              <Sparkles className="w-2.5 h-2.5 text-pink-200 absolute -top-0.5 -right-0.5" />
            </button>

            {/* Track Info (Compact) */}
            <div
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex flex-col cursor-pointer select-none max-w-[130px] sm:max-w-[180px]"
            >
              <div className="flex items-center gap-1.5">
                <span className="text-xs sm:text-sm font-serif font-medium text-pink-950 truncate">
                  岁月如歌
                </span>
                {isPlaying && (
                  <span className="flex items-center gap-0.5 h-2.5">
                    <span className="w-0.5 h-2.5 bg-pink-400 rounded-full animate-pulse" />
                    <span className="w-0.5 h-1.5 bg-rose-400 rounded-full animate-pulse delay-75" />
                    <span className="w-0.5 h-2 bg-pink-500 rounded-full animate-pulse delay-150" />
                  </span>
                )}
              </div>
              <span className="text-[10px] text-rose-400/80 font-sans truncate">
                陈奕迅 · {audioSourceType === 'synth' ? '温柔钢琴' : '本地音频'}
              </span>
            </div>

            {/* Play/Pause Button */}
            <button
              onClick={togglePlay}
              aria-label={isPlaying ? '暂停音乐' : '播放音乐'}
              className="flex items-center justify-center w-7 sm:w-8 h-7 sm:h-8 rounded-full bg-pink-100/80 hover:bg-pink-200/90 text-pink-700 transition cursor-pointer"
            >
              {isPlaying ? (
                <Pause className="w-3.5 h-3.5 fill-pink-600" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-pink-600 ml-0.5" />
              )}
            </button>

            {/* Mute/Unmute Button */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              aria-label={isMuted ? '取消静音' : '静音'}
              className="p-1 rounded-full text-rose-400 hover:text-pink-600 transition cursor-pointer"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Expanded Drawer / Control Card */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-14 right-0 w-64 sm:w-72 bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-pink-200/90 shadow-[0_12px_36px_rgba(244,114,182,0.25)] text-left"
              >
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-pink-100">
                  <div className="flex items-center gap-1.5 text-xs font-serif font-medium text-pink-900">
                    <Music className="w-3.5 h-3.5 text-pink-500" />
                    <span>安静记录 · 背景旋律</span>
                  </div>
                  <span className="text-[10px] text-pink-400 bg-pink-50 px-2 py-0.5 rounded-full">
                    {isPlaying ? '自动播放中' : '已暂停'}
                  </span>
                </div>

                <p className="text-xs text-[#6b5560] leading-relaxed mb-3 font-serif">
                  “爱若难以放进手中，何不将这双手放进心里抱拥。”
                </p>

                {/* Volume Slider */}
                <div className="space-y-1 mb-3">
                  <div className="flex justify-between text-[11px] text-rose-400">
                    <span>音量</span>
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

                {/* Source Selection & Custom audio file trigger */}
                <div className="pt-2 border-t border-pink-100/80 flex items-center justify-between">
                  <span className="text-[10px] text-rose-400">
                    {audioSourceType === 'synth' ? '纯净钢琴演奏模式' : '本地导入模式'}
                  </span>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1 text-[11px] font-sans text-pink-600 hover:text-pink-700 bg-pink-50 hover:bg-pink-100 px-2 py-0.5 rounded-md transition cursor-pointer"
                  >
                    <Folder className="w-3 h-3" />
                    <span>更换音频</span>
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
