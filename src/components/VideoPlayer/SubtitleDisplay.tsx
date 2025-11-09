import React from 'react';

export interface SubtitleStyle {
  fontSize: number;
  fontFamily: string;
  textColor: string;
  backgroundColor: string;
  backgroundOpacity: number;
  position: 'bottom' | 'top';
}

interface SubtitleDisplayProps {
  text: string;
  style: SubtitleStyle;
}

export const SubtitleDisplay: React.FC<SubtitleDisplayProps> = ({ text, style }) => {
  if (!text) return null;

  const positionClass = style.position === 'top' ? 'top-4' : 'bottom-24';

  return (
    <div
      className={`absolute left-1/2 -translate-x-1/2 ${positionClass} max-w-[90%] px-4 py-2 rounded-lg text-center pointer-events-none z-20 transition-all`}
      style={{
        fontSize: `${style.fontSize}px`,
        fontFamily: style.fontFamily,
        color: style.textColor,
        backgroundColor: `${style.backgroundColor}${Math.round(style.backgroundOpacity * 255).toString(16).padStart(2, '0')}`,
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
        lineHeight: '1.4',
      }}
    >
      {text.split('\n').map((line, index) => (
        <div key={index}>{line}</div>
      ))}
    </div>
  );
};
