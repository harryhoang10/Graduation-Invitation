import { motion } from 'framer-motion';
import { EditableText } from './EditableText';

export default function Personalization({ guestName, setGuestName, pronoun, setPronoun, onContinue }: any) {
  return (
    <div id="personalization" className="relative min-h-screen flex flex-col items-center justify-center px-4 py-12 overflow-hidden">
      {/* Ambient Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-primary/5 via-background-dark to-background-dark -z-10 pointer-events-none"></div>
      <div className="absolute border border-primary/10 rounded-full w-[600px] h-[600px] -top-20 -left-20 pointer-events-none animate-[spin_40s_linear_infinite]"></div>
      <div className="absolute border border-primary/10 rounded-full w-[800px] h-[800px] -bottom-40 -right-40 pointer-events-none animate-[spin_50s_linear_infinite_reverse]"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-xl text-center mb-10 z-10"
      >
        <EditableText as="h2" path="personalization.title" className="font-serif text-4xl md:text-5xl text-champagne mb-4 drop-shadow-[0_0_15px_rgba(249,215,126,0.4)] block" />
        <EditableText as="p" path="personalization.subtitle" multiline className="text-slate-300 text-lg font-light max-w-md mx-auto block" />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="bg-white/5 backdrop-blur-xl border border-primary/20 shadow-[0_8px_40px_0_rgba(0,0,0,0.6)] w-full max-w-lg rounded-3xl p-8 md:p-12 z-10 relative"
      >
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-background-dark border border-primary/30 rounded-full flex items-center justify-center text-primary text-xl shadow-[0_0_15px_rgba(249,215,126,0.3)]">
          ✨
        </div>

        <div className="space-y-12 mt-4">
          <div className="space-y-6">
            <EditableText as="label" path="personalization.q1" pronoun={pronoun || 'bạn'} highlightVariables className="block text-center text-xl font-serif text-champagne/90" />
            <div className="flex flex-wrap justify-center gap-4">
              {['Anh', 'Chị', 'Bạn', 'Em'].map(p => (
                <button
                  key={p}
                  onClick={() => setPronoun(p)}
                  className={`relative flex h-12 min-w-[100px] items-center justify-center rounded-full px-8 transition-all cursor-pointer ${
                    pronoun === p 
                      ? 'bg-primary/20 border border-primary font-serif italic text-2xl text-primary shadow-[0_0_15px_rgba(249,215,126,0.3)] scale-105' 
                      : 'bg-white/5 border border-white/10 text-slate-300 font-medium hover:bg-primary/10 hover:border-primary/40'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <EditableText as="label" path="personalization.q2" pronoun={pronoun || 'bạn'} highlightVariables className="block text-center text-xl font-serif text-champagne/90" />
            <div className="relative group max-w-xs mx-auto">
              <input 
                type="text" 
                value={guestName}
                onChange={e => setGuestName(e.target.value)}
                placeholder="Nhập tên / biệt hiệu"
                className="w-full bg-transparent border-0 border-b-2 border-white/10 focus:border-primary focus:ring-0 text-center text-2xl font-serif text-white placeholder:text-slate-600 transition-all pb-4 outline-none"
              />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-primary transition-all duration-500 group-focus-within:w-full shadow-[0_0_10px_rgba(249,215,126,0.5)]"></div>
            </div>
          </div>

          <div className="pt-8 flex flex-col items-center">
            <button 
              onClick={onContinue}
              disabled={!guestName.trim()}
              className="relative group overflow-hidden px-12 py-4 rounded-full bg-gradient-to-r from-primary to-celestial-gold text-background-dark font-bold tracking-[0.15em] uppercase text-sm transition-all hover:shadow-[0_0_30px_rgba(249,215,126,0.5)] hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none cursor-pointer"
            >
              <span className="relative z-10 flex items-center gap-2">
                <EditableText path="personalization.btn" />
                <span className="text-lg">✨</span>
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
