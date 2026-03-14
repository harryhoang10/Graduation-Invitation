import { motion } from 'framer-motion';
import { EditableText } from './EditableText';
import { useData } from '../context/DataContext';
import { ParkingCircle, Compass, MapPin, BellRing } from 'lucide-react';

export default function Parking({ guestName, pronoun }: any) {
  const { data } = useData();
  const spots = data.parking.spots;

  return (
    <section className="max-w-4xl mx-auto px-4 md:px-20 py-20 flex flex-col items-center">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="w-full text-center mb-16 relative"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/5 border border-white/10 text-primary text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] mb-6">
          <EditableText path="parking.badge" />
        </div>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-display text-white mb-6 tracking-tight">
          <EditableText path="parking.title1" guestName={guestName} pronoun={pronoun} /> <br className="sm:hidden" />
          <EditableText path="parking.title2" className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-yellow-100 to-primary drop-shadow-[0_0_10px_rgba(242,208,107,0.3)]" />
        </h2>
        <EditableText as="p" path="parking.subtitle" multiline pronoun={pronoun} className="text-slate-400 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed block" />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="w-full max-w-3xl"
      >
        <div className="bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl border border-white/10">
          <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
            <div className="flex items-center gap-4">
              <div className="size-10 sm:size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-[0_0_20px_rgba(242,208,107,0.15)]">
                <ParkingCircle size={24} />
              </div>
              <div>
                <EditableText as="h3" path="parking.cardTitle" className="text-lg sm:text-xl font-bold text-white leading-tight block" />
                <EditableText as="p" path="parking.cardSubtitle" className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-wider block" />
              </div>
            </div>
            <Compass className="text-slate-500/50" size={24} />
          </div>

          <div className="p-2 space-y-2">
            {spots.map((spot: any, i: number) => (
              <div key={i} className="group cursor-default p-3 sm:p-4 rounded-xl hover:bg-white/5 transition-all duration-300 flex items-center gap-3 sm:gap-4 border border-transparent hover:border-white/10">
                <div className="size-8 sm:size-10 rounded-full border border-slate-600 flex items-center justify-center text-slate-500 group-hover:text-primary transition-colors">
                  <MapPin size={16} />
                </div>
                <div className="flex-1">
                  <EditableText as="div" path={`parking.spots.${i}.name`} className="text-white font-medium text-sm sm:text-base block" />
                </div>
                <EditableText as="div" path={`parking.spots.${i}.status`} className="text-slate-500 italic text-xs sm:text-sm block" />
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
