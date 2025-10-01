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
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-foreground mb-2">Announcements</h3>
      <p className="text-sm text-muted-foreground mb-6">News and updates of the project.</p>

      <div className="space-y-6">
        {announcements.map((announcement) => (
          <div key={announcement.id} className="border-l-2 border-border pl-4">
            <div className="flex items-start gap-3 mb-3">
              <Icon name="Circle" size={16} className="text-muted-foreground mt-1" />
              <div>
                <h4 className="text-foreground font-medium">{announcement.title}</h4>
                <span className="text-xs text-muted-foreground">{announcement.date}</span>
              </div>
            </div>
            <div className="space-y-2">
              {announcement.content.map((item, index) => (
                <p key={index} className="text-sm text-muted-foreground leading-relaxed">
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