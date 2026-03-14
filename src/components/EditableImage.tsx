import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useData } from '../context/DataContext';
import { Image as ImageIcon, Check, X, Upload, Link as LinkIcon } from 'lucide-react';

interface EditableImageProps {
  path: string;
  className?: string;
  alt?: string;
}

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

export const EditableImage: React.FC<EditableImageProps> = ({ path, className = '', alt = '' }) => {
  const { data, updateData, isAdmin } = useData();
  const [isEditing, setIsEditing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [editMode, setEditMode] = useState<'url' | 'upload'>('upload');
  const [showControls, setShowControls] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const getValue = () => {
    const keys = path.split('.');
    let current: any = data;
    for (const key of keys) {
      if (current === undefined) break;
      current = current[key];
    }
    return current || '';
  };

  const [value, setValue] = useState(getValue());

  useEffect(() => {
    setValue(getValue());
  }, [data, path]);

  const handleSave = () => {
    setIsEditing(false);
    setShowControls(false);
    updateData(path, value);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setShowControls(false);
    setValue(getValue());
  };

  const handleFileSelect = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      return;
    }
    
    // Convert to base64 for persistence (works across share links too)
    const dataUrl = await fileToDataUrl(file);
    setValue(dataUrl);
    updateData(path, dataUrl);
    setIsEditing(false);
    setShowControls(false);
    setIsDragOver(false);
  }, [path, updateData]);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      await handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAdmin) {
      setIsDragOver(true);
    }
  }, [isAdmin]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleFileInputChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleFileSelect(file);
    }
  }, [handleFileSelect]);

  // Close controls when clicking outside
  useEffect(() => {
    if (!showControls && !isEditing) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        if (isEditing) {
          handleCancel();
        } else {
          setShowControls(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showControls, isEditing]);

  // Non-admin: simple image display
  if (!isAdmin) {
    return <img src={value || undefined} alt={alt} className={className} referrerPolicy="no-referrer" />;
  }

  // Admin mode: click-to-edit zone + edit controls
  return (
    <div 
      ref={containerRef}
      className={`relative ${className}`}
      style={{ isolation: 'isolate' }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={(e) => {
        // Only show controls if we're not already editing and the click isn't on a button
        if (!isEditing && !showControls && (e.target as HTMLElement).tagName !== 'BUTTON') {
          setShowControls(true);
        }
      }}
    >
      {/* Hidden file input */}
      <input 
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileInputChange}
      />

      {/* Image display */}
      {value ? (
        <img src={value} alt={alt} className="w-full h-full object-cover rounded-inherit" referrerPolicy="no-referrer" />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-white/5 border-2 border-dashed border-white/20 rounded-inherit min-h-[200px] cursor-pointer">
          <div className="text-center text-slate-500 p-4">
            <ImageIcon size={32} className="mx-auto mb-2 opacity-60" />
            <p className="text-sm">Chưa có ảnh</p>
            <p className="text-xs mt-1">Click để thêm ảnh</p>
          </div>
        </div>
      )}

      {/* Drag overlay */}
      {isDragOver && (
        <div className="absolute inset-0 bg-primary/30 backdrop-blur-sm border-2 border-dashed border-primary rounded-inherit flex items-center justify-center transition-all" style={{ zIndex: 50 }}>
          <div className="text-center">
            <Upload size={40} className="mx-auto mb-2 text-primary animate-bounce" />
            <p className="text-white font-bold text-sm">Thả ảnh vào đây</p>
          </div>
        </div>
      )}
      
      {/* Edit overlay — shown on click (not hover, to avoid z-index issues with parent overflow-hidden) */}
      {(showControls || isEditing) && (
        <div 
          className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-inherit" 
          style={{ zIndex: 40 }}
          onClick={(e) => e.stopPropagation()}
        >
          {!isEditing ? (
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Upload from file */}
              <button 
                onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                className="bg-primary text-background-dark px-4 py-2 rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-transform text-sm cursor-pointer"
              >
                <Upload size={16} /> Tải ảnh lên
              </button>
              {/* Edit URL */}
              <button 
                onClick={(e) => { e.stopPropagation(); setIsEditing(true); setEditMode('url'); }}
                className="bg-white/20 text-white px-4 py-2 rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-transform backdrop-blur-sm text-sm cursor-pointer"
              >
                <LinkIcon size={16} /> Nhập URL
              </button>
              {/* Close */}
              <button 
                onClick={(e) => { e.stopPropagation(); setShowControls(false); }}
                className="bg-red-500/20 text-red-300 px-3 py-2 rounded-full font-bold flex items-center gap-1 hover:scale-105 transition-transform text-sm cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <div className="bg-background-dark/95 p-4 rounded-xl w-11/12 max-w-sm flex flex-col gap-3 shadow-2xl border border-primary/30">
              {editMode === 'url' ? (
                <>
                  <label className="text-xs text-primary font-bold uppercase tracking-widest">Image URL</label>
                  <input 
                    type="text" 
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full bg-slate-800 text-white border border-slate-600 rounded p-2 text-sm outline-none focus:border-primary"
                    placeholder="https://..."
                    autoFocus
                  />
                  <div className="flex justify-between items-center mt-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setEditMode('upload'); }}
                      className="text-xs text-primary hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Upload size={12} /> Tải ảnh lên thay
                    </button>
                    <div className="flex gap-2">
                      <button onClick={(e) => { e.stopPropagation(); handleCancel(); }} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer">
                        <X size={16} />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); handleSave(); }} className="p-2 text-primary hover:bg-primary/20 rounded-lg transition-colors cursor-pointer">
                        <Check size={16} />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <Upload size={32} className="mx-auto mb-3 text-primary" />
                  <p className="text-white text-sm font-bold mb-3">Kéo thả ảnh vào đây</p>
                  <p className="text-slate-400 text-xs mb-4">hoặc</p>
                  <button 
                    onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                    className="bg-primary text-background-dark px-6 py-2 rounded-full font-bold text-sm hover:scale-105 transition-transform cursor-pointer"
                  >
                    Chọn từ máy tính
                  </button>
                  <div className="mt-4 flex justify-between items-center">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setEditMode('url'); }}
                      className="text-xs text-primary hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <LinkIcon size={12} /> Nhập URL thay
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); handleCancel(); }} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer">
                      <X size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
