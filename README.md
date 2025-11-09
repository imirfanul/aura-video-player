# Aura Video Player

A professional React video player component with advanced features including filters, playlists, adaptive streaming (HLS/DASH), subtitles, chapter markers, and full keyboard controls.

**Developed by Md Irfanul Alam**

## Features

- 🎬 **Full Playback Controls** - Play, pause, seek, volume, playback speed
- 🎨 **Video Filters** - Brightness, contrast, saturation, hue, blur, grayscale
- 📝 **Subtitle Support** - SRT & VTT parsing with customizable styling
- 📋 **Playlist Management** - Queue, shuffle, repeat modes
- 🎯 **Chapter Markers** - Navigate video sections with visual timeline
- 🎥 **Quality Selection** - HLS/DASH adaptive streaming support
- 🖼️ **Thumbnail Preview** - Hover seek bar for frame previews
- ⌨️ **Keyboard Shortcuts** - Complete keyboard navigation
- 📱 **Picture-in-Picture** - Watch while multitasking
- 🖥️ **Fullscreen** - Immersive viewing experience

## Installation

```bash
npm install aura-video-player
```

## Usage

```tsx
import { VideoPlayer } from 'aura-video-player';

function App() {
  return (
    <VideoPlayer
      src="video.mp4"
      poster="thumbnail.jpg"
      subtitles={[
        {
          label: 'English',
          language: 'en',
          src: 'subtitles-en.srt'
        }
      ]}
      playlist={[
        { id: '1', title: 'Video 1', src: 'video1.mp4' },
        { id: '2', title: 'Video 2', src: 'video2.mp4' }
      ]}
      chapters={[
        { time: 0, title: 'Introduction' },
        { time: 60, title: 'Main Content' }
      ]}
      onPlay={() => console.log('Playing')}
    />
  );
}
```

## Keyboard Shortcuts

- `Space` - Play/Pause
- `←/→` - Seek 10 seconds
- `↑/↓` - Volume up/down
- `M` - Mute/Unmute
- `C` - Toggle subtitles
- `F` - Fullscreen
- `P` - Picture-in-Picture

## Technologies

Built with React, TypeScript, Tailwind CSS, and HLS.js

## Project Development

**URL**: https://lovable.dev/projects/c797951c-2a1d-4a4d-9da9-82ec030c5a03

### Local Development

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm i

# Start dev server
npm run dev
```

## License

© 2024 Aura Video Player by Md Irfanul Alam