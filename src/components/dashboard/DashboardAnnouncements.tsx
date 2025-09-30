import Icon from '@/components/ui/icon';

export default function DashboardAnnouncements() {
  return (
    <div className="bg-[#0f0f0f] border border-white/10 rounded-lg p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-white mb-1">Announcements</h3>
        <p className="text-sm text-zinc-400">News and updates of the project.</p>
      </div>

      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Icon name="Bell" size={48} className="text-zinc-700 mx-auto mb-4" />
          <p className="text-zinc-500">No announcements yet</p>
        </div>
      </div>
    </div>
  );
}
