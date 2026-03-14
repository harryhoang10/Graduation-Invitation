import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';

export const Countdown: React.FC = () => {
  const { data } = useData();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Set target date to a fixed date in the future for the event
    const targetDate = new Date(data.event.isoDate || '2026-03-21T16:00:00').getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [data.event.isoDate]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex flex-col items-center mt-16 mb-8 relative"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-32 bg-primary/10 blur-[100px] rounded-full pointer-events-none"></div>
      
      <h3 className="text-xl sm:text-2xl font-serif text-champagne mb-10 italic tracking-wide text-center drop-shadow-[0_0_10px_rgba(249,215,126,0.3)]">
        ✨ Thời khắc nhiệm màu sẽ bắt đầu sau ✨
      </h3>
      
      <div className="flex justify-center gap-4 sm:gap-8 md:gap-12 relative z-10">
        {[
          { label: 'Ngày', value: timeLeft.days },
          { label: 'Giờ', value: timeLeft.hours },
          { label: 'Phút', value: timeLeft.minutes },
          { label: 'Giây', value: timeLeft.seconds }
        ].map((item, idx) => (
          <div key={idx} className="flex flex-col items-center group">
            <div className="relative w-20 h-24 sm:w-24 sm:h-28 md:w-28 md:h-32 bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-xl border border-primary/30 rounded-2xl flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-500 group-hover:border-primary/60 group-hover:shadow-[0_0_30px_rgba(249,215,126,0.2)] group-hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-0 w-full h-1/2 bg-white/5 border-b border-white/5"></div>
              <span className="text-4xl sm:text-5xl md:text-6xl font-display text-transparent bg-clip-text bg-gradient-to-b from-white via-champagne to-primary/80 drop-shadow-[0_2px_10px_rgba(249,215,126,0.5)] relative z-10">
                {item.value.toString().padStart(2, '0')}
              </span>
            </div>
            <span className="text-xs sm:text-sm uppercase tracking-[0.3em] text-primary/80 mt-6 font-medium group-hover:text-primary transition-colors duration-300">{item.label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
