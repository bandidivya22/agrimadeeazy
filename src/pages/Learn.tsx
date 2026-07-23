import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Play, Pause, Volume2, VolumeX, Maximize, Minimize,
  BookOpen, CheckCircle, AlertCircle, Loader2,
  Rewind, FastForward,
} from 'lucide-react';

const VIDEO_SRC = '/videos/tutorial.mp4';

const tutorials = [
  { title: 'Getting Started with AgriMadeEazy', desc: 'Learn how to create an account and navigate the platform', duration: '3:45' },
  { title: 'Browsing Products & Categories', desc: 'Explore our catalog and find the right products', duration: '4:20' },
  { title: 'Placing Your First Order', desc: 'Step-by-step guide to ordering products', duration: '5:10' },
  { title: 'Payment Options - UPI & COD', desc: 'Understand payment methods and security', duration: '3:30' },
  { title: 'Tracking Your Orders', desc: 'Monitor your delivery status in real-time', duration: '2:50' },
  { title: 'Using Wishlist & Reviews', desc: 'Save favorites and share your experience', duration: '3:15' },
];

const SKIP_SECONDS = 10;

function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return '0:00';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function Learn() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const seekBarRef = useRef<HTMLDivElement>(null);

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [loading, setLoading] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverX, setHoverX] = useState(0);
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Controls auto-hide ──────────────────────────────────────────────
  const showControlsTemporarily = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    if (playing && !isScrubbing) {
      controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
    }
  }, [playing, isScrubbing]);

  useEffect(() => {
    showControlsTemporarily();
  }, [showControlsTemporarily]);

  // ── Fullscreen detection ────────────────────────────────────────────
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  // ── Playback handlers ───────────────────────────────────────────────
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (playing) videoRef.current.pause();
    else videoRef.current.play();
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !muted;
    setMuted(!muted);
  };

  const handleVolumeChange = (val: number) => {
    if (!videoRef.current) return;
    videoRef.current.volume = val;
    videoRef.current.muted = val === 0;
    setVolume(val);
    setMuted(val === 0);
  };

  const skipBy = (delta: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(0, Math.min(videoRef.current.duration || 0, videoRef.current.currentTime + delta));
    showControlsTemporarily();
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) containerRef.current?.requestFullscreen?.();
    else document.exitFullscreen?.();
  };

  // ── Seekbar ─────────────────────────────────────────────────────────
  const getSeekFraction = (clientX: number): number => {
    if (!seekBarRef.current) return 0;
    const rect = seekBarRef.current.getBoundingClientRect();
    return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  };

  const seekToFraction = (fraction: number) => {
    if (!videoRef.current || !videoRef.current.duration) return;
    videoRef.current.currentTime = fraction * videoRef.current.duration;
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleSeekClick = (e: React.MouseEvent) => {
    seekToFraction(getSeekFraction(e.clientX));
  };

  const handleSeekMouseDown = (e: React.MouseEvent) => {
    setIsScrubbing(true);
    seekToFraction(getSeekFraction(e.clientX));
  };

  useEffect(() => {
    if (!isScrubbing) return;
    const onMove = (e: MouseEvent) => seekToFraction(getSeekFraction(e.clientX));
    const onUp = () => setIsScrubbing(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [isScrubbing]);

  const handleSeekHover = (e: React.MouseEvent) => {
    const fraction = getSeekFraction(e.clientX);
    setHoverX(e.clientX);
    if (videoRef.current?.duration) setHoverTime(fraction * videoRef.current.duration);
  };

  // ── Keyboard shortcuts ──────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!containerRef.current) return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      switch (e.key) {
        case ' ':
        case 'k':
          e.preventDefault(); togglePlay(); break;
        case 'ArrowLeft':
          e.preventDefault(); skipBy(-SKIP_SECONDS); break;
        case 'ArrowRight':
          e.preventDefault(); skipBy(SKIP_SECONDS); break;
        case 'f':
          e.preventDefault(); toggleFullscreen(); break;
        case 'm':
          e.preventDefault(); toggleMute(); break;
      }
      showControlsTemporarily();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;
  const bufferedPct = duration > 0 ? (buffered / duration) * 100 : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      <div className="text-center mb-8">
        <span className="badge bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300 px-4 py-1.5">
          <BookOpen className="w-3.5 h-3.5 mr-1" /> Video Tutorial
        </span>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mt-3">Learn How to Use AgriMadeEazy</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-2xl mx-auto">
          Watch our step-by-step video guide to learn how to browse, order, and get the most out of AgriMadeEazy.
        </p>
      </div>

      {/* ── Video Player ──────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto">
        <div
          ref={containerRef}
          className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden group shadow-2xl"
          onMouseMove={showControlsTemporarily}
          onMouseLeave={() => { if (playing && !isScrubbing) setShowControls(false); }}
        >
          {videoError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 text-center px-4">
              <AlertCircle className="w-12 h-12 text-red-500 mb-3" />
              <p className="text-white font-semibold mb-1">Video Unavailable</p>
              <p className="text-gray-400 text-sm">The tutorial video could not be loaded. Please try again later.</p>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                src={VIDEO_SRC}
                className="w-full h-full object-contain"
                onPlay={() => { setPlaying(true); showControlsTemporarily(); }}
                onPause={() => { setPlaying(false); setShowControls(true); }}
                onWaiting={() => setLoading(true)}
                onCanPlay={() => setLoading(false)}
                onLoadedData={() => setLoading(false)}
                onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                onTimeUpdate={(e) => { if (!isScrubbing) setCurrentTime(e.currentTarget.currentTime); }}
                onProgress={(e) => {
                  const v = e.currentTarget;
                  if (v.buffered.length > 0) setBuffered(v.buffered.end(v.buffered.length - 1));
                }}
                onEnded={() => { setPlaying(false); setShowControls(true); }}
                onError={() => { setVideoError(true); setLoading(false); }}
                onClick={togglePlay}
                preload="metadata"
              />

              {/* Loading spinner */}
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
                  <Loader2 className="w-12 h-12 text-white animate-spin drop-shadow-lg" />
                </div>
              )}

              {/* Center play overlay (when paused) */}
              {!playing && !loading && !videoError && (
                <div
                  className="absolute inset-0 flex items-center justify-center cursor-pointer"
                  onClick={togglePlay}
                >
                  <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center transition-transform hover:scale-110 active:scale-95">
                    <Play className="w-10 h-10 text-white ml-1" fill="white" />
                  </div>
                </div>
              )}

              {/* ── Custom Controls Bar ──────────────────────────────── */}
              <div
                className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent px-3 sm:px-4 pt-12 pb-2 transition-opacity duration-300 ${
                  showControls || !playing ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              >
                {/* Progress / Seek bar */}
                <div
                  ref={seekBarRef}
                  className="relative h-4 flex items-center cursor-pointer group/seek mb-1"
                  onClick={handleSeekClick}
                  onMouseDown={handleSeekMouseDown}
                  onMouseMove={handleSeekHover}
                  onMouseLeave={() => setHoverTime(null)}
                >
                  {/* Track */}
                  <div className="absolute left-0 right-0 h-1 rounded-full bg-white/25 group-hover/seek:h-1.5 transition-all" />
                  {/* Buffered */}
                  <div className="absolute left-0 h-1 rounded-full bg-white/35 group-hover/seek:h-1.5 transition-all" style={{ width: `${bufferedPct}%` }} />
                  {/* Played */}
                  <div className="absolute left-0 h-1 rounded-full bg-primary-600 group-hover/seek:h-1.5 transition-all" style={{ width: `${progressPct}%` }} />
                  {/* Thumb */}
                  <div
                    className="absolute w-3 h-3 rounded-full bg-primary-600 shadow-md -translate-x-1/2 transition-transform group-hover/seek:scale-125"
                    style={{ left: `${progressPct}%` }}
                  />
                  {/* Hover preview tooltip */}
                  {hoverTime !== null && (
                    <div
                      className="absolute -top-9 -translate-x-1/2 px-2 py-0.5 rounded bg-black/90 text-white text-xs font-medium pointer-events-none whitespace-nowrap"
                      style={{ left: `${((hoverX - (seekBarRef.current?.getBoundingClientRect().left ?? 0)) / (seekBarRef.current?.getBoundingClientRect().width ?? 1)) * 100}%` }}
                    >
                      {formatTime(hoverTime)}
                    </div>
                  )}
                </div>

                {/* Buttons row */}
                <div className="flex items-center gap-2 sm:gap-3 text-white">
                  {/* Play / Pause */}
                  <button onClick={togglePlay} className="p-1.5 rounded hover:bg-white/15 transition-colors" aria-label={playing ? 'Pause' : 'Play'}>
                    {playing ? <Pause className="w-5 h-5" fill="white" /> : <Play className="w-5 h-5" fill="white" />}
                  </button>

                  {/* Skip backward 10s */}
                  <button onClick={() => skipBy(-SKIP_SECONDS)} className="p-1.5 rounded hover:bg-white/15 transition-colors group/skip-back" aria-label="Skip back 10 seconds">
                    <div className="relative">
                      <Rewind className="w-5 h-5" />
                      <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-white leading-none mt-0.5">10</span>
                    </div>
                  </button>

                  {/* Skip forward 10s */}
                  <button onClick={() => skipBy(SKIP_SECONDS)} className="p-1.5 rounded hover:bg-white/15 transition-colors" aria-label="Skip forward 10 seconds">
                    <div className="relative">
                      <FastForward className="w-5 h-5" />
                      <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-white leading-none mt-0.5">10</span>
                    </div>
                  </button>

                  {/* Volume */}
                  <div className="flex items-center gap-1.5 group/vol">
                    <button onClick={toggleMute} className="p-1.5 rounded hover:bg-white/15 transition-colors" aria-label={muted ? 'Unmute' : 'Mute'}>
                      {muted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </button>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={muted ? 0 : volume}
                      onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                      className="w-0 group-hover/vol:w-16 transition-all duration-300 accent-primary-600 cursor-pointer h-1"
                      aria-label="Volume"
                    />
                  </div>

                  {/* Time display */}
                  <span className="text-xs sm:text-sm font-medium tabular-nums text-white/90 select-none">
                    {formatTime(currentTime)} <span className="text-white/50">/</span> {formatTime(duration)}
                  </span>

                  {/* Spacer */}
                  <div className="flex-1" />

                  {/* Fullscreen */}
                  <button onClick={toggleFullscreen} className="p-1.5 rounded hover:bg-white/15 transition-colors" aria-label="Fullscreen">
                    {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Skip feedback flash (optional subtle indicator) */}
              {!loading && !videoError && (
                <div className={`absolute inset-0 pointer-events-none transition-opacity duration-200 ${showControls ? 'opacity-0' : 'opacity-0'}`} />
              )}
            </>
          )}
        </div>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-3">
          Now playing: AgriMadeEazy Tutorial
        </p>
      </div>

      {/* Tutorial chapters */}
      <div className="max-w-3xl mx-auto mt-12">
        <h2 className="font-display text-xl font-bold text-gray-800 dark:text-white mb-4">Tutorial Chapters</h2>
        <div className="space-y-3">
          {tutorials.map((t, i) => (
            <div key={i} className="card p-4 flex items-center gap-4 hover:border-primary-200 dark:hover:border-primary-700 cursor-pointer group">
              <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center shrink-0">
                <span className="text-primary-700 dark:text-primary-400 font-bold text-sm">{i + 1}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-gray-800 dark:text-gray-100">{t.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">{t.desc}</p>
              </div>
              <span className="text-xs text-gray-400 font-medium">{t.duration}</span>
              <Play className="w-4 h-4 text-gray-400 group-hover:text-primary-600 transition-colors" />
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="max-w-3xl mx-auto mt-12 grid sm:grid-cols-3 gap-4">
        {[
          { title: 'HD Quality', desc: 'Crystal clear video' },
          { title: 'Free Access', desc: 'No subscription needed' },
          { title: 'Expert Guidance', desc: 'Learn at your own pace' },
        ].map((f, i) => (
          <div key={i} className="card p-4 text-center">
            <CheckCircle className="w-8 h-8 text-primary-600 dark:text-primary-400 mx-auto mb-2" />
            <p className="font-semibold text-sm text-gray-800 dark:text-gray-100">{f.title}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
