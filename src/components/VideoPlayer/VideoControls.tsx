import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
  PictureInPicture,
  SkipBack,
  SkipForward,
  Subtitles,
  List,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Chapter } from './useChapters';
import { ChapterMarkers } from './ChapterMarkers';

interface VideoControlsProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  playbackRate: number;
  isFullscreen: boolean;
  isPiP: boolean;
  buffered: number;
  subtitlesEnabled: boolean;
  hasSubtitles: boolean;
  hasPlaylist: boolean;
  showSettings: boolean;
  chapters: Chapter[];
  onPlayPause: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
  onMuteToggle: () => void;
  onPlaybackRateChange: (rate: number) => void;
  onFullscreenToggle: () => void;
  onPiPToggle: () => void;
  onSubtitlesToggle: () => void;
  onSettingsClick: () => void;
  onPlaylistClick: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onThumbnailHover: (show: boolean, time: number, position: number) => void;
}

const formatTime = (seconds: number): string => {
  if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

export const VideoControls: React.FC<VideoControlsProps> = ({
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  isFullscreen,
  isPiP,
  buffered,
  subtitlesEnabled,
  hasSubtitles,
  hasPlaylist,
  onPlayPause,
  onSeek,
  onVolumeChange,
  onMuteToggle,
  onFullscreenToggle,
  onPiPToggle,
  onSubtitlesToggle,
  onSettingsClick,
  onPlaylistClick,
  onNext,
  onPrevious,
  showSettings,
  chapters,
  onThumbnailHover,
}) => {
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const progressRef = useRef<HTMLDivElement>(null);

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = progressRef.current?.getBoundingClientRect();
    if (!rect) return;

    const pos = (e.clientX - rect.left) / rect.width;
    onSeek(pos * duration);
  };

  const handleProgressHover = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = progressRef.current?.getBoundingClientRect();
    if (!rect) return;

    const pos = (e.clientX - rect.left) / rect.width;
    const time = pos * duration;
    const position = pos * 100;

    onThumbnailHover(true, time, position);
  };

  const handleProgressLeave = () => {
    onThumbnailHover(false, 0, 0);
  };

  return (
    <div className="bg-gradient-to-t from-player-overlay/90 to-transparent backdrop-blur-sm px-4 pb-3 pt-8">
      {/* Progress Bar */}
      <div className="mb-3 group/progress cursor-pointer">
        <div
          ref={progressRef}
          className="relative h-1 bg-progress-bg rounded-full overflow-hidden hover:h-1.5 transition-all"
          onClick={handleProgressClick}
          onMouseMove={handleProgressHover}
          onMouseLeave={handleProgressLeave}
        >
          {/* Chapter markers */}
          <ChapterMarkers
            chapters={chapters}
            duration={duration}
            currentTime={currentTime}
            onSeek={onSeek}
          />

          {/* Buffered */}
          <div
            className="absolute h-full bg-progress-buffer transition-all"
            style={{ width: `${buffered}%` }}
          />
          {/* Progress */}
          <div
            className="absolute h-full bg-primary transition-all"
            style={{ width: `${progress}%` }}
          />
          {/* Hover indicator */}
          <div className="absolute inset-0 opacity-0 group-hover/progress:opacity-100">
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full shadow-lg transition-all"
              style={{ left: `${progress}%`, transform: 'translate(-50%, -50%)' }}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Left controls */}
        <div className="flex items-center gap-1">
          {hasPlaylist && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onPrevious}
              className="h-8 w-8 text-foreground hover:text-primary hover:bg-secondary"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={onPlayPause}
            className="h-9 w-9 text-foreground hover:text-primary hover:bg-secondary"
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </Button>

          {hasPlaylist && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onNext}
              className="h-8 w-8 text-foreground hover:text-primary hover:bg-secondary"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => onSeek(Math.max(0, currentTime - 10))}
            className="h-8 w-8 text-foreground hover:text-primary hover:bg-secondary"
          >
            <SkipBack className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => onSeek(Math.min(duration, currentTime + 10))}
            className="h-8 w-8 text-foreground hover:text-primary hover:bg-secondary"
          >
            <SkipForward className="h-4 w-4" />
          </Button>

          {/* Volume */}
          <div className="flex items-center gap-2 group/volume">
            <Button
              variant="ghost"
              size="icon"
              onClick={onMuteToggle}
              className="h-8 w-8 text-foreground hover:text-primary hover:bg-secondary"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
            <div className="w-0 overflow-hidden opacity-0 group-hover/volume:w-24 group-hover/volume:opacity-100 transition-all duration-200">
              <Slider
                value={[isMuted ? 0 : volume * 100]}
                onValueChange={(value) => onVolumeChange(value[0] / 100)}
                max={100}
                step={1}
                className="w-24"
              />
            </div>
          </div>

          {/* Time */}
          <span className="text-sm text-foreground font-medium tabular-nums ml-2">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-1 ml-auto">
          {hasSubtitles && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onSubtitlesToggle}
              className={`h-8 w-8 hover:bg-secondary ${
                subtitlesEnabled ? 'text-primary' : 'text-foreground hover:text-primary'
              }`}
              title="Toggle Subtitles (C)"
            >
              <Subtitles className="h-4 w-4" />
            </Button>
          )}

          {hasPlaylist && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onPlaylistClick}
              className="h-8 w-8 text-foreground hover:text-primary hover:bg-secondary"
            >
              <List className="h-4 w-4" />
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={onSettingsClick}
            className={`h-8 w-8 hover:bg-secondary ${
              showSettings ? 'text-primary' : 'text-foreground hover:text-primary'
            }`}
          >
            <Settings className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={onPiPToggle}
            className={`h-8 w-8 hover:bg-secondary ${
              isPiP ? 'text-primary' : 'text-foreground hover:text-primary'
            }`}
          >
            <PictureInPicture className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={onFullscreenToggle}
            className="h-8 w-8 text-foreground hover:text-primary hover:bg-secondary"
          >
            {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
};
