import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, Volume2, VolumeX, Music, Disc3, Sparkles, Folder, Check, RotateCcw } from 'lucide-react';

// IndexedDB Helper for permanent local storage of the MP3 track
const DB_NAME = 'MemorySiteAudioDB';
const STORE_NAME = 'audio_files';
const AUDIO_KEY = 'fixed_suiyueruge_mp3';

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const saveAudioBlob = async (blob: Blob): Promise<void> => {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(blob, AUDIO_KEY);
  } catch (err) {
    console.error('Failed to save audio to IndexedDB', err);
  }
};

const getStoredAudioBlob = async (): Promise<Blob | null> => {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const request = tx.objectStore(STORE_NAME).get(AUDIO_KEY);
    return new Promise((resolve) => {
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
};

// Musical notes and chords for Eason Chan's classic "岁月如歌"
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
  const [audioSource, setAudioSource] = useState<'audioFile' | 'synth'>('synth');
  const [hasSavedFile, setHasSavedFile] = useState(false);
  const [volume, setVolume] = useState(0.7);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const isPlayingRef = useRef(false);
  const isMutedRef = useRef(false);
  const volumeRef = useRef(0.7);
  const timeoutIdsRef = useRef<number[]>([]);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Load any previously saved MP3 from IndexedDB or try public /suiyueruge.mp3
  useEffect(() => {
    const initAudio = async () => {
      try {
        const storedBlob = await getStoredAudioBlob();
        if (storedBlob && audioElementRef.current) {
          const objectUrl = URL.createObjectURL(storedBlob);
          audioElementRef.current.src = objectUrl;
          setAudioSource('audioFile');
          setHasSavedFile(true);
          return;
        }

        // Test if /suiyueruge.mp3 exists
        if (audioElementRef.current) {
          const testAudio = new Audio('/suiyueruge.mp3');
          testAudio.oncanplaythrough = () => {
            if (audioElementRef.current) {
              audioElementRef.current.src = '/suiyueruge.mp3';
              setAudioSource('audioFile');
            }
          };
          testAudio.onerror = () => {
            // Keep pure piano synth as default
            setAudioSource('synth');
          };
        }
      } catch {
        setAudioSource('synth');
      }
    };

    initAudio();
  }, []);

  // Soft piano note generator
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
        if (isPlayingRef.current && audioSource === 'synth' && audioCtxRef.current) {
          playPianoNote(audioCtxRef.current, freq, duration, audioCtxRef.current.currentTime);
        }
      }, currentOffset * 1000);

      timeoutIdsRef.current.push(tId);
      currentOffset += duration;
    });

    const loopDurationMs = (currentOffset + 2.5) * 1000;
    const loopTimeout = window.setTimeout(() => {
      if (isPlayingRef.current && audioSource === 'synth') {
        scheduleMelodyLoop();
      }
    }, loopDurationMs);

    timeoutIdsRef.current.push(loopTimeout);
  };

  const startPlayback = async () => {
    try {
      if (audioSource === 'audioFile' && audioElementRef.current && audioElementRef.current.src) {
        await audioElementRef.current.play();
        setIsPlaying(true);
        isPlayingRef.current = true;
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
    if (audioElementRef.current) {
      audioElementRef.current.pause();
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopPlayback();
    } else {
      startPlayback();
    }
  };

  // Autoplay attempt on mount + fallback on first interaction
  useEffect(() => {
    const timer = setTimeout(() => {
      startPlayback();
    }, 400);

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
  }, [audioSource]);

  // Handle uploading and permanently saving user's MP3 track
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && audioElementRef.current) {
      await saveAudioBlob(file);
      const url = URL.createObjectURL(file);
      audioElementRef.current.src = url;
      audioElementRef.current.loop = true;
      setAudioSource('audioFile');
      setHasSavedFile(true);
      stopPlayback();
      setTimeout(() => {
        audioElementRef.current?.play().then(() => setIsPlaying(true));
      }, 100);
    }
  };

  return (
    <>
      <audio ref={audioElementRef} loop preload="auto" />
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="audio/*"
        className="hidden"
      />

      {/* Positioned at Top Left: fixed top-3.5 sm:top-4 left-3 sm:left-6 z-50 */}
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
              className="hidden sm:flex flex-col cursor-pointer select-none max-w-[140px]"
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
                陈奕迅 · {hasSavedFile ? '专属原曲' : '纯净伴奏'}
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
                    <span>岁月如歌 · 陈奕迅</span>
                  </div>
                  <span className="text-[10px] text-pink-500 bg-pink-50 px-2 py-0.5 rounded-full">
                    {isPlaying ? '自动播放中' : '已暂停'}
                  </span>
                </div>

                <p className="text-[11px] text-[#6b5560] leading-relaxed mb-3 font-serif">
                  “爱若难以放进手中，何不将这双手放进心里抱拥。”
                </p>

                {/* Status indicator */}
                <div className="p-2 rounded-xl bg-pink-50/60 border border-pink-100/70 mb-3 text-[11px] text-pink-800">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-pink-500" />
                    <span>固定曲目：陈奕迅《岁月如歌》</span>
                  </div>
                  <p className="text-[10px] text-rose-400 mt-0.5 pl-5">
                    {hasSavedFile ? '已绑定你的专属原版音频（永久记忆）' : '当前为内置纯净轻音乐伴奏'}
                  </p>
                </div>

                {/* Volume Slider */}
                <div className="space-y-1 mb-3">
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

                {/* Actions */}
                <div className="pt-2 border-t border-pink-100/80 flex items-center justify-between">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1 text-[11px] font-sans text-pink-600 hover:text-pink-700 bg-pink-50 hover:bg-pink-100 px-2.5 py-1 rounded-md transition cursor-pointer"
                  >
                    <Folder className="w-3 h-3" />
                    <span>导入本地原版MP3</span>
                  </button>

                  {hasSavedFile && (
                    <button
                      onClick={async () => {
                        const db = await openDB();
                        const tx = db.transaction(STORE_NAME, 'readwrite');
                        tx.objectStore(STORE_NAME).delete(AUDIO_KEY);
                        setHasSavedFile(false);
                        setAudioSource('synth');
                        stopPlayback();
                        setTimeout(startPlayback, 100);
                      }}
                      title="重置为默认伴奏"
                      className="text-[10px] text-rose-300 hover:text-rose-500 flex items-center gap-0.5 cursor-pointer"
                    >
                      <RotateCcw className="w-2.5 h-2.5" />
                      <span>重置</span>
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  );
};
