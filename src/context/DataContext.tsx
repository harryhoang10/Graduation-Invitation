import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { defaultData } from '../data';
type DataContextType = {
  data: typeof defaultData;
  updateData: (path: string, value: any) => void;
  isAdmin: boolean;
  requiresPassword: boolean;
  authenticateAdmin: (password: string) => boolean;
  saveToServer: () => Promise<boolean>;
  hasUnsavedChanges: boolean;
  markChangesSaved: () => void;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

const STORAGE_KEY = 'graduation_data';

/**
 * Deep-set a value at a dot-separated path inside an object.
 * Uses structuredClone for a true deep copy so React detects changes correctly.
 */
function deepSet(obj: any, path: string, value: any): any {
  const clone = structuredClone(obj);
  const keys = path.split('.');
  let current = clone;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    
    // Auto-vivify missing objects/arrays dynamically
    if (current[key] === undefined || current[key] === null) {
      const nextKey = keys[i + 1];
      current[key] = isNaN(Number(nextKey)) ? {} : [];
    }
    
    current = current[key];
  }
  const lastKey = keys[keys.length - 1];
  current[lastKey] = value;
  return clone;
}

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<typeof defaultData>(defaultData);
  const [isAdmin, setIsAdmin] = useState(false);
  const [requiresPassword, setRequiresPassword] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    // Admin mode detection
    if (params.get('admin') === 'true') {
      setRequiresPassword(true);
    }

    // Since we're writing directly to data.ts, defaultData IS the source of truth
    // Let's ensure it has all the keys, we don't need URL parsing anymore.
    // However, we preserve localStorage fallback if the user is mid-editing properties but hasn't saved.

    // Fallback to localStorage (admin's saved edits)
    const localData = localStorage.getItem(STORAGE_KEY);
    if (localData) {
      try {
        const parsed = JSON.parse(localData);
        setData({ ...defaultData, ...parsed });
      } catch (e) {
        console.error("Failed to parse data from localStorage", e);
      }
    }
  }, []);

  const authenticateAdmin = useCallback((password: string) => {
    if (password === '060304') {
      setIsAdmin(true);
      setRequiresPassword(false);
      return true;
    }
    return false;
  }, []);

  const updateData = useCallback((path: string, value: any) => {
    setData((prev) => {
      const newData = deepSet(prev, path, value);

      // Auto-persist to localStorage so admin edits are never lost
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      } catch (e: any) {
        console.error("Failed to save to localStorage", e);
        if (e.name === 'QuotaExceededError' || e.message?.includes('quote') || e.message?.includes('size')) {
          alert('Lỗi: Tổng dung lượng ảnh tải lên đã vượt quá giới hạn bộ nhớ tạm của trình duyệt (thường >5MB). Tuy ảnh vẫn hiển thị nhưng sẽ mất khi F5. Bạn nên lưu code ngay hoặc dùng tính năng "Nhập URL" để thay thế.');
        }
      }
      
      return newData;
    });
    setHasUnsavedChanges(true);
  }, []);

  const saveToServer = useCallback(async () => {
    try {
      const response = await fetch('/api/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        setHasUnsavedChanges(false);
        // Clear local storage on successful save because data.ts is now up-to-date
        localStorage.removeItem(STORAGE_KEY);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to save data:', error);
      return false;
    }
  }, [data]);

  const markChangesSaved = useCallback(() => {
    setHasUnsavedChanges(false);
  }, []);

  return (
    <DataContext.Provider value={{ 
      data, 
      updateData, 
      isAdmin, 
      requiresPassword, 
      authenticateAdmin, 
      saveToServer,
      hasUnsavedChanges,
      markChangesSaved
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
};
