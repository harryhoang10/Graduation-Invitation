import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, VolumeX, Music, Upload, X } from 'lucide-react';
import { useData } from '../context/DataContext';

const DEFAULT_AUDIO_URL = 'https://cdn.pixabay.com/audio/2022/03/15/audio_1084b6f125.mp3';
const AUDIO_STORAGE_KEY = 'graduation_audio_data';

/**
 * Convert a File to a base64 data URL for persistent storage.
 */
function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export const AudioPlayer: React.FC<{ isUnlocked: boolean }> = ({ isUnlocked }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showUploadPanel, setShowUploadPanel] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [audioFileName, setAudioFileName] = useState('');
  const [audioSrc, setAudioSrc] = useState('');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isAdmin, data, updateData } = useData();

  // Load audio from data context or localStorage on mount
  useEffect(() => {
    // Priority: data context audioUrl > localStorage > default
    const contextUrl = (data as any).audioUrl;
    if (contextUrl) {
      setAudioSrc(contextUrl);
      setAudioFileName((data as any).audioFileName || 'Custom audio');
      return;
    }

    const stored = localStorage.getItem(AUDIO_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setAudioSrc(parsed.url || DEFAULT_AUDIO_URL);
        setAudioFileName(parsed.name || '');
      } catch {
        setAudioSrc(DEFAULT_AUDIO_URL);
      }
    } else {
      setAudioSrc(DEFAULT_AUDIO_URL);
    }
  }, [data]);

  // Update audio element when src changes
  useEffect(() => {
    if (audioRef.current && audioSrc) {
      const wasPlaying = isPlaying;
      audioRef.current.pause();
      audioRef.current.src = audioSrc;
      audioRef.current.load();
      if (wasPlaying) {
        audioRef.current.play().catch(() => {});
      }
    }
  }, [audioSrc]);

  // Play audio when invitation is unlocked
  useEffect(() => {
    if (isUnlocked && !isPlaying && audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.warn('Autoplay prevented by browser:', err);
      });
    }
  }, [isUnlocked]);

  useEffect(() => {
    const playAudio = async () => {
      if (audioRef.current && !isPlaying) {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (err) {
          // Autoplay prevented, waiting for user interaction
        }
      }
    };

    playAudio();

    const handleInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
        playAudio();
      }
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
    };

    document.addEventListener('click', handleInteraction);
    document.addEventListener('touchstart', handleInteraction);
    document.addEventListener('keydown', handleInteraction);

    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
    };
  }, [isPlaying, hasInteracted]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleAudioFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('audio/')) {
      alert('Vui lòng chọn file âm thanh (MP3, WAV, v.v)');
      return;
    }

    try {
      // Check if file is too large for localStorage (approx > 2MB will usually fail in base64)
      const MAX_SIZE_MB = 2;
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        alert(`File quá lớn (${(file.size / 1024 / 1024).toFixed(1)}MB). Vui lòng chọn file dưới ${MAX_SIZE_MB}MB để có thể lưu trữ vĩnh viễn.\n\nNhạc vẫn sẽ phát tạm thời nhưng không được lưu lại.`);
        // Fallback to object URL for temporary playback
        const tempUrl = URL.createObjectURL(file);
        setAudioSrc(tempUrl);
        setAudioFileName(file.name + ' (Chưa lưu)');
        setShowUploadPanel(false);
        setIsDragOver(false);
        return;
      }

      // For large files, use object URL instead of base64 to avoid localStorage limits
      // But also save base64 for share link persistence
      const dataUrl = await fileToDataUrl(file);
      
      setAudioSrc(dataUrl);
      setAudioFileName(file.name);
      setShowUploadPanel(false);
      setIsDragOver(false);

      try {
        // Save to localStorage for persistence across page reloads
        localStorage.setItem(AUDIO_STORAGE_KEY, JSON.stringify({
          url: dataUrl,
          name: file.name
        }));
      } catch (e) {
        console.warn('LocalStorage quota exceeded, could not save audio file persistently', e);
        alert('Cảnh báo: File hơi lớn nên không thể lưu vào bộ nhớ tạm của trình duyệt, nhưng vẫn có thể lưu vào file data.ts nếu bạn nhấn Save.');
      }

      // Also save to data context so it's included in share links
      updateData('audioUrl', dataUrl);
      updateData('audioFileName', file.name);
    } catch (err) {
      console.error('Failed to process audio file:', err);
      alert('Có lỗi xảy ra khi xử lý file âm thanh.');
    }
  }, [updateData]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleAudioFile(file);
  }, [handleAudioFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleAudioFile(file);
  }, [handleAudioFile]);

  const resetToDefault = useCallback(() => {
    setAudioSrc(DEFAULT_AUDIO_URL);
    setAudioFileName('');
    localStorage.removeItem(AUDIO_STORAGE_KEY);
    updateData('audioUrl', '');
    updateData('audioFileName', '');
    setShowUploadPanel(false);
  }, [updateData]);

  return (
    <>
      <audio ref={audioRef} loop src={audioSrc}>
        <source src={audioSrc} type="audio/mpeg" />
      </audio>

      {/* Hidden file input */}
      <input 
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        className="hidden"
        onChange={handleFileInputChange}
      />
      
      {/* Audio control button — moves up when admin toolbar visible */}
      <div className={`fixed right-6 z-50 flex flex-col items-end gap-3 ${
        isAdmin ? 'bottom-24' : 'bottom-6'
      }`}>
        {/* Upload panel (admin only) */}
        {isAdmin && showUploadPanel && (
          <div 
            className="bg-background-dark/95 backdrop-blur-xl border border-primary/30 rounded-2xl p-5 w-72 shadow-[0_0_40px_rgba(212,175,55,0.2)] animate-fade-in"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Music size={16} className="text-primary" />
                <span className="text-white font-bold text-sm">Nhạc nền</span>
              </div>
              <button 
                onClick={() => setShowUploadPanel(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Current audio info */}
            {audioFileName && (
              <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 mb-4 flex items-center gap-2">
                <Music size={12} className="text-primary shrink-0" />
                <span className="text-xs text-slate-300 truncate">{audioFileName}</span>
              </div>
            )}

            {/* Drag-and-drop zone */}
            <div 
              className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${
                isDragOver 
                  ? 'border-primary bg-primary/10' 
                  : 'border-white/20 hover:border-primary/50 hover:bg-white/5'
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={24} className={`mx-auto mb-2 ${isDragOver ? 'text-primary animate-bounce' : 'text-slate-500'}`} />
              <p className="text-white text-xs font-bold mb-1">
                {isDragOver ? 'Thả file vào đây' : 'Kéo thả file MP3'}
              </p>
              <p className="text-slate-500 text-[10px]">hoặc click để chọn file</p>
            </div>

            {/* Reset button */}
            {audioFileName && (
              <button 
                onClick={resetToDefault}
                className="w-full mt-3 text-xs text-slate-500 hover:text-slate-300 transition-colors text-center py-1"
              >
                Đặt lại nhạc mặc định
              </button>
            )}
          </div>
        )}

        {/* Main audio button */}
        <div className="flex items-center gap-2">
          {/* Music upload button (admin only) */}
          {isAdmin && (
            <button 
              onClick={() => setShowUploadPanel(!showUploadPanel)}
              className={`w-10 h-10 bg-background-dark/80 backdrop-blur-xl border rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.15)] hover:scale-110 transition-all cursor-pointer ${
                showUploadPanel ? 'border-primary text-primary' : 'border-white/20 text-slate-400 hover:text-primary hover:border-primary/30'
              }`}
              title="Thay đổi nhạc nền"
            >
              <Music size={16} />
            </button>
          )}

          {/* Play/Pause button */}
          <button 
            onClick={togglePlay}
            className="w-12 h-12 bg-background-dark/80 backdrop-blur-xl border border-primary/30 rounded-full flex items-center justify-center text-primary shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:scale-110 transition-all cursor-pointer"
          >
            {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
        </div>
      </div>
    </>
  );
};
