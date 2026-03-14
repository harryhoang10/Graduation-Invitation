import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EditableText } from './EditableText';
import { useData } from '../context/DataContext';

const RSVP_STORAGE_KEY = 'graduation_rsvp_list';

export default function RSVP({ guestName, pronoun }: any) {
  const { data } = useData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [message, setMessage] = useState('');

  /**
   * Save RSVP to localStorage as a fallback (or primary if no webhook).
   * Admin can later export this data.
   */
  const saveToLocalStorage = (payload: any) => {
    try {
      const existing = JSON.parse(localStorage.getItem(RSVP_STORAGE_KEY) || '[]');
      existing.push(payload);
      localStorage.setItem(RSVP_STORAGE_KEY, JSON.stringify(existing));
    } catch {
      // Ignore localStorage errors
    }
  };

  const handleRSVP = async () => {
    setIsSubmitting(true);
    setSubmitError('');
    
    const nameOnly = guestName.replace(new RegExp(`^${pronoun}\\s+`, 'i'), '');

    const payload = {
      timestamp: new Date().toISOString(),
      pronoun: pronoun,
      name: nameOnly,
      fullName: guestName,
      status: 'Attending',
      message: message
    };

    const webhookUrl = data.rsvp?.webhookUrl;
    let webhookSuccess = false;

    if (webhookUrl && webhookUrl.trim()) {
      try {
        // Google Apps Script redirects on POST (302), which causes CORS errors
        // with normal fetch. Using mode: 'no-cors' sends the request successfully
        // but returns an opaque response (status 0). The data still reaches
        // Google Sheets — we just can't read the response.
        await fetch(webhookUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'text/plain;charset=UTF-8',
          },
          body: JSON.stringify(payload),
        });
        // With no-cors, if we get here without throwing, the request was sent
        webhookSuccess = true;
        console.log('RSVP sent to Google Sheets webhook successfully');
      } catch (error) {
        console.error('Error submitting RSVP via webhook:', error);
        webhookSuccess = false;
      }
    }

    // Always save a local copy as backup
    saveToLocalStorage(payload);

    if (!webhookSuccess && webhookUrl && webhookUrl.trim()) {
      // Webhook failed but we have a URL configured — warn but don't block
      setSubmitError('Lời chúc đã được ghi nhận! (Đang chờ đồng bộ lên Google Sheets)');
    }

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <section id="rsvp" className="relative py-20 sm:py-32 text-center bg-background-dark overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 min-h-[400px] flex flex-col justify-center"
      >
        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.5 }}
              className="bg-white/5 backdrop-blur-xl border border-primary/20 rounded-3xl p-8 sm:p-12 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative"
            >
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-background-dark border border-primary/30 rounded-full flex items-center justify-center text-primary text-xl shadow-[0_0_15px_rgba(249,215,126,0.3)]">
                ✨
              </div>
              
              <EditableText as="h2" path="rsvp.title" className="font-serif text-3xl sm:text-4xl md:text-5xl text-champagne mb-4 block drop-shadow-[0_0_10px_rgba(249,215,126,0.2)]" />
              <EditableText as="p" path="rsvp.subtitle" guestName={guestName} multiline className="text-slate-300 mb-10 text-base sm:text-lg block font-light" />
              
              <div className="max-w-2xl mx-auto mb-10 text-left">
                <EditableText as="label" path="rsvp.messageLabel" className="block text-primary/80 text-sm font-medium mb-3 ml-2 uppercase tracking-widest" />
                <textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={data.rsvp?.messagePlaceholder || 'Viết lời chúc của bạn ở đây...'}
                  className="w-full bg-black/20 border border-primary/20 rounded-2xl p-5 text-white placeholder:text-slate-500 focus:border-primary/60 focus:ring-1 focus:ring-primary/60 transition-all resize-none h-32 font-light"
                ></textarea>
              </div>

              {submitError && (
                <div className="mb-6 text-amber-400 text-sm font-medium bg-amber-400/10 border border-amber-400/20 rounded-xl px-4 py-3">
                  {submitError}
                </div>
              )}

              <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 sm:gap-6">
                <button 
                  onClick={handleRSVP}
                  disabled={isSubmitting}
                  className="relative group overflow-hidden flex w-full sm:w-auto min-w-[220px] items-center justify-center rounded-full h-14 px-8 bg-gradient-to-r from-primary to-celestial-gold text-background-dark font-bold text-base sm:text-lg hover:shadow-[0_0_30px_rgba(249,215,126,0.5)] transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                  <span className="relative z-10 flex items-center gap-2">
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-background-dark border-t-transparent rounded-full animate-spin"></div>
                        Đang gửi...
                      </>
                    ) : (
                      <>
                        <EditableText path="rsvp.btn1" />
                        <span className="text-xl">🕊️</span>
                      </>
                    )}
                  </span>
                </button>
                <button className="flex w-full sm:w-auto min-w-[220px] items-center justify-center rounded-full h-14 px-8 border border-white/20 text-white font-medium text-base sm:text-lg hover:bg-white/10 hover:border-white/40 transition-all cursor-pointer">
                  <EditableText path="rsvp.btn2" />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="thank-you"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white/5 border border-primary/30 backdrop-blur-xl rounded-3xl p-8 sm:p-14 max-w-2xl mx-auto shadow-[0_0_50px_rgba(249,215,126,0.15)] relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-70"></div>
              
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: 360 }}
                transition={{ type: "spring", duration: 1.5, delay: 0.2 }}
                className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-8 border border-primary/40 shadow-[0_0_30px_rgba(249,215,126,0.3)]"
              >
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </motion.div>
              
              <EditableText as="h3" path="rsvp.thankYouTitle" guestName={guestName} pronoun={pronoun} className="font-serif text-3xl sm:text-4xl md:text-5xl text-champagne mb-6 block drop-shadow-[0_0_15px_rgba(249,215,126,0.4)]" />
              <EditableText as="p" path="rsvp.thankYouDesc" guestName={guestName} pronoun={pronoun} multiline className="text-slate-300 text-base sm:text-lg leading-relaxed block mb-10 font-light" />
              
              <button 
                onClick={() => setIsSubmitted(false)}
                className="inline-flex items-center justify-center rounded-full h-12 px-8 border border-primary/30 text-primary font-medium text-sm hover:bg-primary/10 hover:shadow-[0_0_15px_rgba(249,215,126,0.2)] transition-all cursor-pointer uppercase tracking-widest"
              >
                Quay lại
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      
      <footer className="mt-20 sm:mt-32 py-8 sm:py-12 border-t border-white/5 text-center text-slate-500 text-xs sm:text-sm px-4 relative z-10">
        <div className="flex justify-center gap-4 sm:gap-6 mb-6 text-primary/40 text-base sm:text-lg">
          <span className="animate-pulse">✨</span>
          <span className="animate-pulse" style={{ animationDelay: '0.5s' }}>🌟</span>
          <span className="animate-pulse" style={{ animationDelay: '1s' }}>✨</span>
        </div>
        <EditableText as="p" path="rsvp.footer" className="block font-light tracking-wide" />
      </footer>
    </section>
  );
}
