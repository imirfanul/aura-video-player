import { useState, useCallback } from 'react';

export interface PlaylistItem {
  id: string;
  title: string;
  src: string;
  poster?: string;
  duration?: number;
}

export interface PlaylistState {
  items: PlaylistItem[];
  currentIndex: number;
  shuffle: boolean;
  repeat: 'none' | 'one' | 'all';
}

export const usePlaylist = (initialItems: PlaylistItem[] = []) => {
  const [playlist, setPlaylist] = useState<PlaylistState>({
    items: initialItems,
    currentIndex: 0,
    shuffle: false,
    repeat: 'none',
  });

  const currentItem = playlist.items[playlist.currentIndex] || null;

  const playNext = useCallback(() => {
    setPlaylist(prev => {
      if (prev.items.length === 0) return prev;

      let nextIndex: number;
      
      if (prev.shuffle) {
        nextIndex = Math.floor(Math.random() * prev.items.length);
      } else {
        nextIndex = prev.currentIndex + 1;
        if (nextIndex >= prev.items.length) {
          nextIndex = prev.repeat === 'all' ? 0 : prev.currentIndex;
        }
      }

      return { ...prev, currentIndex: nextIndex };
    });
  }, []);

  const playPrevious = useCallback(() => {
    setPlaylist(prev => {
      if (prev.items.length === 0) return prev;

      let prevIndex: number;
      
      if (prev.shuffle) {
        prevIndex = Math.floor(Math.random() * prev.items.length);
      } else {
        prevIndex = prev.currentIndex - 1;
        if (prevIndex < 0) {
          prevIndex = prev.repeat === 'all' ? prev.items.length - 1 : 0;
        }
      }

      return { ...prev, currentIndex: prevIndex };
    });
  }, []);

  const playIndex = useCallback((index: number) => {
    setPlaylist(prev => {
      if (index < 0 || index >= prev.items.length) return prev;
      return { ...prev, currentIndex: index };
    });
  }, []);

  const toggleShuffle = useCallback(() => {
    setPlaylist(prev => ({ ...prev, shuffle: !prev.shuffle }));
  }, []);

  const toggleRepeat = useCallback(() => {
    setPlaylist(prev => {
      const modes: Array<'none' | 'one' | 'all'> = ['none', 'one', 'all'];
      const currentIndex = modes.indexOf(prev.repeat);
      const nextMode = modes[(currentIndex + 1) % modes.length];
      return { ...prev, repeat: nextMode };
    });
  }, []);

  const addToPlaylist = useCallback((item: PlaylistItem) => {
    setPlaylist(prev => ({
      ...prev,
      items: [...prev.items, item],
    }));
  }, []);

  const removeFromPlaylist = useCallback((index: number) => {
    setPlaylist(prev => {
      const newItems = prev.items.filter((_, i) => i !== index);
      let newIndex = prev.currentIndex;
      
      if (index < prev.currentIndex) {
        newIndex = prev.currentIndex - 1;
      } else if (index === prev.currentIndex && newItems.length > 0) {
        newIndex = Math.min(prev.currentIndex, newItems.length - 1);
      }

      return {
        ...prev,
        items: newItems,
        currentIndex: Math.max(0, newIndex),
      };
    });
  }, []);

  return {
    playlist,
    currentItem,
    playNext,
    playPrevious,
    playIndex,
    toggleShuffle,
    toggleRepeat,
    addToPlaylist,
    removeFromPlaylist,
  };
};
