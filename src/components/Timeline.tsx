import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EditableText } from './EditableText';
import { EditableImage } from './EditableImage';
import { useData } from '../context/DataContext';

const variants = {
  enter: (direction: number) => {
    return {
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    };
  }
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

export default function Timeline({ guestName, pronoun }: any) {
  const [step, setStep] = useState(4);
  const [[page, direction], setPage] = useState([0, 0]);
  const { data, isAdmin } = useData();
  const milestones = data.timeline.milestones;

  // Reset image index when switching milestones
  const handleStepChange = (newStep: number) => {
    setStep(newStep);
    setPage([0, 0]);
  };

  const currentMilestone = milestones[step - 1] || {};
  // Safely fallback to an empty array if images field is completely deleted
  const currentImages = currentMilestone.images || [];
  const maxImages = isAdmin ? currentImages.length + 1 : Math.max(1, currentImages.length);

  // Create a cyclic index wrapper ensuring it's always positive and within bounds
  const imageIndex = ((page % maxImages) + maxImages) % maxImages;

  const paginate = (newDirection: number) => {
    if (maxImages <= 1) return;
    setPage([page + newDirection, newDirection]);
  };

  // Determine path for EditableImage.
  // For admins, we strictly bind to the milestone's images array so that uploading creates the array.
  // For guests, if the array is empty, we show the global fallback image so the UI doesn't look broken.
  let imagePath = `timeline.milestones.${step - 1}.images.${imageIndex}`;
  if (currentImages.length === 0 && !isAdmin) {
    imagePath = `timeline.img`;
  }

  return (
    <section id="timeline" className="relative z-10 flex flex-col items-center justify-center px-4 sm:px-6 py-20 max-w-6xl mx-auto w-full overflow-hidden">
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
            <span>{milestones[0]?.label || ''}</span>
            <span className="hidden md:block">{milestones[1]?.label || ''}</span>
            <span className="hidden md:block">{milestones[2]?.label || ''}</span>
            <span className="hidden md:block">{milestones[3]?.label || ''}</span>
            <span>{milestones[4]?.label || ''}</span>
          </div>

          <div className="relative h-24 flex items-center">
            <div className="absolute h-[2px] inset-x-0 bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>
            <input
              type="range"
              min="1" max="5" step="1"
              value={step}
              onChange={(e) => handleStepChange(parseInt(e.target.value))}
              className="absolute inset-x-0 w-full h-2 bg-transparent appearance-none cursor-pointer z-20 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-8 [&::-webkit-slider-thumb]:h-8 [&::-webkit-slider-thumb]:bg-background-dark [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:shadow-[0_0_20px_rgba(249,215,126,0.6)] [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:hover:scale-110"
            />

            <div className="absolute inset-x-0 flex justify-between pointer-events-none px-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className={`flex flex-col items-center transition-all duration-700 ${step === i ? 'scale-125 -translate-y-2' : 'opacity-40 hover:opacity-70'}`}>
                  <div className={`size-5 rounded-full border-[3px] mb-6 transition-all duration-500 ${step === i ? 'border-primary bg-background-dark shadow-[0_0_25px_rgba(249,215,126,0.8)]' : 'border-primary/30 bg-background-dark'}`}>
                    {step === i && <div className="absolute inset-0 m-auto w-2 h-2 bg-primary rounded-full animate-pulse"></div>}
                  </div>
                  <span className={`text-[10px] sm:text-xs font-bold tracking-widest transition-colors duration-500 ${step === i ? 'text-primary drop-shadow-[0_0_5px_rgba(249,215,126,0.5)]' : 'text-white/40'}`}>{milestones[i - 1]?.label || ''}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Swipe/drag hint */}
          <div className="flex items-center justify-center gap-2 mt-2 text-primary/40 animate-pulse">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-60"><path d="M15 18l-6-6 6-6"/></svg>
            <span className="text-[10px] uppercase tracking-[0.3em] font-medium">Kéo để khám phá</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-60"><path d="M9 18l6-6-6-6"/></svg>
          </div>
        </div>

        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-10 items-center bg-white/5 border border-primary/20 rounded-3xl p-8 sm:p-12 backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.3)] relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none rounded-3xl"></div>

          <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-background-dark">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={page}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
                drag={maxImages > 1 ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = swipePower(offset.x, velocity.x);

                  if (swipe < -swipeConfidenceThreshold) {
                    paginate(1);
                  } else if (swipe > swipeConfidenceThreshold) {
                    paginate(-1);
                  }
                }}
                className="absolute inset-0 w-full h-full"
              >
                <div className="w-full h-full pointer-events-auto">
                  <EditableImage path={imagePath} className="w-full h-full object-cover transition-transform duration-[3000ms] group-[&:not(:hover)]:scale-100 scale-105 select-none" />
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Image Navigation */}
            {maxImages > 1 && (
              <>
                <button
                  onClick={() => paginate(-1)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-sm z-30 transition-all border border-white/20"
                >
                  ❮
                </button>
                <button
                  onClick={() => paginate(1)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-sm z-30 transition-all border border-white/20"
                >
                  ❯
                </button>
                {/* Image Dots */}
                <div className="absolute bottom-16 left-0 right-0 flex justify-center gap-1.5 z-30">
                  {Array.from({ length: maxImages }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 rounded-full transition-all duration-300 ${i === imageIndex ? 'w-6 bg-primary shadow-[0_0_8px_rgba(249,215,126,0.8)]' : 'w-1.5 bg-white/50'}`}
                    />
                  ))}
                </div>
              </>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-background-dark/90 via-background-dark/20 to-transparent pointer-events-none z-10"></div>
            <div className="absolute bottom-6 left-6 flex items-center gap-3 z-20">
              <div className="w-10 h-10 rounded-full bg-primary/20 backdrop-blur-md flex items-center justify-center border border-primary/30 text-primary">
                ✨
              </div>
              <span className="text-xs text-white/80 tracking-[0.2em] uppercase font-medium">Kỷ niệm {currentMilestone?.label?.toLowerCase() || ''}</span>
            </div>
          </div>
          <div className="space-y-8 relative z-10">
            <div className="space-y-4">
              <EditableText as="h3" path={`timeline.milestones.${step - 1}.title`} className="font-display text-4xl sm:text-5xl text-champagne block drop-shadow-[0_0_10px_rgba(249,215,126,0.2)]" />
              <div className="h-[1px] w-16 bg-gradient-to-r from-primary/60 to-transparent"></div>
              <EditableText as="p" path={`timeline.milestones.${step - 1}.desc`} multiline className="text-slate-300 leading-loose font-light text-sm sm:text-base block" />
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
