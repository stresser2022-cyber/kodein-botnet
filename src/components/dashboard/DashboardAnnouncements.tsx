import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';

export default function DashboardAnnouncements() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div 
      className={`bg-[#0f0f0f] border border-white/10 rounded-lg p-4 transition-opacity ${
        mounted ? 'opacity-0 animate-[fadeIn_0.5s_ease-in-out_forwards]' : 'opacity-0'
      }`}
      style={mounted ? { animationDelay: '0.3s' } : {}}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon name="Bell" size={18} className="text-zinc-400" />
          <h3 className="text-sm font-semibold text-white">Announcements</h3>
        </div>
        <p className="text-xs text-zinc-500">News and updates</p>
      </div>

      <div className="flex items-center justify-center py-6">
        <p className="text-xs text-zinc-500">No announcements yet</p>
      </div>
    </div>
  );
}
