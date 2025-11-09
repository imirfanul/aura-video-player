import React from 'react';
import { Chapter } from './useChapters';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ChapterMarkersProps {
  chapters: Chapter[];
  duration: number;
  currentTime: number;
  onSeek: (time: number) => void;
}

export const ChapterMarkers: React.FC<ChapterMarkersProps> = ({
  chapters,
  duration,
  currentTime,
  onSeek,
}) => {
  if (chapters.length === 0) return null;

  return (
    <div className="absolute inset-x-0 top-0 h-full pointer-events-none">
      {chapters.map((chapter) => {
        const startPercent = (chapter.startTime / duration) * 100;
        const widthPercent = ((chapter.endTime - chapter.startTime) / duration) * 100;
        const isActive = currentTime >= chapter.startTime && currentTime < chapter.endTime;

        return (
          <TooltipProvider key={chapter.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className="absolute top-0 h-full border-l border-foreground/30 pointer-events-auto cursor-pointer hover:border-primary transition-colors"
                  style={{ left: `${startPercent}%` }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSeek(chapter.startTime);
                  }}
                >
                  {isActive && (
                    <div
                      className="absolute top-0 h-full bg-primary/20"
                      style={{ width: `${widthPercent * (100 / startPercent)}%` }}
                    />
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="text-xs">{chapter.title}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      })}
    </div>
  );
};
