import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X, ChevronLeft } from 'lucide-react';
import { SubtitleStyle } from './SubtitleDisplay';
import { SubtitleTrack } from './subtitleParser';
import { VideoFilters as VideoFiltersType } from './useVideoFilters';
import { VideoFilters } from './VideoFilters';
import { SubtitleUploader } from './SubtitleUploader';
import { QualityLevel } from './useQuality';

interface VideoSettingsProps {
  playbackRate: number;
  subtitleStyle: SubtitleStyle;
  subtitles: SubtitleTrack[];
  activeSubtitleIndex: number;
  filters: VideoFiltersType;
  qualities: QualityLevel[];
  currentQuality: number;
  onPlaybackRateChange: (rate: number) => void;
  onSubtitleStyleChange: (style: SubtitleStyle) => void;
  onSubtitleTrackChange: (index: number) => void;
  onSubtitleUpload: (file: File) => void;
  onFilterChange: (key: keyof VideoFiltersType, value: number) => void;
  onResetFilters: () => void;
  onQualityChange: (level: number) => void;
  onClose: () => void;
}

const playbackRates = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

export const VideoSettings: React.FC<VideoSettingsProps> = ({
  playbackRate,
  subtitleStyle,
  subtitles,
  activeSubtitleIndex,
  filters,
  qualities,
  currentQuality,
  onPlaybackRateChange,
  onSubtitleStyleChange,
  onSubtitleTrackChange,
  onSubtitleUpload,
  onFilterChange,
  onResetFilters,
  onQualityChange,
  onClose,
}) => {
  const updateSubtitleStyle = (updates: Partial<SubtitleStyle>) => {
    onSubtitleStyleChange({ ...subtitleStyle, ...updates });
  };

  return (
    <div className="absolute bottom-20 right-4 w-96 max-h-[500px] bg-player-controls/95 backdrop-blur-md border border-border rounded-lg shadow-xl overflow-hidden z-50">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">Settings</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <Tabs defaultValue="subtitles" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-4 px-4">
          <TabsTrigger value="subtitles">Subtitles</TabsTrigger>
          <TabsTrigger value="filters">Filters</TabsTrigger>
          <TabsTrigger value="quality">Quality</TabsTrigger>
          <TabsTrigger value="playback">Playback</TabsTrigger>
        </TabsList>

        <div className="px-4 pb-4 max-h-[380px] overflow-y-auto">
          <TabsContent value="subtitles" className="space-y-6 mt-0">
            <Tabs defaultValue="style" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="style">Style</TabsTrigger>
                <TabsTrigger value="tracks">Tracks</TabsTrigger>
                <TabsTrigger value="upload">Upload</TabsTrigger>
              </TabsList>

              <TabsContent value="style" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-muted-foreground">Font Size</label>
                    <span className="text-xs text-foreground font-medium">{subtitleStyle.fontSize}px</span>
                  </div>
                  <Slider
                    value={[subtitleStyle.fontSize]}
                    onValueChange={([value]) => updateSubtitleStyle({ fontSize: value })}
                    min={14}
                    max={40}
                    step={2}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">Text Color</label>
                  <input
                    type="color"
                    value={subtitleStyle.textColor}
                    onChange={(e) => updateSubtitleStyle({ textColor: e.target.value })}
                    className="w-full h-10 rounded cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">Background Color</label>
                  <input
                    type="color"
                    value={subtitleStyle.backgroundColor}
                    onChange={(e) => updateSubtitleStyle({ backgroundColor: e.target.value })}
                    className="w-full h-10 rounded cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-muted-foreground">Background Opacity</label>
                    <span className="text-xs text-foreground font-medium">
                      {Math.round(subtitleStyle.backgroundOpacity * 100)}%
                    </span>
                  </div>
                  <Slider
                    value={[subtitleStyle.backgroundOpacity * 100]}
                    onValueChange={([value]) => updateSubtitleStyle({ backgroundOpacity: value / 100 })}
                    min={0}
                    max={100}
                    step={5}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">Position</label>
                  <div className="flex gap-2">
                    <Button
                      variant={subtitleStyle.position === 'bottom' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateSubtitleStyle({ position: 'bottom' })}
                      className="flex-1"
                    >
                      Bottom
                    </Button>
                    <Button
                      variant={subtitleStyle.position === 'top' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateSubtitleStyle({ position: 'top' })}
                      className="flex-1"
                    >
                      Top
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="tracks" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Button
                    variant={activeSubtitleIndex === -1 ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onSubtitleTrackChange(-1)}
                    className="w-full justify-start"
                  >
                    Off
                  </Button>

                  {subtitles.map((track, index) => (
                    <Button
                      key={track.src}
                      variant={activeSubtitleIndex === index ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => onSubtitleTrackChange(index)}
                      className="w-full justify-start"
                    >
                      {track.label} {track.language && `(${track.language})`}
                    </Button>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="upload" className="space-y-4 mt-4">
                <SubtitleUploader onSubtitleUpload={onSubtitleUpload} />
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="filters" className="space-y-4 mt-0">
            <VideoFilters
              filters={filters}
              onFilterChange={onFilterChange}
              onReset={onResetFilters}
            />
          </TabsContent>

          <TabsContent value="quality" className="space-y-4 mt-0">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-foreground mb-4">Video Quality</h3>

              {qualities.length > 0 ? (
                <>
                  <Button
                    variant={currentQuality === -1 ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onQualityChange(-1)}
                    className="w-full justify-start"
                  >
                    Auto
                  </Button>

                  {qualities.map((quality, index) => (
                    <Button
                      key={index}
                      variant={currentQuality === index ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => onQualityChange(index)}
                      className="w-full justify-start"
                    >
                      {quality.label} ({Math.round(quality.bitrate / 1000)}kbps)
                    </Button>
                  ))}
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Quality selection is only available for adaptive streaming sources (HLS/DASH)
                </p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="playback" className="space-y-4 mt-0">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-foreground mb-4">Playback Speed</h3>
              {playbackRates.map((rate) => (
                <Button
                  key={rate}
                  variant={playbackRate === rate ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onPlaybackRateChange(rate)}
                  className="w-full justify-start"
                >
                  {rate === 1 ? 'Normal' : `${rate}x`}
                </Button>
              ))}
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
