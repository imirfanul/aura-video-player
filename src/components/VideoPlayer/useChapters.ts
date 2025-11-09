import { useState, useCallback } from 'react';

export interface Chapter {
  id: string;
  title: string;
  startTime: number;
  endTime: number;
}

export const useChapters = (initialChapters: Chapter[] = []) => {
  const [chapters] = useState<Chapter[]>(initialChapters);

  const getCurrentChapter = useCallback((currentTime: number): Chapter | null => {
    return chapters.find(
      chapter => currentTime >= chapter.startTime && currentTime < chapter.endTime
    ) || null;
  }, [chapters]);

  const getChapterAtPosition = useCallback((position: number, duration: number): Chapter | null => {
    const time = (position / 100) * duration;
    return getCurrentChapter(time);
  }, [getCurrentChapter]);

  return {
    chapters,
    getCurrentChapter,
    getChapterAtPosition,
  };
};
