import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Shuffle, Repeat, Repeat1, X } from 'lucide-react';
import { PlaylistItem } from './usePlaylist';

interface PlaylistPanelProps {
  items: PlaylistItem[];
  currentIndex: number;
  shuffle: boolean;
  repeat: 'none' | 'one' | 'all';
  onPlayItem: (index: number) => void;
  onRemoveItem: (index: number) => void;
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
  onClose: () => void;
}

export const PlaylistPanel: React.FC<PlaylistPanelProps> = ({
  items,
  currentIndex,
  shuffle,
  repeat,
  onPlayItem,
  onRemoveItem,
  onToggleShuffle,
  onToggleRepeat,
  onClose,
}) => {
  const getRepeatIcon = () => {
    if (repeat === 'one') return <Repeat1 className="h-4 w-4" />;
    return <Repeat className="h-4 w-4" />;
  };

  return (
    <div className="absolute top-0 right-0 w-80 h-full bg-player-controls/95 backdrop-blur-sm border-l border-border z-20">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">Playlist ({items.length})</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleShuffle}
            className={`h-8 w-8 p-0 ${shuffle ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <Shuffle className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleRepeat}
            className={`h-8 w-8 p-0 ${repeat !== 'none' ? 'text-primary' : 'text-muted-foreground'}`}
          >
            {getRepeatIcon()}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="h-[calc(100%-60px)]">
        <div className="p-2 space-y-1">
          {items.map((item, index) => (
            <div
              key={item.id}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer group hover:bg-accent/50 transition-colors ${
                index === currentIndex ? 'bg-accent' : ''
              }`}
              onClick={() => onPlayItem(index)}
            >
              <div className="flex-shrink-0 w-10 h-10 bg-muted rounded overflow-hidden">
                {item.poster ? (
                  <img src={item.poster} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                    {index + 1}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                {item.duration && (
                  <p className="text-xs text-muted-foreground">
                    {Math.floor(item.duration / 60)}:{String(Math.floor(item.duration % 60)).padStart(2, '0')}
                  </p>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveItem(index);
                }}
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
