import { motion } from 'framer-motion';
import { EditableText } from './EditableText';

export default function Hero({ guestName, pronoun }: { guestName: string, pronoun: string }) {
  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none"></div>
      
      <main className="relative z-10 w-full max-w-7xl px-4 sm:px-6 py-12 flex flex-col items-center justify-center text-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-[500px] md:h-[500px] mb-8 flex items-center justify-center"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-primary/20 rounded-full w-full h-full animate-[spin_30s_linear_infinite]">
            <div className="absolute -top-2 left-1/2 w-4 h-4 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.9)]"></div>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-primary/30 rounded-full w-3/4 h-3/4 animate-[spin_20s_linear_infinite_reverse]">
            <div className="absolute top-1/2 -right-1 w-3 h-3 bg-primary rounded-full shadow-[0_0_15px_rgba(249,215,126,0.8)]"></div>
          </div>
          
          <div className="relative z-20 animate-[bounce_6s_ease-in-out_infinite]">
            <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-64 md:h-64 rounded-full bg-gradient-to-tr from-primary/20 via-champagne/40 to-white/20 backdrop-blur-sm shadow-[0_0_80px_rgba(249,215,126,0.4)] flex items-center justify-center border border-white/40">
              <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-52 md:h-52 rounded-full border border-dashed border-primary/40 animate-[spin_40s_linear_infinite]"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white text-6xl sm:text-7xl md:text-9xl italic font-serif drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]">T</span>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/10 to-transparent blur-3xl opacity-60"></div>
        </motion.div>

        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="max-w-3xl"
        >
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display text-white leading-tight mb-6 drop-shadow-lg">
            <EditableText path="hero.title1" />
            <br/>
            <EditableText path="hero.title2" className="text-transparent bg-clip-text bg-gradient-to-r from-champagne via-primary to-white italic font-serif" />
          </h1>
          <EditableText 
            path="hero.subtitle" 
            as="p"
            multiline
            guestName={guestName}
            pronoun={pronoun}
            className="text-lg sm:text-xl md:text-2xl text-slate-300 font-light tracking-wide mb-12 leading-relaxed block max-w-2xl mx-auto"
          />
          <div className="flex flex-col items-center gap-6">
            <button onClick={() => document.getElementById('personalization')?.scrollIntoView({ behavior: 'smooth' })} className="relative group overflow-hidden bg-white/5 backdrop-blur-xl border border-primary/30 px-10 sm:px-12 py-4 sm:py-5 rounded-full text-white font-semibold tracking-[0.2em] uppercase text-xs sm:text-sm hover:shadow-[0_0_30px_rgba(249,215,126,0.3)] hover:-translate-y-1 transition-all cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              <span className="relative z-10 flex items-center gap-2">
                Mở lời mời <span className="text-primary text-lg">✨</span>
              </span>
            </button>
            <span className="text-[10px] uppercase tracking-[0.4em] text-primary/60 mt-4 font-medium">Scroll to explore the universe</span>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
