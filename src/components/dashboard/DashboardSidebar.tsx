import Icon from '@/components/ui/icon';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '@/hooks/useTheme';

interface DashboardSidebarProps {
  currentUser: string;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onLogout: () => void;
}

export default function DashboardSidebar({ 
  currentUser, 
  collapsed, 
  onToggleCollapse,
  onLogout 
}: DashboardSidebarProps) {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const menuItems = [
    { icon: 'LayoutDashboard', label: 'Dashboard', path: '/dashboard' },
    { icon: 'Zap', label: 'Attacks', path: '/dashboard/attacks' },
    { icon: 'History', label: 'History', path: '/dashboard/history' },
    { icon: 'FileText', label: 'Documentation', path: '/dashboard/docs' }
  ];

  const billingItems = [
    { icon: 'CreditCard', label: 'Plans', path: '/dashboard/plans' },
    { icon: 'DollarSign', label: 'Deposit', path: '/dashboard/deposit' }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div 
      className={`fixed left-0 top-0 h-screen bg-sidebar-background border-r border-sidebar-border transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-64'
      } flex flex-col z-50`}
    >
      <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <Icon name="Shield" size={20} className="text-sidebar-foreground" />
            <span className="text-sidebar-foreground font-semibold">Kodein Services</span>
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          className="p-1 hover:bg-white/5 rounded transition-colors"
        >
          <Icon name={collapsed ? 'ChevronRight' : 'ChevronLeft'} size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <div className="px-3">
          {!collapsed && (
            <p className="text-xs text-zinc-500 uppercase tracking-wider px-3 mb-2">Main</p>
          )}
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-md mb-1 transition-colors ${
                isActive(item.path)
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
              }`}
            >
              <Icon name={item.icon as any} size={20} />
              {!collapsed && <span className="text-sm">{item.label}</span>}
            </Link>
          ))}
        </div>

        <div className="px-3 mt-6">
          {!collapsed && (
            <p className="text-xs text-zinc-500 uppercase tracking-wider px-3 mb-2">Billing</p>
          )}
          {billingItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-md mb-1 transition-colors ${
                isActive(item.path)
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
              }`}
            >
              <Icon name={item.icon as any} size={20} />
              {!collapsed && <span className="text-sm">{item.label}</span>}
            </Link>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10 p-3">
        <a
          href="https://t.me/mirai_network"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2 rounded-md mb-1 text-zinc-400 hover:bg-white/5 hover:text-white transition-colors"
        >
          <Icon name="Send" size={20} />
          {!collapsed && <span className="text-sm">Telegram</span>}
        </a>
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md mb-1 text-zinc-400 hover:bg-white/5 hover:text-white transition-colors"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          <Icon name={theme === 'dark' ? 'Sun' : 'Moon'} size={20} />
          {!collapsed && <span className="text-sm">{theme === 'dark' ? 'Light' : 'Dark'}</span>}
        </button>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-zinc-400 hover:bg-white/5 hover:text-white transition-colors"
        >
          <Icon name="LogOut" size={20} />
          {!collapsed && <span className="text-sm">Logout</span>}
        </button>

        {!collapsed && (
          <div className="mt-3 px-3 py-2 bg-white/5 rounded-md">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                <span className="text-xs font-semibold text-white">
                  {currentUser.substring(0, 2).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{currentUser}</p>
                <p className="text-xs text-zinc-500">Balance: 0 $</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}