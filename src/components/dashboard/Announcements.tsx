import Icon from '@/components/ui/icon';

interface Announcement {
  id: string;
  title: string;
  date: string;
  content: string[];
}

interface AnnouncementsProps {
  announcements: Announcement[];
}

export default function Announcements({ announcements }: AnnouncementsProps) {
  return (
    <div className="bg-zinc-950 border border-white/10 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-2">Announcements</h3>
      <p className="text-sm text-zinc-400 mb-6">News and updates of the project.</p>

      <div className="space-y-6">
        {announcements.map((announcement) => (
          <div key={announcement.id} className="border-l-2 border-white/10 pl-4">
            <div className="flex items-start gap-3 mb-3">
              <Icon name="Circle" size={16} className="text-zinc-500 mt-1" />
              <div>
                <h4 className="text-white font-medium">{announcement.title}</h4>
                <span className="text-xs text-zinc-500">{announcement.date}</span>
              </div>
            </div>
            <div className="space-y-2">
              {announcement.content.map((item, index) => (
                <p key={index} className="text-sm text-zinc-400 leading-relaxed">
                  {item}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
