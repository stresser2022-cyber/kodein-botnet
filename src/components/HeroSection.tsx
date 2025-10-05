import Icon from '@/components/ui/icon';

export default function HeroSection() {
  return (
    <section className="max-w-6xl mx-auto relative py-24 sm:py-32 text-center px-6">
      <h1
        id="home"
        className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white opacity-0 translate-y-5"
        data-animate
      >
        Lunacy Botnet
      </h1>
      <p className="text-xl sm:text-2xl mt-6 font-medium text-white opacity-0 translate-y-5" data-animate>
        Massive Power. Real Results.
      </p>
      <p
        className="text-zinc-400 mt-6 max-w-2xl mx-auto text-sm leading-relaxed opacity-0 translate-y-5"
        data-animate
      >
        Extreme network load with 200–500 Gbps+ Layer 4 firepower and 2–3 million RPS at Layer 7. 
        Daily updates, optimized payloads, and cutting-edge bypass methods for maximum efficiency.
      </p>
      <div className="mt-10 flex justify-center opacity-0 translate-y-5" data-animate>
        <a
          target="_blank"
          className="button-ghost px-6 py-2.5 rounded-md inline-flex items-center gap-2 text-white text-sm"
          href="https://t.me/mirai_network"
          rel="noreferrer"
        >
          <Icon name="Zap" size={14} />
          Join Telegram
        </a>
      </div>
    </section>
  );
}