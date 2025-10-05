import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';

interface Announcement {
  id: number;
  title: string;
  message: string;
  type: string;
  created_at: string;
}

export default function DashboardAnnouncements() {
  const [mounted, setMounted] = useState(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = 'https://functions.poehali.dev/51925830-8d38-4748-99dc-dc5df4e26ac4';

  useEffect(() => {
    setMounted(true);
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch(API_URL, {
        method: 'GET'
      });

      if (!response.ok) {
        setLoading(false);
        return;
      }

      const data = await response.json();
      setAnnouncements(data.announcements || []);
    } catch (error) {
      console.error('Failed to fetch announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success': return 'CheckCircle2';
      case 'warning': return 'AlertTriangle';
      case 'error': return 'XCircle';
      default: return 'Info';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'error': return 'text-red-500';
      default: return 'text-blue-500';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

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

      {loading ? (
        <div className="flex items-center justify-center py-6">
          <p className="text-xs text-muted-foreground">Loading...</p>
        </div>
      ) : announcements.length === 0 ? (
        <div className="flex items-center justify-center py-6">
          <p className="text-xs text-muted-foreground">No announcements yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {announcements.map((announcement) => (
            <div 
              key={announcement.id}
              className="bg-muted/50 border border-border/50 rounded-lg p-3 hover:bg-muted/70 transition-colors"
            >
              <div className="flex items-start gap-3">
                <Icon 
                  name={getTypeIcon(announcement.type) as any}
                  size={16}
                  className={`mt-0.5 ${getTypeColor(announcement.type)}`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="text-sm font-medium text-foreground truncate">
                      {announcement.title}
                    </h4>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatDate(announcement.created_at)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {announcement.message}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
