import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface Announcement {
  id: number;
  title: string;
  message: string;
  type: string;
  created_at: string;
  is_active: boolean;
}

interface AdminAnnouncementsListProps {
  adminKey: string;
  onSuccess: () => void;
  onError: (message: string) => void;
  refreshTrigger?: number;
}

export default function AdminAnnouncementsList({ 
  adminKey, 
  onSuccess, 
  onError,
  refreshTrigger 
}: AdminAnnouncementsListProps) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const API_URL = 'https://functions.poehali.dev/51925830-8d38-4748-99dc-dc5df4e26ac4';

  useEffect(() => {
    fetchAnnouncements();
  }, [refreshTrigger]);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: 'GET'
      });

      if (!response.ok) {
        onError('Failed to fetch announcements');
        return;
      }

      const data = await response.json();
      setAnnouncements(data.announcements || []);
    } catch (error) {
      onError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this announcement?')) {
      return;
    }

    setDeletingId(id);

    try {
      const response = await fetch(`${API_URL}?id=${id}`, {
        method: 'DELETE',
        headers: {
          'X-Admin-Key': adminKey
        }
      });

      const data = await response.json();

      if (!response.ok) {
        onError(data.error || 'Failed to delete announcement');
        return;
      }

      onSuccess();
      fetchAnnouncements();
    } catch (error) {
      onError('Network error');
    } finally {
      setDeletingId(null);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'warning': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'error': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
        <div className="flex items-center justify-center py-8">
          <p className="text-white/60">Loading announcements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon name="List" size={20} className="text-white" />
          <h2 className="text-lg font-semibold text-white">Active Announcements</h2>
        </div>
        <span className="text-sm text-white/60">{announcements.length} total</span>
      </div>

      {announcements.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-white/60 text-sm">No announcements yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {announcements.map((announcement) => (
            <div
              key={announcement.id}
              className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs px-2 py-1 rounded border ${getTypeColor(announcement.type)}`}>
                      {announcement.type}
                    </span>
                    <span className="text-xs text-white/40">
                      {formatDate(announcement.created_at)}
                    </span>
                  </div>
                  <h3 className="text-sm font-medium text-white mb-1">
                    {announcement.title}
                  </h3>
                  <p className="text-xs text-white/60">
                    {announcement.message}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(announcement.id)}
                  disabled={deletingId === announcement.id}
                  className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                >
                  {deletingId === announcement.id ? (
                    <Icon name="Loader2" size={16} className="animate-spin" />
                  ) : (
                    <Icon name="Trash2" size={16} />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
