import React, { useRef, useState, useEffect } from 'react';
import { VideoControls } from './VideoControls';
import { VideoSettings } from './VideoSettings';
import { useVideoPlayer } from './useVideoPlayer';
import { SubtitleDisplay, SubtitleStyle } from './SubtitleDisplay';
import { SubtitleTrack, loadSubtitleFile, findActiveCue, SubtitleCue } from './subtitleParser';
import { useVideoFilters } from './useVideoFilters';
import { usePlaylist, PlaylistItem } from './usePlaylist';
import { useQuality } from './useQuality';
import { useChapters, Chapter } from './useChapters';
import { PlaylistPanel } from './PlaylistPanel';
import { ThumbnailPreview } from './ThumbnailPreview';

export interface VideoPlayerProps {
  src: string;
  poster?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  className?: string;
  subtitles?: SubtitleTrack[];
  playlist?: PlaylistItem[];
  chapters?: Chapter[];
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number) => void;
  onVolumeChange?: (volume: number) => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  poster,
  autoPlay = false,
  loop = false,
  muted = false,
  className = '',
  subtitles = [],
  playlist: initialPlaylist = [],
  chapters: initialChapters = [],
  onPlay,
  onPause,
  onEnded,
  onTimeUpdate,
  onVolumeChange,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [showThumbnail, setShowThumbnail] = useState(false);
  const [thumbnailTime, setThumbnailTime] = useState(0);
  const [thumbnailPosition, setThumbnailPosition] = useState(0);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  // Subtitle state
  const [subtitleTracks, setSubtitleTracks] = useState<Map<string, SubtitleCue[]>>(new Map());
  const [activeSubtitleIndex, setActiveSubtitleIndex] = useState<number>(-1);
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(false);
  const [currentSubtitleText, setCurrentSubtitleText] = useState('');
  const [subtitleStyle, setSubtitleStyle] = useState<SubtitleStyle>({
    fontSize: 20,
    fontFamily: 'Arial, sans-serif',
    textColor: '#ffffff',
    backgroundColor: '#000000',
    backgroundOpacity: 0.75,
    position: 'bottom',
  });
  const [availableSubtitles, setAvailableSubtitles] = useState<SubtitleTrack[]>(subtitles);

  // Hooks for new features
  const { filters, updateFilter, resetFilters } = useVideoFilters(videoRef);
  const {
    playlist,
    currentItem,
    playNext,
    playPrevious,
    playIndex,
    toggleShuffle,
    toggleRepeat,
    addToPlaylist,
    removeFromPlaylist,
  } = usePlaylist(initialPlaylist.length > 0 ? initialPlaylist : [{ id: '1', title: 'Current Video', src, poster }]);
  
  const currentSrc = currentItem?.src || src;
  const { qualities, currentQuality, changeQuality, isHls } = useQuality(videoRef, currentSrc);
  const { chapters, getCurrentChapter } = useChapters(initialChapters);

  const {
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    playbackRate,
    isFullscreen,
    isPiP,
    buffered,
    togglePlay,
    handleSeek,
    handleVolumeChange,
    toggleMute,
    changePlaybackRate,
    toggleFullscreen,
    togglePiP,
    skipForward,
    skipBackward,
  } = useVideoPlayer({
    videoRef,
    containerRef,
    autoPlay,
    muted,
    onPlay,
    onPause,
    onEnded: () => {
      onEnded?.();
      if (playlist.repeat === 'one') {
        videoRef.current?.play();
      } else if (playlist.items.length > 1) {
        playNext();
      }
    },
    onTimeUpdate,
    onVolumeChange,
  });

  // Load subtitle files
  useEffect(() => {
    const loadSubtitles = async () => {
      const tracks = new Map<string, SubtitleCue[]>();
      
      for (const track of availableSubtitles) {
        const cues = await loadSubtitleFile(track.src);
        tracks.set(track.src, cues);
      }
      
      setSubtitleTracks(tracks);
      
      // Enable first subtitle track by default if available
      if (availableSubtitles.length > 0 && activeSubtitleIndex === -1) {
        setActiveSubtitleIndex(0);
        setSubtitlesEnabled(true);
      }
    };

    if (availableSubtitles.length > 0) {
      loadSubtitles();
    }
  }, [availableSubtitles]);

  // Handle subtitle file upload
  const handleSubtitleUpload = async (file: File) => {
    const url = URL.createObjectURL(file);
    const newTrack: SubtitleTrack = {
      src: url,
      label: file.name.replace(/\.(srt|vtt)$/, ''),
      language: 'unknown',
    };
    setAvailableSubtitles(prev => [...prev, newTrack]);
  };

  // Update current subtitle based on time
  useEffect(() => {
    if (!subtitlesEnabled || activeSubtitleIndex === -1 || availableSubtitles.length === 0) {
      setCurrentSubtitleText('');
      return;
    }

    const activeTrack = availableSubtitles[activeSubtitleIndex];
    const cues = subtitleTracks.get(activeTrack.src);

    if (!cues) {
      setCurrentSubtitleText('');
      return;
    }

    const activeCue = findActiveCue(cues, currentTime);
    setCurrentSubtitleText(activeCue ? activeCue.text : '');
  }, [currentTime, subtitlesEnabled, activeSubtitleIndex, subtitleTracks, availableSubtitles]);

  // Update video source when playlist item changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !currentItem) return;

    if (!isHls) {
      video.src = currentItem.src;
      if (autoPlay || isPlaying) {
        video.play().catch(console.error);
      }
    }
  }, [currentItem, isHls, autoPlay, isPlaying]);

  // Auto-hide controls
  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      if (isPlaying) {
        controlsTimeoutRef.current = setTimeout(() => {
          setShowControls(false);
        }, 3000);
      }
    };

    const handleMouseLeave = () => {
      if (isPlaying) {
        setShowControls(false);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isPlaying]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowRight':
          e.preventDefault();
          skipForward();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          skipBackward();
          break;
        case 'ArrowUp':
          e.preventDefault();
          handleVolumeChange(Math.min(volume + 0.1, 1));
          break;
        case 'ArrowDown':
          e.preventDefault();
          handleVolumeChange(Math.max(volume - 0.1, 0));
          break;
        case 'm':
          e.preventDefault();
          toggleMute();
          break;
        case 'f':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'p':
          e.preventDefault();
          togglePiP();
          break;
        case 'c':
          e.preventDefault();
          setSubtitlesEnabled(!subtitlesEnabled);
          break;
        case ',':
          e.preventDefault();
          if (videoRef.current) {
            videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 1 / 30);
          }
          break;
        case '.':
          e.preventDefault();
          if (videoRef.current) {
            videoRef.current.currentTime = Math.min(
              duration,
              videoRef.current.currentTime + 1 / 30
            );
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [
    togglePlay,
    skipForward,
    skipBackward,
    volume,
    handleVolumeChange,
    toggleMute,
    toggleFullscreen,
    togglePiP,
    duration,
    subtitlesEnabled,
  ]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full bg-player-bg overflow-hidden group ${className}`}
      style={{ aspectRatio: '16/9' }}
    >
      <video
        ref={videoRef}
        src={!isHls ? currentSrc : undefined}
        poster={poster || currentItem?.poster}
        loop={loop}
        className="w-full h-full object-contain"
        onClick={togglePlay}
        crossOrigin="anonymous"
      />

      {/* Subtitles Display */}
      {subtitlesEnabled && currentSubtitleText && (
        <SubtitleDisplay text={currentSubtitleText} style={subtitleStyle} />
      )}

      {/* Center play button overlay */}
      {!isPlaying && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-player-overlay/30 cursor-pointer transition-opacity"
          onClick={togglePlay}
        >
          <div className="w-20 h-20 rounded-full bg-primary/90 flex items-center justify-center hover:bg-primary hover:scale-110 transition-all">
            <svg
              className="w-10 h-10 text-primary-foreground ml-1"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}

      {/* Controls */}
      <div
        className={`absolute bottom-0 left-0 right-0 transition-opacity duration-300 ${
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <VideoControls
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          volume={volume}
          isMuted={isMuted}
          playbackRate={playbackRate}
          isFullscreen={isFullscreen}
          isPiP={isPiP}
          buffered={buffered}
          subtitlesEnabled={subtitlesEnabled}
          hasSubtitles={availableSubtitles.length > 0}
          hasPlaylist={playlist.items.length > 1}
          chapters={chapters}
          onPlayPause={togglePlay}
          onSeek={handleSeek}
          onVolumeChange={handleVolumeChange}
          onMuteToggle={toggleMute}
          onPlaybackRateChange={changePlaybackRate}
          onFullscreenToggle={toggleFullscreen}
          onPiPToggle={togglePiP}
          onSubtitlesToggle={() => setSubtitlesEnabled(!subtitlesEnabled)}
          onSettingsClick={() => setShowSettings(!showSettings)}
          onPlaylistClick={() => setShowPlaylist(!showPlaylist)}
          onNext={playNext}
          onPrevious={playPrevious}
          showSettings={showSettings}
          onThumbnailHover={(show, time, position) => {
            setShowThumbnail(show);
            setThumbnailTime(time);
            setThumbnailPosition(position);
          }}
        />
        
        {/* Thumbnail Preview */}
        {showThumbnail && (
          <ThumbnailPreview
            videoRef={videoRef}
            time={thumbnailTime}
            position={thumbnailPosition}
            duration={duration}
          />
        )}
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <VideoSettings
          playbackRate={playbackRate}
          subtitleStyle={subtitleStyle}
          subtitles={availableSubtitles}
          activeSubtitleIndex={activeSubtitleIndex}
          filters={filters}
          qualities={qualities}
          currentQuality={currentQuality}
          onPlaybackRateChange={changePlaybackRate}
          onSubtitleStyleChange={setSubtitleStyle}
          onSubtitleTrackChange={setActiveSubtitleIndex}
          onSubtitleUpload={handleSubtitleUpload}
          onFilterChange={updateFilter}
          onResetFilters={resetFilters}
          onQualityChange={changeQuality}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* Playlist Panel */}
      {showPlaylist && (
        <PlaylistPanel
          items={playlist.items}
          currentIndex={playlist.currentIndex}
          shuffle={playlist.shuffle}
          repeat={playlist.repeat}
          onPlayItem={playIndex}
          onRemoveItem={removeFromPlaylist}
          onToggleShuffle={toggleShuffle}
          onToggleRepeat={toggleRepeat}
          onClose={() => setShowPlaylist(false)}
        />
      )}
    </div>
  );
};
