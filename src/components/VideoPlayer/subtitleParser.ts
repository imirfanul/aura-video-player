export interface SubtitleCue {
  start: number;
  end: number;
  text: string;
}

export interface SubtitleTrack {
  label: string;
  language: string;
  src: string;
  kind?: 'subtitles' | 'captions';
}

/**
 * Parse SRT subtitle format
 * Format:
 * 1
 * 00:00:01,000 --> 00:00:04,000
 * Subtitle text here
 */
export const parseSRT = (content: string): SubtitleCue[] => {
  const cues: SubtitleCue[] = [];
  const blocks = content.trim().split(/\n\s*\n/);

  for (const block of blocks) {
    const lines = block.split('\n');
    if (lines.length < 3) continue;

    const timeMatch = lines[1].match(/(\d{2}):(\d{2}):(\d{2}),(\d{3})\s*-->\s*(\d{2}):(\d{2}):(\d{2}),(\d{3})/);
    if (!timeMatch) continue;

    const start =
      parseInt(timeMatch[1]) * 3600 +
      parseInt(timeMatch[2]) * 60 +
      parseInt(timeMatch[3]) +
      parseInt(timeMatch[4]) / 1000;

    const end =
      parseInt(timeMatch[5]) * 3600 +
      parseInt(timeMatch[6]) * 60 +
      parseInt(timeMatch[7]) +
      parseInt(timeMatch[8]) / 1000;

    const text = lines.slice(2).join('\n').trim();

    cues.push({ start, end, text });
  }

  return cues;
};

/**
 * Parse VTT (WebVTT) subtitle format
 * Format:
 * WEBVTT
 * 
 * 00:00:01.000 --> 00:00:04.000
 * Subtitle text here
 */
export const parseVTT = (content: string): SubtitleCue[] => {
  const cues: SubtitleCue[] = [];
  const lines = content.split('\n');
  let i = 0;

  // Skip WEBVTT header and any metadata
  while (i < lines.length && !lines[i].includes('-->')) {
    i++;
  }

  while (i < lines.length) {
    const line = lines[i].trim();

    // Match time codes
    const timeMatch = line.match(/(\d{2}):(\d{2}):(\d{2})\.(\d{3})\s*-->\s*(\d{2}):(\d{2}):(\d{2})\.(\d{3})/);
    
    if (timeMatch) {
      const start =
        parseInt(timeMatch[1]) * 3600 +
        parseInt(timeMatch[2]) * 60 +
        parseInt(timeMatch[3]) +
        parseInt(timeMatch[4]) / 1000;

      const end =
        parseInt(timeMatch[5]) * 3600 +
        parseInt(timeMatch[6]) * 60 +
        parseInt(timeMatch[7]) +
        parseInt(timeMatch[8]) / 1000;

      // Collect subtitle text until empty line
      const textLines: string[] = [];
      i++;
      while (i < lines.length && lines[i].trim() !== '') {
        textLines.push(lines[i].trim());
        i++;
      }

      const text = textLines.join('\n');
      cues.push({ start, end, text });
    }

    i++;
  }

  return cues;
};

/**
 * Load and parse subtitle file
 */
export const loadSubtitleFile = async (url: string): Promise<SubtitleCue[]> => {
  try {
    const response = await fetch(url);
    const content = await response.text();

    // Determine format based on content or file extension
    if (content.includes('WEBVTT') || url.endsWith('.vtt')) {
      return parseVTT(content);
    } else if (url.endsWith('.srt')) {
      return parseSRT(content);
    } else {
      // Try to auto-detect
      if (content.includes('-->')) {
        if (content.includes(',')) {
          return parseSRT(content);
        } else {
          return parseVTT(content);
        }
      }
    }

    return [];
  } catch (error) {
    console.error('Failed to load subtitle file:', error);
    return [];
  }
};

/**
 * Find active subtitle cue for current time
 */
export const findActiveCue = (cues: SubtitleCue[], currentTime: number): SubtitleCue | null => {
  return cues.find((cue) => currentTime >= cue.start && currentTime <= cue.end) || null;
};
