import Icon from '@/components/ui/icon';

export default function DashboardAnnouncements() {
  const announcements = [
    {
      title: 'UPDATE 30.09.2025',
      date: 'Yesterday, 23:38:16',
      items: [
        {
          icon: 'Shield',
          text: 'Unmatched Bypass Power: Fully capable of bypassing Cloudflare 100%, including Managed Challenge, Interactive Challenge, and UAM. It also effortlessly conquers DDOS-GUARD, UAM and other bad sources.'
        },
        {
          icon: 'Fingerprint',
          text: 'Ultra-Realistic Fingerprinting: We emulate a genuine Chrome 140 browser, equipped with advanced, realistic fingerprints that blend in with organic traffic, making detection nearly impossible.'
        },
        {
          icon: 'Monitor',
          text: 'Full OS Spoofing: Seamlessly mimic real users with macOS, Linux, and Windows operating system spoofing. Your requests appear to originate from a diverse range of real desktop environments.'
        },
        {
          icon: 'Sparkles',
          text: 'Dynamic Value Replacement: Use (RSTR) in your postdata or path; it will be replaced with a random 4-character string (e.g., ewhe). Use (RINT) in your postdata or path; it will be replaced with a random integer in the range of 1111-9999 (e.g., 1234). Elevate your performance with the most advanced browser emulator on the market.'
        }
      ]
    },
    {
      title: 'OFFICIAL DOMAINS & TELEGRAM CHANNEL',
      date: '6 September, 21:04',
      items: []
    }
  ];

  return (
    <div className="bg-[#0f0f0f] border border-white/10 rounded-lg p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-white mb-1">Announcements</h3>
        <p className="text-sm text-zinc-400">News and updates of the project.</p>
      </div>

      <div className="space-y-6">
        {announcements.map((announcement, index) => (
          <div key={index} className="border-l-2 border-white/10 pl-4">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-2 h-2 rounded-full bg-white/20 mt-2" />
              <div className="flex-1">
                <h4 className="text-white font-semibold">{announcement.title}</h4>
                <p className="text-xs text-zinc-500">{announcement.date}</p>
              </div>
            </div>
            {announcement.items.length > 0 && (
              <div className="space-y-3 ml-5">
                {announcement.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex gap-3">
                    <div className="w-5 h-5 bg-blue-500/20 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon name={item.icon as any} size={12} className="text-blue-400" />
                    </div>
                    <p className="text-sm text-zinc-300 leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
