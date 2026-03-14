import { useState } from 'react';
import { motion } from 'framer-motion';
import { EditableText } from './EditableText';
import { EditableImage } from './EditableImage';
import { useData } from '../context/DataContext';

export default function Timeline({ guestName, pronoun }: any) {
  const [step, setStep] = useState(4);
  const { data } = useData();
  const milestones = data.timeline.milestones;

  return (
    <section id="timeline" className="relative z-10 flex flex-col items-center justify-center px-4 sm:px-6 py-20 max-w-6xl mx-auto w-full">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-20 space-y-6"
      >
        <div className="flex justify-center items-center gap-4 mb-4">
          <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-primary/50"></div>
          <EditableText path="timeline.badge" className="inline-block px-4 py-1 rounded-full border border-primary/30 text-primary text-[10px] font-bold uppercase tracking-[0.4em] shadow-[0_0_10px_rgba(249,215,126,0.1)]" />
          <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-primary/50"></div>
        </div>
        <EditableText as="h2" path="timeline.title" className="font-serif italic text-4xl sm:text-5xl md:text-7xl text-white leading-tight drop-shadow-[0_0_20px_rgba(249,215,126,0.3)] block" />
        <EditableText as="p" path="timeline.subtitle" guestName={guestName} pronoun={pronoun} multiline className="text-slate-300 text-base sm:text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed block" />
      </motion.div>

      <div className="w-full max-w-5xl px-2 sm:px-4 md:px-10">
        <div className="relative pt-20 pb-16">
          <div className="absolute top-0 inset-x-0 flex justify-between text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-primary/60 px-2">
            <span>{milestones[0].label}</span>
            <span className="hidden md:block">{milestones[1].label}</span>
            <span className="hidden md:block">{milestones[2].label}</span>
            <span className="hidden md:block">{milestones[3].label}</span>
            <span>{milestones[4].label}</span>
          </div>

          <div className="relative h-24 flex items-center">
            <div className="absolute h-[2px] inset-x-0 bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>
            <input 
              type="range" 
              min="1" max="5" step="1" 
              value={step}
              onChange={(e) => setStep(parseInt(e.target.value))}
              className="absolute inset-x-0 w-full h-2 bg-transparent appearance-none cursor-pointer z-20 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-8 [&::-webkit-slider-thumb]:h-8 [&::-webkit-slider-thumb]:bg-background-dark [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:shadow-[0_0_20px_rgba(249,215,126,0.6)] [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:hover:scale-110"
            />
            
            <div className="absolute inset-x-0 flex justify-between pointer-events-none px-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className={`flex flex-col items-center transition-all duration-700 ${step === i ? 'scale-125 -translate-y-2' : 'opacity-40 hover:opacity-70'}`}>
                  <div className={`size-5 rounded-full border-[3px] mb-6 transition-all duration-500 ${step === i ? 'border-primary bg-background-dark shadow-[0_0_25px_rgba(249,215,126,0.8)]' : 'border-primary/30 bg-background-dark'}`}>
                    {step === i && <div className="absolute inset-0 m-auto w-2 h-2 bg-primary rounded-full animate-pulse"></div>}
                  </div>
                  <span className={`text-[10px] sm:text-xs font-bold tracking-widest transition-colors duration-500 ${step === i ? 'text-primary drop-shadow-[0_0_5px_rgba(249,215,126,0.5)]' : 'text-white/40'}`}>{milestones[i-1].label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <motion.div 
          key={step}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-10 items-center bg-white/5 border border-primary/20 rounded-3xl p-8 sm:p-12 backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.3)] relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none"></div>
          
          <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl border border-white/10">
            <EditableImage path="timeline.img" className="w-full h-full object-cover transition-transform duration-[3000ms] group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-background-dark/90 via-background-dark/20 to-transparent"></div>
            <div className="absolute bottom-6 left-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 backdrop-blur-md flex items-center justify-center border border-primary/30 text-primary">
                ✨
              </div>
              <span className="text-xs text-white/80 tracking-[0.2em] uppercase font-medium">Kỷ niệm {milestones[step-1].label.toLowerCase()}</span>
            </div>
          </div>
          <div className="space-y-8 relative z-10">
            <div className="space-y-4">
              <EditableText as="h3" path={`timeline.milestones.${step-1}.title`} className="font-display text-4xl sm:text-5xl text-champagne block drop-shadow-[0_0_10px_rgba(249,215,126,0.2)]" />
              <div className="h-[1px] w-16 bg-gradient-to-r from-primary/60 to-transparent"></div>
              <EditableText as="p" path={`timeline.milestones.${step-1}.desc`} multiline className="text-slate-300 leading-loose font-light text-sm sm:text-base block" />
            </div>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-[10px] uppercase tracking-[0.2em] text-primary font-medium shadow-[0_0_10px_rgba(249,215,126,0.1)]">✨ Đam mê</span>
              <span className="px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-[10px] uppercase tracking-[0.2em] text-primary font-medium shadow-[0_0_10px_rgba(249,215,126,0.1)]">🌟 Tư duy</span>
              <span className="px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-[10px] uppercase tracking-[0.2em] text-primary font-medium shadow-[0_0_10px_rgba(249,215,126,0.1)]">🚀 Bứt phá</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
