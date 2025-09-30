import Icon from '@/components/ui/icon';

interface AdminHeaderProps {
  onRefresh: () => void;
  onHome: () => void;
  onLogout: () => void;
  loading: boolean;
}

export default function AdminHeader({ onRefresh, onHome, onLogout, loading }: AdminHeaderProps) {
  return (
    <header className="border-b border-white/20">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon name="Shield" size={24} />
          <h1 className="text-xl font-bold text-white">Admin Panel</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onRefresh}
            className="button-ghost px-4 py-2 rounded-md flex items-center gap-2"
            disabled={loading}
          >
            <Icon name="RefreshCw" size={16} />
            Refresh
          </button>
          <button
            onClick={onHome}
            className="button-ghost px-4 py-2 rounded-md flex items-center gap-2"
          >
            <Icon name="Home" size={16} />
            Home
          </button>
          <button
            onClick={onLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <Icon name="LogOut" size={16} />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
