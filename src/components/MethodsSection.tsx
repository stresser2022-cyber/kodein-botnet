export default function MethodsSection() {
  const methods = [
    '!dns', '!udp', '!pps', '!tcp', '!tcpdrop', '!fivem', '!discord', '!rand',
    '!ack', '!socket', '!syn', '!gudp', '!udpbypass', '!tcp-spoof', '!ovh',
    '!udpdrop', '!tls', '!http', '!flood', '!browser', '!priv-flood'
  ];

  return (
    <section className="max-w-6xl mx-auto relative py-16 px-6">
      <h2 className="text-3xl sm:text-4xl font-bold text-center text-white opacity-0 translate-y-5" data-animate>
        Available Methods
      </h2>
      <p className="text-zinc-400 text-center max-w-2xl mx-auto mt-4 text-sm">
        Comprehensive arsenal of attack vectors for maximum effectiveness.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mt-10">
        {methods.map((method, idx) => (
          <div
            key={idx}
            className="soft-border rounded-md p-3 bg-transparent hover:bg-white/[0.02] transition-colors text-center opacity-0 translate-y-4"
            data-animate
          >
            <code className="text-xs font-mono text-zinc-300">{method}</code>
          </div>
        ))}
      </div>
    </section>
  );
}
