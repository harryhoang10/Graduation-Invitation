import { motion } from 'framer-motion';
import { EditableText } from './EditableText';
import { EditableImage } from './EditableImage';
import { useData } from '../context/DataContext';
import { Countdown } from './Countdown';
import { Calendar, MapPin, Shirt } from 'lucide-react';

export default function EventDetails({ guestName, pronoun }: any) {
  const { data } = useData();

  return (
    <section id="event-details" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col gap-16 relative">
      <div className="absolute top-1/2 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-background-dark to-background-dark -z-10 pointer-events-none"></div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative group"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 via-champagne/20 to-primary/30 rounded-3xl blur-xl opacity-30 group-hover:opacity-60 transition duration-1000"></div>
        <div className="relative overflow-hidden rounded-3xl aspect-[21/9] min-h-[360px] bg-background-dark flex items-end p-6 sm:p-8 md:p-12 border border-primary/20 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          <div className="absolute inset-0">
            <EditableImage path="event.heroImg" className="w-full h-full object-cover transition-transform duration-[3000ms] group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a090d] via-[#0a090d]/60 to-transparent"></div>
          </div>
          <div className="relative z-10 flex flex-col gap-3">
            <EditableText path="event.badge" className="text-primary font-bold tracking-[0.4em] text-[10px] sm:text-xs uppercase block drop-shadow-[0_0_8px_rgba(249,215,126,0.5)]" />
            <h2 className="text-white text-4xl sm:text-5xl md:text-7xl font-display leading-tight tracking-tight drop-shadow-lg">
              <EditableText path="event.title1" /> <br className="sm:hidden" />
              <EditableText path="event.title2" className="text-transparent bg-clip-text bg-gradient-to-r from-champagne via-primary to-white italic font-serif" />
            </h2>
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="flex flex-col md:flex-row items-start justify-between gap-8 py-4"
      >
        <div className="max-w-2xl">
          <EditableText as="h3" path="event.sectionTitle" className="text-3xl md:text-5xl font-serif text-champagne mb-4 sm:mb-6 tracking-tight block drop-shadow-[0_0_10px_rgba(249,215,126,0.2)]" />
          <EditableText as="p" path="event.sectionDesc" multiline guestName={guestName} pronoun={pronoun} className="text-base sm:text-lg md:text-xl text-slate-300 font-light leading-relaxed block" />
        </div>
        <button className="flex items-center justify-center w-full md:w-auto gap-2 px-10 py-4 rounded-full border border-primary/40 bg-primary/10 hover:bg-primary hover:text-background-dark hover:shadow-[0_0_20px_rgba(249,215,126,0.4)] transition-all text-primary font-bold whitespace-nowrap cursor-pointer group">
          <EditableText path="event.btn" />
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </button>
      </motion.div>

      <Countdown />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        {[
          { icon: <Calendar className="w-6 h-6" />, title: 'Ngày & Giờ', val1: 'event.date', val2: 'event.time' },
          { icon: <MapPin className="w-6 h-6" />, title: 'Địa điểm', val1: 'event.location', val2: 'event.address' },
          { icon: <Shirt className="w-6 h-6" />, title: 'Trang phục', val1: 'event.dresscode', val2: 'event.dresscodeColor' }
        ].map((item, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.3)] flex flex-col gap-6 hover:-translate-y-2 transition-all duration-500 border border-primary/20 hover:border-primary/50 group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors"></div>
            
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-transparent flex items-center justify-center text-primary border border-primary/30 shadow-[0_0_15px_rgba(249,215,126,0.1)] group-hover:shadow-[0_0_20px_rgba(249,215,126,0.3)] group-hover:scale-110 transition-all duration-500">
              {item.icon}
            </div>
            <div className="relative z-10">
              <h4 className="text-[10px] sm:text-xs font-bold text-primary/80 uppercase tracking-[0.2em] mb-3">{item.title}</h4>
              <EditableText as="p" path={item.val1} className="text-xl sm:text-2xl font-serif text-champagne block group-hover:text-white transition-colors" />
              <EditableText as="p" path={item.val2} multiline className="text-sm sm:text-base text-slate-400 mt-2 block font-light" />
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-white/5 backdrop-blur-xl p-6 md:p-10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.3)] flex flex-col lg:flex-row gap-10 items-stretch border border-primary/20 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none"></div>
        
        <div className="flex-1 flex flex-col justify-center gap-8 relative z-10">
          <div className="space-y-4">
            <EditableText as="h4" path="event.mapTitle" className="text-2xl sm:text-3xl font-serif text-champagne block drop-shadow-[0_0_10px_rgba(249,215,126,0.2)]" />
            <EditableText as="p" path="event.mapDesc" multiline className="text-sm sm:text-base text-slate-300 leading-relaxed block font-light" />
          </div>
          <div className="flex flex-wrap gap-4">
            <a href={data.event.mapUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full sm:w-auto gap-3 px-8 py-4 bg-gradient-to-r from-primary to-celestial-gold text-background-dark rounded-full font-bold text-sm hover:shadow-[0_0_20px_rgba(249,215,126,0.4)] hover:scale-105 transition-all">
              <MapPin className="w-4 h-4" />
              <EditableText path="event.mapBtn" />
            </a>
          </div>
        </div>
        <div className="flex-1 min-h-[300px] sm:min-h-[350px] rounded-2xl overflow-hidden relative group shadow-2xl border border-white/10">
          <EditableImage path="event.mapImg" className="absolute inset-0 w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-105" />
          <div className="absolute inset-0 bg-primary/10 mix-blend-overlay pointer-events-none group-hover:bg-transparent transition-colors duration-1000"></div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-16 h-16 bg-background-dark/80 backdrop-blur-md border border-primary/50 rounded-full flex items-center justify-center text-primary shadow-[0_0_30px_rgba(249,215,126,0.6)] animate-pulse-glow">
              <MapPin className="w-8 h-8" />
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
