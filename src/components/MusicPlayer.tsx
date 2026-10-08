import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, Volume2, VolumeX, Music, Disc3, Sparkles, UploadCloud, CheckCircle2, AlertCircle } from 'lucide-react';

// Musical notes and chords for Eason Chan's classic "岁月如歌" fallback
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
  const [isServerSynced, setIsServerSynced] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [audioSource, setAudioSource] = useState<'serverFile' | 'synth'>('synth');
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

  // Check server music file status on mount
  const checkServerMusic = async () => {
    try {
      const res = await fetch('/api/music-status');
      if (res.ok) {
        const data = await res.json();
        if (data.exists && audioElementRef.current) {
          audioElementRef.current.src = `/suiyueruge.mp3?t=${Date.now()}`;
          setAudioSource('serverFile');
          setIsServerSynced(true);
          return true;
        }
      }
    } catch {
      // Server check failed, fallback to synth
    }
    return false;
  };

  useEffect(() => {
    checkServerMusic();
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
      if (audioSource === 'serverFile' && audioElementRef.current && audioElementRef.current.src) {
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

  // Upload MP3 directly to server /api/upload-music to persist for ALL visitors
  const handleServerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const res = await fetch('/api/upload-music', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/octet-stream',
        },
        body: file,
      });

      if (res.ok) {
        if (audioElementRef.current) {
          audioElementRef.current.src = `/suiyueruge.mp3?t=${Date.now()}`;
          audioElementRef.current.loop = true;
        }
        setAudioSource('serverFile');
        setIsServerSynced(true);
        stopPlayback();
        setTimeout(() => {
          audioElementRef.current?.play().then(() => setIsPlaying(true));
        }, 150);
      } else {
        alert('上传失败，请稍后重试');
      }
    } catch (err) {
      console.error(err);
      alert('同步到服务器时出现网络问题');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <audio ref={audioElementRef} loop preload="auto" />
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleServerUpload}
        accept="audio/*"
        className="hidden"
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
              title="岁月如歌 · 播放详情与服务器同步"
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
                陈奕迅 · {isServerSynced ? '服务器同步原曲' : '纯净伴奏'}
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
                className="absolute top-12 left-0 w-72 sm:w-80 bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-pink-200/90 shadow-[0_12px_36px_rgba(244,114,182,0.22)] text-left"
              >
                <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-pink-100">
                  <div className="flex items-center gap-1.5 text-xs font-serif font-medium text-pink-900">
                    <Music className="w-3.5 h-3.5 text-pink-500" />
                    <span>固定曲目：陈奕迅《岁月如歌》</span>
                  </div>
                  <span className="text-[10px] text-pink-500 bg-pink-50 px-2 py-0.5 rounded-full">
                    {isPlaying ? '自动播放中' : '已暂停'}
                  </span>
                </div>

                <p className="text-[11px] text-[#6b5560] leading-relaxed mb-3 font-serif">
                  “天气不似预期，但要走，总要飞。”
                </p>

                {/* Server Status Box */}
                <div className={`p-2.5 rounded-xl border mb-3 text-xs ${
                  isServerSynced
                    ? 'bg-emerald-50/70 border-emerald-200/80 text-emerald-900'
                    : 'bg-pink-50/70 border-pink-200/80 text-pink-900'
                }`}>
                  <div className="flex items-center gap-1.5 font-medium">
                    {isServerSynced ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>已同步到服务器 (所有访客均可收听)</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-pink-500 flex-shrink-0" />
                        <span>尚未固化到服务器 (当前为伴奏)</span>
                      </>
                    )}
                  </div>
                  <p className="text-[10px] text-rose-500/80 mt-1 leading-normal pl-5">
                    {isServerSynced
                      ? '已成为服务器固定音频文件，任何人无论用电脑还是手机打开网页，都能自动播放这首歌。'
                      : '请点击下方按钮，将你的《岁月如歌.mp3》直接同步固化到网站服务器。'}
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

                {/* Server Sync Button */}
                <div className="pt-2 border-t border-pink-100/80">
                  <button
                    disabled={isUploading}
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white text-xs font-sans font-medium shadow-xs transition cursor-pointer disabled:opacity-60"
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span>
                      {isUploading
                        ? '正在同步上传到服务器...'
                        : isServerSynced
                        ? '重新同步覆盖服务器音频'
                        : '一键将你的 MP3 同步固化到服务器'}
                    </span>
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
