import React, { useState, useEffect, useRef } from 'react';
import { useData } from '../context/DataContext';
import { Pencil } from 'lucide-react';

interface EditableTextProps {
  path: string;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
  multiline?: boolean;
  guestName?: string;
  pronoun?: string;
  highlightVariables?: boolean;
}

export const EditableText: React.FC<EditableTextProps> = ({
  path,
  className = '',
  as: Component = 'span',
  multiline = false,
  guestName,
  pronoun,
  highlightVariables = false
}) => {
  const { data, updateData, isAdmin } = useData();
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    const keys = path.split('.');
    let current: any = data;
    for (const key of keys) {
      if (current === undefined) break;
      current = current[key];
    }
    setValue(current || '');
  }, [data, path]);

  const handleSave = () => {
    setIsEditing(false);
    updateData(path, value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      handleSave();
    }
    if (e.key === 'Escape') {
      setIsEditing(false);
      const keys = path.split('.');
      let current: any = data;
      for (const key of keys) {
        current = current[key];
      }
      setValue(current || '');
    }
  };

  const renderValue = () => {
    if (!value) return '';

    if (!highlightVariables) {
      return value
        .replace(/{name}/g, guestName || pronoun || 'bạn')
        .replace(/{pronoun}/g, pronoun?.toLowerCase() || 'bạn');
    }

    const parts = value.split(/({name}|{pronoun})/g);
    return parts.map((part, i) => {
      if (part === '{name}') {
        return <span key={i} className="font-serif italic text-primary text-[1.1em] px-1">{guestName || pronoun || 'bạn'}</span>;
      }
      if (part === '{pronoun}') {
        return <span key={i} className="font-serif italic text-primary text-[1.1em] px-1">{pronoun?.toLowerCase() || 'bạn'}</span>;
      }
      return part;
    });
  };

  if (!isAdmin) {
    return <Component className={className}>{renderValue()}</Component>;
  }

  if (isEditing) {
    return (
      <div className="relative inline-block w-full z-50">
        {multiline ? (
          <textarea
            ref={inputRef as any}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className={`w-full bg-slate-800 text-white border border-primary/50 rounded p-2 outline-none focus:ring-2 focus:ring-primary/50 ${className}`}
            rows={4}
            autoFocus
          />
        ) : (
          <input
            ref={inputRef as any}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className={`w-full bg-slate-800 text-white border border-primary/50 rounded px-2 py-1 outline-none focus:ring-2 focus:ring-primary/50 ${className}`}
            autoFocus
          />
        )}
      </div>
    );
  }

  return (
    <Component
      className={`relative group cursor-pointer hover:outline hover:outline-2 hover:outline-primary/50 hover:outline-offset-4 rounded transition-all ${className}`}
      onClick={() => setIsEditing(true)}
    >
      {renderValue()}
      <span className="absolute -top-3 -right-3 bg-primary text-background-dark p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-lg flex items-center justify-center">
        <Pencil size={12} />
      </span>
    </Component>
  );
};
