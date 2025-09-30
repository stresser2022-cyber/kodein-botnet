import Icon from '@/components/ui/icon';

export default function FeaturesSection() {
  return (
    <section className="max-w-6xl mx-auto relative py-16 px-6">
      <h2 className="text-3xl sm:text-4xl font-bold text-center text-white opacity-0 translate-y-5" data-animate>
        Born for Power, Built with Precision
      </h2>
      <p className="text-zinc-400 text-center max-w-2xl mx-auto mt-4 text-sm">
        Experience large scale attack powered by real botnet infrastructure.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10">
        <div className="soft-border rounded-lg p-6 bg-transparent hover:bg-white/[0.02] transition-colors opacity-0 translate-y-4" data-animate>
          <div className="flex items-center gap-3 text-base font-semibold mb-3 text-white">
            <Icon name="Shield" size={18} />
            Network Compatibility
          </div>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Unmatched L4 strength with constant updates. At L7, smart bypasses over numbers, 
            real power, real impact, unbeatable for the price.
          </p>
        </div>
        <div className="soft-border rounded-lg p-6 bg-transparent hover:bg-white/[0.02] transition-colors opacity-0 translate-y-4" data-animate>
          <div className="flex items-center gap-3 text-base font-semibold mb-3 text-white">
            <Icon name="Cloud" size={18} />
            Bypass Technology
          </div>
          <p className="text-zinc-400 text-sm leading-relaxed">
            High-efficiency methods designed to simulate real users and bypass advanced 
            filtering and mitigation layers.
          </p>
        </div>
        <div className="soft-border rounded-lg p-6 bg-transparent hover:bg-white/[0.02] transition-colors opacity-0 translate-y-4" data-animate>
          <div className="flex items-center gap-3 text-base font-semibold mb-3 text-white">
            <Icon name="Zap" size={18} />
            Scalable & Future-Ready
          </div>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Constantly updated and instantly delivered, our system scales with demand while 
            ensuring precision and excellent service.
          </p>
        </div>
      </div>
    </section>
  );
}
