export default function PricingSection() {
  const plans = [
    {
      name: 'Basic',
      price: '10€ Monthly - 50€ Lifetime',
      features: [
        'Concurrent: 1',
        'Max Time: 60s',
        'Cooldown: 0s',
        'Without VIP'
      ]
    },
    {
      name: 'Medium',
      price: '30€ Monthly - 70€ Lifetime',
      features: [
        'Concurrent: 2',
        'Max Time: 120s',
        'Cooldown: 0s',
        'With VIP'
      ]
    },
    {
      name: 'Advanced',
      price: '50€ Monthly - 100€ Lifetime',
      features: [
        'Concurrent: 3',
        'Max Time: 180s',
        'Cooldown: 0s',
        'With VIP'
      ]
    }
  ];

  return (
    <section className="max-w-6xl mx-auto relative py-16 px-6">
      <h2 id="pricing" className="text-3xl sm:text-4xl font-bold text-center text-white opacity-0 translate-y-5" data-animate>
        Lunacy Networks Pricing
      </h2>
      <p className="text-zinc-400 text-center max-w-2xl mx-auto mt-4 text-sm">
        Choose the plan that suits your testing needs.
      </p>
      <div className="mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className="soft-border rounded-lg p-6 bg-transparent hover:bg-white/[0.02] transition-colors flex flex-col opacity-0 translate-y-4"
              data-animate
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