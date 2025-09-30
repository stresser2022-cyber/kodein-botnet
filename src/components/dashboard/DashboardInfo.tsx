import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';

interface DashboardInfoProps {
  currentUser: string;
}

export default function DashboardInfo({ currentUser }: DashboardInfoProps) {
  const infoItems = [
    { icon: 'Users', label: 'Plan', value: 'Free' },
    { icon: 'Zap', label: 'Concurrents', value: '0 attacks' },
    { icon: 'Clock', label: 'Attack time', value: '0 sec.' },
    { icon: 'Crown', label: 'VIP Access', value: 'No' },
    { icon: 'Key', label: 'API Access', value: 'No' },
    { icon: 'Calendar', label: 'Expire', value: '1 January 1970, 07:00', closeable: true }
  ];

  return (
    <div className="bg-[#0f0f0f] border border-white/10 rounded-lg p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-white mb-1">Information</h3>
        <p className="text-sm text-zinc-400">Summary of your current plan.</p>
      </div>

      <div className="space-y-3 mb-6">
        {infoItems.map((item, index) => (
          <div 
            key={index}
            className="flex items-center justify-between py-2"
          >
            <div className="flex items-center gap-2 text-zinc-400">
              <Icon name={item.icon as any} size={16} />
              <span className="text-sm">{item.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-white">{item.value}</span>
              {item.closeable && (
                <button className="text-zinc-500 hover:text-white transition-colors">
                  <Icon name="X" size={14} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <Button className="w-full bg-white text-black hover:bg-white/90">
        Go Profile
      </Button>
    </div>
  );
}
