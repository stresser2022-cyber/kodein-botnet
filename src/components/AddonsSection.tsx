export default function AddonsSection() {
  const addons = [
    { name: 'Bypass Power Saving', price: '50€' },
    { name: '+1 Concurrents', price: '30€' },
    { name: '+60s', price: '20€' },
    { name: 'No Cooldown', price: '10€' },
    { name: 'Private Power (1Tbps+)', price: '400€' }
  ];

  return (
    <section className="max-w-6xl mx-auto relative py-16 px-6">
      <h2 className="text-3xl sm:text-4xl font-bold text-center text-white opacity-0 translate-y-5" data-animate>
        Addons & Power-Ups
      </h2>
      <p className="text-zinc-400 text-center max-w-2xl mx-auto mt-4 text-sm">
        Boost your plan with extra features.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-10">
        {addons.map((addon, idx) => (
          <div
            key={idx}
            className="soft-border rounded-lg p-5 bg-transparent hover:bg-white/[0.02] transition-colors opacity-0 translate-y-4"
            data-animate
          >
            <div className="text-base font-bold text-white">{addon.name}</div>
            <div className="text-zinc-400 mt-2 text-sm">{addon.price}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
