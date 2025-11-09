import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { VideoFilters as VideoFiltersType } from './useVideoFilters';

interface VideoFiltersProps {
  filters: VideoFiltersType;
  onFilterChange: (key: keyof VideoFiltersType, value: number) => void;
  onReset: () => void;
}

export const VideoFilters: React.FC<VideoFiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
}) => {
  const filterConfig = [
    { key: 'brightness' as const, label: 'Brightness', min: 0, max: 200, default: 100 },
    { key: 'contrast' as const, label: 'Contrast', min: 0, max: 200, default: 100 },
    { key: 'saturation' as const, label: 'Saturation', min: 0, max: 200, default: 100 },
    { key: 'hue' as const, label: 'Hue', min: 0, max: 360, default: 0 },
    { key: 'blur' as const, label: 'Blur', min: 0, max: 10, default: 0 },
    { key: 'grayscale' as const, label: 'Grayscale', min: 0, max: 100, default: 0 },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-foreground">Video Filters</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="h-8 px-2"
        >
          <RotateCcw className="h-4 w-4 mr-1" />
          Reset
        </Button>
      </div>

      {filterConfig.map(({ key, label, min, max, default: defaultValue }) => (
        <div key={key} className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs text-muted-foreground">{label}</label>
            <span className="text-xs text-foreground font-medium">
              {filters[key]}
              {key === 'hue' ? '°' : key === 'blur' ? 'px' : '%'}
            </span>
          </div>
          <Slider
            value={[filters[key]]}
            onValueChange={([value]) => onFilterChange(key, value)}
            min={min}
            max={max}
            step={1}
            className="w-full"
          />
        </div>
      ))}
    </div>
  );
};
