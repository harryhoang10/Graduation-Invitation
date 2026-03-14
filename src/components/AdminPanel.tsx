import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { Settings, Save, Share2, Check, Copy, Database, X, AlertTriangle, Download, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const RSVP_STORAGE_KEY = 'graduation_rsvp_list';

export const AdminPanel: React.FC = () => {
  const { isAdmin, saveToServer, data, updateData, hasUnsavedChanges } = useData();
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showWebhookModal, setShowWebhookModal] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [showRSVPList, setShowRSVPList] = useState(false);

  // Sync webhook URL state with data context
  useEffect(() => {
    setWebhookUrl(data.rsvp?.webhookUrl || '');
  }, [data.rsvp?.webhookUrl]);

  if (!isAdmin) return null;

  const handleSaveData = async () => {
    setIsSaving(true);
    const success = await saveToServer();
    setIsSaving(false);
    if (success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } else {
      alert("Lỗi khi lưu dữ liệu. Vui lòng kiểm tra console.");
    }
  };

  const handleSaveWebhook = () => {
    updateData('rsvp.webhookUrl', webhookUrl.trim());
    setShowWebhookModal(false);
  };

  const getRSVPList = (): any[] => {
    try {
      return JSON.parse(localStorage.getItem(RSVP_STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  };

  const exportRSVPData = () => {
    const list = getRSVPList();
    if (list.length === 0) return;
    
    const headers = ['Thời gian', 'Xưng hô', 'Tên', 'Tên đầy đủ', 'Trạng thái', 'Lời chúc'];
    const rows = list.map((r: any) => [
      r.timestamp, r.pronoun, r.name, r.fullName, r.status, r.message || ''
    ]);
    const csv = [headers, ...rows].map(row => row.map((cell: string) => `"${cell}"`).join(',')).join('\n');
    
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rsvp_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* Admin Toolbar — positioned with pb offset for audio button */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] bg-background-dark/90 backdrop-blur-xl border border-primary/30 p-3 sm:p-4 rounded-2xl shadow-[0_0_40px_rgba(212,175,55,0.2)] flex items-center gap-3 sm:gap-4 max-w-[95vw]">
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 p-2 rounded-full text-primary animate-pulse hidden sm:block">
            <Settings size={18} />
          </div>
          <div>
            <h3 className="text-white font-bold text-xs sm:text-sm">Chế độ chỉnh sửa</h3>
            <p className="text-slate-400 text-[10px] hidden sm:block">Click vào chữ hoặc ảnh để sửa</p>
          </div>
        </div>
        
        <div className="h-8 w-px bg-white/10"></div>

        {/* RSVP Data Button */}
        <button 
          onClick={() => setShowRSVPList(true)}
          className="relative flex items-center gap-2 bg-white/10 text-white px-3 py-2 rounded-xl font-bold text-xs hover:bg-white/20 transition-colors"
          title="Xem danh sách RSVP"
        >
          <Download size={14} />
          <span className="hidden sm:inline">RSVP</span>
          {getRSVPList().length > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-primary text-background-dark rounded-full text-[10px] font-bold flex items-center justify-center">
              {getRSVPList().length}
            </span>
          )}
        </button>
        
        {/* Webhook Config Button */}
        <button 
          onClick={() => setShowWebhookModal(true)}
          className="flex items-center gap-2 bg-white/10 text-white px-3 py-2 rounded-xl font-bold text-xs hover:bg-white/20 transition-colors"
          title="Cấu hình Google Sheet Webhook"
        >
          <Database size={14} />
          <span className="hidden sm:inline">Webhook</span>
        </button>

        {/* Save Button — with unsaved indicator */}
        <button 
          onClick={handleSaveData}
          disabled={isSaving}
          className={`relative flex items-center gap-2 px-4 sm:px-5 py-2 rounded-xl font-bold text-xs transition-all ${
            saveSuccess 
              ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
              : 'bg-primary text-background-dark hover:scale-105 hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]'
          }`}
        >
          {hasUnsavedChanges && !saveSuccess && !isSaving && (
            <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-red-500 rounded-full animate-pulse border-2 border-background-dark"></span>
          )}
          {isSaving ? (
            <Loader2 size={14} className="animate-spin" />
          ) : saveSuccess ? (
            <Check size={14} />
          ) : (
            <Save size={14} />
          )}
          {isSaving ? 'Đang lưu...' : saveSuccess ? 'Đã lưu!' : <span className="hidden sm:inline">Lưu trang (Save)</span>}
        </button>
      </div>

      {/* Webhook Config Modal */}
      <AnimatePresence>
        {showWebhookModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background-dark/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-background-dark border border-primary/30 rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-[0_0_50px_rgba(212,175,55,0.15)] relative"
            >
              <button 
                onClick={() => setShowWebhookModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
              
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-primary/10 rounded-xl text-primary">
                  <Database size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-serif text-white">Google Sheet Webhook</h2>
                  <p className="text-slate-400 text-sm">Lưu thông tin khách mời xác nhận tham dự</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    URL Webhook (Google Apps Script)
                  </label>
                  <input 
                    type="text" 
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="https://script.google.com/macros/s/.../exec"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                  />
                  <div className="mt-3 p-3 bg-white/5 border border-white/10 rounded-xl">
                    <p className="text-xs text-slate-400 leading-relaxed">
                      <strong className="text-primary">Hướng dẫn:</strong> Tạo Google Sheet → Extensions → Apps Script → dán code sau:
                    </p>
                    <pre className="mt-2 text-[10px] text-slate-500 bg-black/30 p-2 rounded-lg overflow-x-auto">
{`function doPost(e) {
  var sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  sheet.appendRow([
    data.timestamp,
    data.pronoun,
    data.name,
    data.fullName,
    data.status,
    data.message
  ]);
  return ContentService
    .createTextOutput("OK")
    .setMimeType(ContentService.MimeType.TEXT);
}`}
                    </pre>
                    <p className="text-[10px] text-slate-500 mt-2">
                      Deploy → New deployment → Web app → Execute as: Me → Who has access: Anyone
                    </p>
                  </div>
                </div>
                
                <button 
                  onClick={handleSaveWebhook}
                  className="w-full bg-primary text-background-dark font-bold py-3 rounded-xl hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all cursor-pointer"
                >
                  Lưu Cấu Hình
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* RSVP List Modal */}
      <AnimatePresence>
        {showRSVPList && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background-dark/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-background-dark border border-primary/30 rounded-2xl p-6 sm:p-8 max-w-2xl w-full max-h-[80vh] shadow-[0_0_50px_rgba(212,175,55,0.15)] relative flex flex-col"
            >
              <button 
                onClick={() => setShowRSVPList(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
              
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary/10 rounded-xl text-primary">
                    <Download size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-serif text-white">Danh sách RSVP</h2>
                    <p className="text-slate-400 text-sm">{getRSVPList().length} khách đã xác nhận</p>
                  </div>
                </div>
                {getRSVPList().length > 0 && (
                  <button 
                    onClick={exportRSVPData}
                    className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-xl text-sm font-bold hover:bg-primary/20 transition-colors cursor-pointer"
                  >
                    <Download size={14} />
                    Export CSV
                  </button>
                )}
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {getRSVPList().length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    <p className="text-lg mb-2">Chưa có ai xác nhận tham dự</p>
                    <p className="text-sm">Dữ liệu RSVP sẽ hiển thị tại đây</p>
                  </div>
                ) : (
                  getRSVPList().map((rsvp: any, i: number) => (
                    <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                        {(rsvp.name || '?')[0].toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-white text-sm">{rsvp.fullName}</span>
                          <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full font-medium">
                            {rsvp.status}
                          </span>
                        </div>
                        {rsvp.message && (
                          <p className="text-slate-400 text-sm italic">"{rsvp.message}"</p>
                        )}
                        <p className="text-slate-600 text-[10px] mt-1">
                          {new Date(rsvp.timestamp).toLocaleString('vi-VN')}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
