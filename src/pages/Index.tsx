import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';

export default function Index() {
  const [activeTab, setActiveTab] = useState<'plans' | 'api'>('plans');

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    document.querySelectorAll('[style*="opacity:0"]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const plans = [
    {
      name: 'Basic',
      price: '10€ Monthly - 30€ Lifetime',
      features: [
        'Concurrent: 1',
        'Max Time: 60s',
        'Cooldown: 0s',
        'Without VIP'
      ]
    },
    {
      name: 'Medium',
      price: '25€ Monthly - 50€ Lifetime',
      features: [
        'Concurrent: 2',
        'Max Time: 120s',
        'Cooldown: 0s',
        'With VIP'
      ]
    },
    {
      name: 'Advanced',
      price: '45€ Monthly - 80€ Lifetime',
      features: [
        'Concurrent: 3',
        'Max Time: 180s',
        'Cooldown: 0s',
        'With VIP'
      ]
    }
  ];

  const apiPlans = [
    {
      name: 'API Basic',
      price: '15€ Monthly - 40€ Lifetime',
      features: [
        'API Access',
        'Concurrent: 1',
        'Max Time: 60s',
        'Full Documentation'
      ]
    },
    {
      name: 'API Pro',
      price: '35€ Monthly - 70€ Lifetime',
      features: [
        'API Access',
        'Concurrent: 3',
        'Max Time: 180s',
        'Priority Support'
      ]
    },
    {
      name: 'API Enterprise',
      price: '75€ Monthly - 150€ Lifetime',
      features: [
        'API Access',
        'Concurrent: 5',
        'Max Time: 300s',
        'Dedicated Support'
      ]
    }
  ];

  const addons = [
    { name: 'Bypass Power Saving', price: '50€' },
    { name: '+1 Concurrents', price: '30€' },
    { name: '+60s', price: '20€' },
    { name: 'No Cooldown', price: '10€' },
    { name: 'Private Power (1Tbps+)', price: '400€' }
  ];

  const methods = [
    '!dns', '!udp', '!pps', '!tcp', '!tcpdrop', '!fivem', '!discord', '!rand',
    '!ack', '!socket', '!syn', '!gudp', '!udpbypass', '!tcp-spoof', '!ovh',
    '!udpdrop', '!tls', '!http', '!flood', '!browser', '!priv-flood'
  ];

  return (
    <div className="min-h-screen w-full">
      <header className="container flex items-center justify-between py-6">
        <div className="text-lg sm:text-xl font-semibold tracking-tight flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-white/80 shadow-[0_0_20px_rgba(255,255,255,0.6)]" />
          Kodein Botnet
        </div>
        <div className="flex items-center gap-3">
          <a
            className="button-ghost px-4 py-2 rounded-md flex items-center gap-2"
            href="https://t.me/join_kodein"
          >
            <Icon name="Zap" size={16} />
            Telegram
          </a>
          <a
            className="button-ghost px-4 py-2 rounded-md flex items-center gap-2"
            href="https://discord.gg/Y5mNrQm6pp"
          >
            <Icon name="Shield" size={16} />
            Discord
          </a>
        </div>
      </header>

      <section className="container relative py-16 sm:py-24 text-center">
        <div className="ambient-light" />
        <h1
          id="home"
          className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight"
          style={{ opacity: 0, transform: 'translateY(20px)' }}
        >
          Kodein Botnet
          <span className="block text-white/80 text-lg sm:text-2xl mt-4 font-normal">
            Massive Power. Real Results.
          </span>
        </h1>
        <p
          className="section-subtitle max-w-2xl mx-auto"
          style={{ opacity: 0, transform: 'translateY(20px)' }}
        >
          Extreme network load with 200–500 Gbps+ Layer 4 firepower and 2–3 million RPS at Layer 7. 
          Daily updates, optimized payloads, and cutting-edge bypass methods for maximum efficiency.
        </p>
        <div
          className="mt-8 flex justify-center"
          style={{ opacity: 0, transform: 'translateY(20px)' }}
        >
          <a
            target="_blank"
            className="button-ghost glow px-6 py-3 rounded-lg inline-flex items-center gap-3 text-white"
            href="https://t.me/join_kodein"
            rel="noreferrer"
          >
            <Icon name="Zap" size={20} />
            Join Telegram
          </a>
        </div>
      </section>

      <section className="container relative py-16 sm:py-24">
        <div className="ambient-light" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div
            className="soft-border rounded-xl p-6 glow/0 bg-white/[0.01] hover:bg-white/[0.03] transition-colors"
            style={{ opacity: 0, transform: 'translateY(16px)' }}
          >
            <div className="text-2xl font-semibold tracking-tight">350+ Gbps</div>
            <div className="text-zinc-400 mt-1">Layer 4 Throughput</div>
          </div>
          <div
            className="soft-border rounded-xl p-6 glow/0 bg-white/[0.01] hover:bg-white/[0.03] transition-colors"
            style={{ opacity: 0, transform: 'translateY(16px)' }}
          >
            <div className="text-2xl font-semibold tracking-tight">2,000,000+ RPS</div>
            <div className="text-zinc-400 mt-1">Requests per Second</div>
          </div>
          <div
            className="soft-border rounded-xl p-6 glow/0 bg-white/[0.01] hover:bg-white/[0.03] transition-colors"
            style={{ opacity: 0, transform: 'translateY(16px)' }}
          >
            <div className="text-2xl font-semibold tracking-tight">20+ Mpps</div>
            <div className="text-zinc-400 mt-1">Packets per Second</div>
          </div>
        </div>
      </section>

      <section className="container relative py-16 sm:py-24">
        <div className="ambient-light" />
        <h2
          className="section-title text-center"
          style={{ opacity: 0, transform: 'translateY(20px)' }}
        >
          Born for Power, Built with Precision
        </h2>
        <p className="section-subtitle text-center max-w-2xl mx-auto">
          Experience large scale attack powered by real botnet infrastructure.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-10">
          <div
            className="soft-border rounded-xl p-6 bg-white/[0.01] hover:bg-white/[0.03] transition-colors"
            style={{ opacity: 0, transform: 'translateY(16px)' }}
          >
            <div className="flex items-center gap-3 text-lg font-semibold">
              <span className="w-8 h-8 rounded-md bg-white/[0.06] grid place-items-center">
                <Icon name="Shield" className="text-white/80" size={20} />
              </span>
              Network Compatibility
            </div>
            <p className="text-zinc-400 mt-3 leading-relaxed">
              Unmatched L4 strength with constant updates. At L7, smart bypasses over numbers, 
              real power, real impact, unbeatable for the price.
            </p>
          </div>
          <div
            className="soft-border rounded-xl p-6 bg-white/[0.01] hover:bg-white/[0.03] transition-colors"
            style={{ opacity: 0, transform: 'translateY(16px)' }}
          >
            <div className="flex items-center gap-3 text-lg font-semibold">
              <span className="w-8 h-8 rounded-md bg-white/[0.06] grid place-items-center">
                <Icon name="Cloud" className="text-white/80" size={20} />
              </span>
              Bypass Technology
            </div>
            <p className="text-zinc-400 mt-3 leading-relaxed">
              High-efficiency methods designed to simulate real users and bypass advanced 
              filtering and mitigation layers.
            </p>
          </div>
          <div
            className="soft-border rounded-xl p-6 bg-white/[0.01] hover:bg-white/[0.03] transition-colors"
            style={{ opacity: 0, transform: 'translateY(16px)' }}
          >
            <div className="flex items-center gap-3 text-lg font-semibold">
              <span className="w-8 h-8 rounded-md bg-white/[0.06] grid place-items-center">
                <Icon name="Zap" className="text-white/80" size={20} />
              </span>
              Scalable & Future-Ready
            </div>
            <p className="text-zinc-400 mt-3 leading-relaxed">
              Constantly updated and instantly delivered, our system scales with demand while 
              ensuring precision and excellent service.
            </p>
          </div>
        </div>
      </section>

      <section className="container relative py-16 sm:py-24">
        <div className="ambient-light" />
        <h2
          id="pricing"
          className="section-title text-center"
          style={{ opacity: 0, transform: 'translateY(20px)' }}
        >
          Kodein Networks Pricing
        </h2>
        <p className="section-subtitle text-center max-w-2xl mx-auto">
          Choose the plan that suits your testing needs.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            className={`px-4 py-2 rounded-md cursor-pointer transition-colors ${
              activeTab === 'plans'
                ? 'bg-white/[0.1] border border-white/20'
                : 'button-ghost'
            }`}
            onClick={() => setActiveTab('plans')}
          >
            Plans
          </button>
          <button
            className={`px-4 py-2 rounded-md cursor-pointer transition-colors ${
              activeTab === 'api'
                ? 'bg-white/[0.1] border border-white/20'
                : 'button-ghost'
            }`}
            onClick={() => setActiveTab('api')}
          >
            API Plans
          </button>
        </div>
        <div className="mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {(activeTab === 'plans' ? plans : apiPlans).map((plan, idx) => (
              <div
                key={idx}
                className="soft-border rounded-xl p-6 bg-white/[0.01] hover:bg-white/[0.03] transition-colors flex flex-col"
              >
                <div className="text-xl font-semibold">
                  {plan.name} Plan
                </div>
                <div className="text-zinc-300 mt-1">{plan.price}</div>
                <ul className="mt-4 text-zinc-300/90 text-sm flex-1 space-y-2">
                  {plan.features.map((feature, fidx) => (
                    <li key={fidx} className="text-zinc-300/90">
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container relative py-16 sm:py-24">
        <div className="ambient-light" />
        <h2
          className="section-title text-center"
          style={{ opacity: 0, transform: 'translateY(20px)' }}
        >
          Addons & Power-Ups
        </h2>
        <p className="section-subtitle text-center max-w-2xl mx-auto">
          Boost your plan with extra features.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mt-10">
          {addons.map((addon, idx) => (
            <div
              key={idx}
              className="soft-border rounded-xl p-6 bg-white/[0.01] hover:bg-white/[0.03] transition-colors"
              style={{ opacity: 0, transform: 'translateY(16px)' }}
            >
              <div className="text-lg font-semibold">{addon.name}</div>
              <div className="text-zinc-400 mt-1">{addon.price}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="container relative py-16 sm:py-24">
        <div className="ambient-light" />
        <h2
          className="section-title text-center"
          style={{ opacity: 0, transform: 'translateY(20px)' }}
        >
          Available Methods
        </h2>
        <p className="section-subtitle text-center max-w-2xl mx-auto">
          Comprehensive arsenal of attack vectors for maximum effectiveness.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mt-10">
          {methods.map((method, idx) => (
            <div
              key={idx}
              className="soft-border rounded-lg p-3 bg-white/[0.01] hover:bg-white/[0.03] transition-colors text-center"
              style={{ opacity: 0, transform: 'translateY(16px)' }}
            >
              <code className="text-sm font-mono text-zinc-300">{method}</code>
            </div>
          ))}
        </div>
      </section>

      <footer className="container py-12 text-center text-xs text-zinc-500">
        © 2025 Kodein Networks. All rights reserved.
      </footer>
    </div>
  );
}
