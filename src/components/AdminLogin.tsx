import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Lock } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { requiresPassword, authenticateAdmin } = useData();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  if (!requiresPassword) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authenticateAdmin(password)) {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-background-dark/95 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="bg-white/5 border border-white/10 p-8 rounded-2xl max-w-md w-full text-center shadow-2xl">
        <div className="mx-auto w-16 h-16 bg-primary/20 text-primary rounded-full flex items-center justify-center mb-6">
          <Lock size={32} />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Xác thực Admin</h2>
        <p className="text-slate-400 mb-8">Vui lòng nhập mật khẩu để truy cập chế độ chỉnh sửa.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false); }}
              placeholder="Nhập mật khẩu..."
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-center focus:border-primary focus:outline-none transition-colors"
              autoFocus
            />
            {error && <p className="text-red-400 text-sm mt-2">Mật khẩu không chính xác!</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-background-dark font-bold py-3 rounded-xl hover:scale-[1.02] transition-transform cursor-pointer"
          >
            Xác nhận
          </button>
        </form>
      </div>
    </div>
  );
};
