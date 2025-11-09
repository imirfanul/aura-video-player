import { useState, useEffect, useRef, RefObject } from 'react';
import Hls from 'hls.js';

export interface QualityLevel {
  height: number;
  width: number;
  bitrate: number;
  label: string;
}

export const useQuality = (videoRef: RefObject<HTMLVideoElement>, src: string) => {
  const [qualities, setQualities] = useState<QualityLevel[]>([]);
  const [currentQuality, setCurrentQuality] = useState<number>(-1); // -1 means auto
  const [isHls, setIsHls] = useState(false);
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Check if source is HLS
    const isHlsSource = src.endsWith('.m3u8');
    setIsHls(isHlsSource);

    if (isHlsSource && Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      });

      hlsRef.current = hls;
      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        const levels = hls.levels.map((level, index) => ({
          height: level.height,
          width: level.width,
          bitrate: level.bitrate,
          label: `${level.height}p`,
        }));
        setQualities(levels);
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (_, data) => {
        setCurrentQuality(data.level);
      });

      return () => {
        hls.destroy();
        hlsRef.current = null;
      };
    } else if (isHlsSource && video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS support (Safari)
      video.src = src;
      setQualities([{ height: 0, width: 0, bitrate: 0, label: 'Auto' }]);
    } else {
      // Regular video source
      video.src = src;
      setQualities([]);
    }
  }, [src, videoRef]);

  const changeQuality = (level: number) => {
    if (hlsRef.current) {
      hlsRef.current.currentLevel = level;
      setCurrentQuality(level);
    }
  };

  return {
    qualities,
    currentQuality,
    changeQuality,
    isHls,
  };
};
