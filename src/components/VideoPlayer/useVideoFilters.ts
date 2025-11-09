import { useState, useEffect, RefObject } from 'react';

export interface VideoFilters {
  brightness: number;
  contrast: number;
  saturation: number;
  hue: number;
  blur: number;
  grayscale: number;
}

export const useVideoFilters = (videoRef: RefObject<HTMLVideoElement>) => {
  const [filters, setFilters] = useState<VideoFilters>({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    hue: 0,
    blur: 0,
    grayscale: 0,
  });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const filterString = `
      brightness(${filters.brightness}%)
      contrast(${filters.contrast}%)
      saturate(${filters.saturation}%)
      hue-rotate(${filters.hue}deg)
      blur(${filters.blur}px)
      grayscale(${filters.grayscale}%)
    `.trim();

    video.style.filter = filterString;
  }, [filters, videoRef]);

  const updateFilter = (key: keyof VideoFilters, value: number) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      brightness: 100,
      contrast: 100,
      saturation: 100,
      hue: 0,
      blur: 0,
      grayscale: 0,
    });
  };

  return { filters, updateFilter, resetFilters };
};
