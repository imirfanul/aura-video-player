import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

interface SubtitleUploaderProps {
  onSubtitleUpload: (file: File) => void;
}

export const SubtitleUploader: React.FC<SubtitleUploaderProps> = ({ onSubtitleUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.name.endsWith('.srt') || file.name.endsWith('.vtt'))) {
      onSubtitleUpload(file);
    }
  };

  return (
    <div className="space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        accept=".srt,.vtt"
        onChange={handleFileChange}
        className="hidden"
      />
      <Button
        variant="outline"
        size="sm"
        onClick={() => fileInputRef.current?.click()}
        className="w-full"
      >
        <Upload className="h-4 w-4 mr-2" />
        Upload Subtitle File
      </Button>
      <p className="text-xs text-muted-foreground">
        Supports .srt and .vtt formats
      </p>
    </div>
  );
};
