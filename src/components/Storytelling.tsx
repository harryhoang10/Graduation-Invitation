import { motion } from 'framer-motion';
import { EditableText } from './EditableText';
import { EditableImage } from './EditableImage';
import { useData } from '../context/DataContext';

export default function Storytelling({ guestName, pronoun }: any) {
  const { data } = useData();
  const chapters = data.storytelling.chapters;

  return (
    <section className="relative py-20 px-4 md:px-0 max-w-5xl mx-auto" id="journey">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-primary/5 blur-[150px] rounded-full pointer-events-none -z-10"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-24"
      >
        <div className="flex justify-center items-center gap-4 mb-6">
          <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-primary/50"></div>
          <EditableText path="storytelling.badge" className="inline-block px-6 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-bold tracking-[0.3em] uppercase shadow-[0_0_15px_rgba(249,215,126,0.1)]" />
          <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-primary/50"></div>
        </div>
        
        <h2 className="font-serif italic text-4xl sm:text-5xl md:text-7xl text-white leading-tight mb-8 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
          <EditableText path="storytelling.title1" guestName={guestName} pronoun={pronoun} />
          <br/>
          <EditableText path="storytelling.title2" className="text-transparent bg-clip-text bg-gradient-to-r from-champagne via-primary to-white" />
        </h2>
        <EditableText path="storytelling.subtitle" as="p" multiline className="text-slate-300 text-base sm:text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed block" />
      </motion.div>

      {chapters.map((chap: any, idx: number) => {
        const align = idx % 2 === 1 ? 'right' : 'left';
        return (
          <motion.div 
            key={idx} 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className={`relative mb-24 sm:mb-40 flex flex-col ${align === 'right' ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-10 sm:gap-16 group`}
          >
            <div className="w-full md:w-1/2 aspect-[4/5] rounded-3xl overflow-hidden bg-white/5 backdrop-blur-xl p-3 border border-primary/20 shadow-[0_0_40px_rgba(0,0,0,0.4)] relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <EditableImage path={`storytelling.chapters.${idx}.img`} className="w-full h-full rounded-2xl object-cover transition-transform duration-[2000ms] group-hover:scale-105" />
              <div className="absolute inset-0 rounded-3xl border border-white/10 pointer-events-none"></div>
            </div>
            <div className={`w-full md:w-1/2 space-y-6 sm:space-y-8 ${align === 'right' ? 'md:text-right text-left' : 'text-left'}`}>
              <div className={`flex items-center gap-4 ${align === 'right' ? 'md:justify-end' : ''}`}>
                {align === 'left' && <span className="text-primary text-2xl">✨</span>}
                <span className="font-serif italic text-primary/80 text-xl sm:text-2xl tracking-widest">Chương {idx + 1}</span>
                {align === 'right' && <span className="text-primary text-2xl hidden md:block">✨</span>}
              </div>
              <EditableText as="h3" path={`storytelling.chapters.${idx}.title`} className="text-4xl sm:text-5xl md:text-6xl font-display text-champagne block drop-shadow-[0_0_10px_rgba(249,215,126,0.2)]" />
              <EditableText as="p" path={`storytelling.chapters.${idx}.quote`} multiline className="text-slate-300 text-lg sm:text-xl leading-relaxed italic block font-serif" />
              <div className={`h-[1px] w-24 bg-gradient-to-r from-primary/50 to-transparent ${align === 'right' ? 'md:ml-auto md:bg-gradient-to-l' : ''}`}></div>
              <EditableText as="p" path={`storytelling.chapters.${idx}.desc`} multiline pronoun={pronoun} className="text-slate-400 font-light text-sm sm:text-base block leading-loose" />
            </div>
          </motion.div>
        );
      })}

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative mb-20 flex flex-col items-center text-center space-y-10 sm:space-y-14"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent -z-10 pointer-events-none"></div>
        
        <div className="w-full max-w-3xl aspect-video rounded-3xl overflow-hidden bg-white/5 backdrop-blur-xl p-3 sm:p-4 border border-primary/30 shadow-[0_0_50px_rgba(249,215,126,0.15)] relative group">
          <div className="absolute inset-0 bg-gradient-to-t from-background-dark/80 via-transparent to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity duration-700"></div>
          <EditableImage path="storytelling.finalChapter.img" className="w-full h-full rounded-2xl object-cover transition-transform duration-[3000ms] group-hover:scale-105" />
          <div className="absolute inset-0 rounded-3xl border border-white/20 pointer-events-none z-20"></div>
        </div>
        
        <div className="space-y-6 sm:space-y-8 px-4 relative z-20">
          <div className="flex justify-center items-center gap-3">
            <span className="text-primary text-xl animate-pulse">✦</span>
            <EditableText path="storytelling.finalChapter.badge" className="font-serif italic text-primary text-xl sm:text-3xl block tracking-widest" />
            <span className="text-primary text-xl animate-pulse" style={{ animationDelay: '0.5s' }}>✦</span>
          </div>
          <EditableText as="h3" path="storytelling.finalChapter.title" className="text-5xl sm:text-6xl md:text-8xl font-display text-transparent bg-clip-text bg-gradient-to-b from-white via-champagne to-primary block drop-shadow-[0_0_20px_rgba(249,215,126,0.3)]" />
          <EditableText as="p" path="storytelling.finalChapter.quote" multiline className="text-slate-300 text-xl sm:text-2xl leading-relaxed italic max-w-2xl mx-auto block font-serif" />
          <div className="h-[1px] w-48 bg-gradient-to-r from-transparent via-primary/60 to-transparent mx-auto"></div>
          <EditableText as="p" path="storytelling.finalChapter.desc" multiline className="text-slate-400 font-light max-w-2xl mx-auto text-base sm:text-lg block leading-loose" />
        </div>
      </motion.div>
    </section>
  );
}
