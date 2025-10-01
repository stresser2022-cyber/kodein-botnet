import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';

export default function DashboardAnnouncements() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div 
      className={`bg-card border border-border rounded-lg p-4 transition-opacity ${
        mounted ? 'opacity-0 animate-[fadeIn_0.5s_ease-in-out_forwards]' : 'opacity-0'
      }`}
      style={mounted ? { animationDelay: '0.3s' } : {}}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon name="Bell" size={18} className="text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">Announcements</h3>
        </div>
        <p className="text-xs text-muted-foreground">News and updates</p>
      </div>

      <div className="flex items-center justify-center py-6">
        <p className="text-xs text-muted-foreground">No announcements yet</p>
      </div>
    </div>
  );
}