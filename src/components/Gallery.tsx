export default function Gallery({ guestName, pronoun }: any) {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <span className="text-primary font-bold tracking-[0.3em] uppercase text-xs mb-4 block">Graduation Celebration</span>
        <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tighter">
          Kỷ niệm cùng <span className="text-primary italic font-serif">{guestName || pronoun}</span>
        </h2>
        <p className="text-lg md:text-xl opacity-70 max-w-2xl mx-auto leading-relaxed font-light">
          A collection of moments captured in the glow of our shared orbit. Lời cảm ơn gửi đến {pronoun.toLowerCase()} vì đã là một phần của hành trình ánh sáng này.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[200px]">
        <div className="md:col-span-2 md:row-span-2 relative group overflow-hidden rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.1)]">
          <div className="absolute inset-0 bg-gradient-to-t from-background-dark/80 via-transparent to-transparent z-10"></div>
          <div className="absolute bottom-6 left-6 z-20">
            <span className="text-primary text-xs font-bold tracking-widest uppercase mb-2 block">First Orbit</span>
            <h3 className="text-2xl font-bold">The Beginning of Everything</h3>
          </div>
          <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1000&auto=format&fit=crop" alt="Graduation" />
        </div>

        <div className="md:col-span-2 md:row-span-1 bg-white/5 backdrop-blur-md rounded-xl p-8 flex flex-col justify-center border border-primary/20">
          <span className="text-primary mb-4 text-4xl">"</span>
          <p className="font-serif italic text-2xl md:text-3xl leading-snug text-slate-200">
            Trong sự mênh mông của không gian, chúng tôi đã tìm thấy ngôi nhà của mình giữa những vì sao.
          </p>
          <p className="mt-4 text-sm opacity-50 tracking-widest uppercase">— A Note on Timing</p>
        </div>

        <div className="md:col-span-1 md:row-span-2 bg-white/5 backdrop-blur-md rounded-xl p-6 flex flex-col justify-between border border-white/5 relative group">
          <div>
            <span className="text-primary text-[10px] font-bold tracking-[0.2em] uppercase mb-4 block">Memory Note</span>
            <p className="text-lg leading-relaxed font-light italic">
              Những buổi chiều muộn tại thư viện, nơi tiếng lật sách hòa cùng ánh hoàng hôn buông xuống. Đó là nơi ước mơ bắt đầu thành hình.
            </p>
          </div>
          <div className="pt-6 border-t border-white/10">
            <p className="text-xs opacity-60">Tháng 5, 2024 • Archive 01</p>
          </div>
        </div>

        <div className="md:col-span-1 md:row-span-1 rounded-xl overflow-hidden shadow-[0_0_20px_rgba(212,175,55,0.1)] group">
          <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1000&auto=format&fit=crop" alt="Diploma" />
        </div>

        <div className="md:col-span-1 md:row-span-1 flex items-center justify-center text-center p-6 border border-white/5 rounded-xl bg-white/5 italic">
          <p className="text-sm opacity-80">
            Mỗi bước đi là một quỹ đạo mới, dẫn lối chúng ta đến những chân trời vàng rực rỡ.
          </p>
        </div>

        <div className="md:col-span-2 md:row-span-2 relative group overflow-hidden rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.1)]">
          <div className="absolute inset-0 bg-background-dark/20 group-hover:bg-transparent transition-colors duration-500"></div>
          <img className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=1000&auto=format&fit=crop" alt="Friends" />
          <div className="absolute top-6 left-6 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase">
            Moments in Motion
          </div>
        </div>

        <div className="md:col-span-1 md:row-span-2 bg-primary/10 border border-primary/20 rounded-xl p-6 flex flex-col gap-4">
          <h4 className="text-xl font-bold text-primary">Gửi {pronoun.toLowerCase()}</h4>
          <p className="text-sm leading-relaxed opacity-80">
            Hành trình này sẽ không trọn vẹn nếu thiếu đi sự hiện diện của {guestName || pronoun}. Cảm ơn vì đã cùng đồng hành qua những mùa thi rực rỡ.
          </p>
          <div className="mt-auto">
            <p className="text-[10px] mt-2 opacity-40 uppercase tracking-widest">Shared Legacy</p>
          </div>
        </div>

        <div className="md:col-span-1 md:row-span-2 bg-gradient-to-br from-primary/20 to-transparent rounded-xl p-8 flex flex-col items-center text-center justify-center">
          <p className="font-serif italic text-3xl mb-4">"Golden Horizons"</p>
          <div className="w-12 h-px bg-primary mb-4"></div>
          <p className="text-xs tracking-widest uppercase opacity-60">The future is bright, and it's calling your name.</p>
        </div>
      </div>
    </section>
  );
}
