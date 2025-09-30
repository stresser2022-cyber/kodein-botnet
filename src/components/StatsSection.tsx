export default function StatsSection() {
  return (
    <section className="max-w-6xl mx-auto relative py-16 px-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="soft-border rounded-lg p-6 bg-transparent hover:bg-white/[0.02] transition-colors opacity-0 translate-y-4" data-animate>
          <div className="text-2xl font-bold tracking-tight text-white">350+ Gbps</div>
          <div className="text-zinc-400 mt-2 text-sm">Layer 4 Throughput</div>
        </div>
        <div className="soft-border rounded-lg p-6 bg-transparent hover:bg-white/[0.02] transition-colors opacity-0 translate-y-4" data-animate>
          <div className="text-2xl font-bold tracking-tight text-white">2,000,000+ RPS</div>
          <div className="text-zinc-400 mt-2 text-sm">Requests per Second</div>
        </div>
        <div className="soft-border rounded-lg p-6 bg-transparent hover:bg-white/[0.02] transition-colors opacity-0 translate-y-4" data-animate>
          <div className="text-2xl font-bold tracking-tight text-white">20+ Mpps</div>
          <div className="text-zinc-400 mt-2 text-sm">Packets per Second</div>
        </div>
      </div>
    </section>
  );
}
