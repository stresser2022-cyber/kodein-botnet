interface PricingSectionProps {
  activeTab: 'plans' | 'api';
  setActiveTab: (tab: 'plans' | 'api') => void;
}

export default function PricingSection({ activeTab, setActiveTab }: PricingSectionProps) {
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

  return (
    <section className="max-w-6xl mx-auto relative py-16 px-6">
      <h2 id="pricing" className="text-3xl sm:text-4xl font-bold text-center text-white opacity-0 translate-y-5" data-animate>
        Kodein Networks Pricing
      </h2>
      <p className="text-zinc-400 text-center max-w-2xl mx-auto mt-4 text-sm">
        Choose the plan that suits your testing needs.
      </p>
      <div className="mt-8 flex items-center justify-center gap-3">
        <button
          className={`px-4 py-2 rounded-md cursor-pointer transition-colors text-sm text-white ${
            activeTab === 'plans'
              ? 'bg-white/[0.08] border border-white/20'
              : 'button-ghost'
          }`}
          onClick={() => setActiveTab('plans')}
        >
          Plans
        </button>
        <button
          className={`px-4 py-2 rounded-md cursor-pointer transition-colors text-sm text-white ${
            activeTab === 'api'
              ? 'bg-white/[0.08] border border-white/20'
              : 'button-ghost'
          }`}
          onClick={() => setActiveTab('api')}
        >
          API Plans
        </button>
      </div>
      <div className="mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(activeTab === 'plans' ? plans : apiPlans).map((plan, idx) => (
            <div
              key={idx}
              className="soft-border rounded-lg p-6 bg-transparent hover:bg-white/[0.02] transition-colors flex flex-col"
            >
              <div className="text-lg font-bold text-white">
                {plan.name} Plan
              </div>
              <div className="text-zinc-400 mt-2 text-sm">{plan.price}</div>
              <ul className="mt-4 text-zinc-400 text-sm flex-1 space-y-1.5">
                {plan.features.map((feature, fidx) => (
                  <li key={fidx}>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
