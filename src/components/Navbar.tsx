import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-background-dark/80 backdrop-blur-lg border-b border-white/10 py-4 shadow-lg' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="text-primary font-display font-bold text-xl tracking-widest cursor-pointer" onClick={() => scrollTo('hero')}>
          TẤN - 0345 543 548
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          <button onClick={() => scrollTo('journey')} className="text-sm font-medium text-slate-300 hover:text-primary transition-colors uppercase tracking-widest cursor-pointer">Hành Trình</button>
          <button onClick={() => scrollTo('timeline')} className="text-sm font-medium text-slate-300 hover:text-primary transition-colors uppercase tracking-widest cursor-pointer">Dấu Ấn</button>
          <button onClick={() => scrollTo('event-details')} className="text-sm font-medium text-slate-300 hover:text-primary transition-colors uppercase tracking-widest cursor-pointer">Sự Kiện</button>
          <button onClick={() => scrollTo('rsvp')} className="px-6 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-bold hover:bg-primary hover:text-background-dark transition-all uppercase tracking-widest cursor-pointer">
            Tham Dự
          </button>
        </div>
      </div>
    </motion.nav>
  );
};
