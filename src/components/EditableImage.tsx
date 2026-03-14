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
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
    updateData(path, value);
  };

  const handleCancel = () => {
    setIsEditing(false);
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

  // Non-admin: simple image display
  if (!isAdmin) {
    return <img src={value || undefined} alt={alt} className={className} referrerPolicy="no-referrer" />;
  }

  // Admin mode: drag-and-drop zone + edit controls
  return (
    <div 
      className={`relative group ${className}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
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
        <div className="w-full h-full flex items-center justify-center bg-white/5 border-2 border-dashed border-white/20 rounded-inherit min-h-[200px]">
          <div className="text-center text-slate-500 p-4">
            <ImageIcon size={32} className="mx-auto mb-2 opacity-60" />
            <p className="text-sm">Chưa có ảnh</p>
            <p className="text-xs mt-1">Kéo thả hoặc click để thêm</p>
          </div>
        </div>
      )}

      {/* Drag overlay */}
      {isDragOver && (
        <div className="absolute inset-0 bg-primary/30 backdrop-blur-sm border-2 border-dashed border-primary rounded-inherit z-30 flex items-center justify-center transition-all">
          <div className="text-center">
            <Upload size={40} className="mx-auto mb-2 text-primary animate-bounce" />
            <p className="text-white font-bold text-sm">Thả ảnh vào đây</p>
          </div>
        </div>
      )}
      
      {/* Hover edit overlay */}
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-inherit z-20">
        {!isEditing ? (
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Upload from file */}
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="bg-primary text-background-dark px-4 py-2 rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-transform text-sm"
            >
              <Upload size={16} /> Tải ảnh lên
            </button>
            {/* Edit URL */}
            <button 
              onClick={() => { setIsEditing(true); setEditMode('url'); }}
              className="bg-white/20 text-white px-4 py-2 rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-transform backdrop-blur-sm text-sm"
            >
              <LinkIcon size={16} /> Nhập URL
            </button>
          </div>
        ) : (
          <div className="bg-background-dark/90 p-4 rounded-xl w-11/12 max-w-sm flex flex-col gap-3 shadow-2xl border border-primary/30">
            {editMode === 'url' ? (
              <>
                <label className="text-xs text-primary font-bold uppercase tracking-widest">Image URL</label>
                <input 
                  type="text" 
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="w-full bg-slate-800 text-white border border-slate-600 rounded p-2 text-sm outline-none focus:border-primary"
                  placeholder="https://..."
                  autoFocus
                />
                <div className="flex justify-between items-center mt-2">
                  <button 
                    onClick={() => { setEditMode('upload'); }}
                    className="text-xs text-primary hover:underline flex items-center gap-1"
                  >
                    <Upload size={12} /> Tải ảnh lên thay
                  </button>
                  <div className="flex gap-2">
                    <button onClick={handleCancel} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                      <X size={16} />
                    </button>
                    <button onClick={handleSave} className="p-2 text-primary hover:bg-primary/20 rounded-lg transition-colors">
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
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-primary text-background-dark px-6 py-2 rounded-full font-bold text-sm hover:scale-105 transition-transform"
                >
                  Chọn từ máy tính
                </button>
                <div className="mt-4 flex justify-between items-center">
                  <button 
                    onClick={() => { setEditMode('url'); }}
                    className="text-xs text-primary hover:underline flex items-center gap-1"
                  >
                    <LinkIcon size={12} /> Nhập URL thay
                  </button>
                  <button onClick={handleCancel} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                    <X size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
