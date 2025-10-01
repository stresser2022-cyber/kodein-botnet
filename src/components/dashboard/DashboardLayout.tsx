import { ReactNode } from 'react';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

interface DashboardLayoutProps {
  children: ReactNode;
  currentUser: string;
  balance: number;
  onLogout: () => void;
}

export default function DashboardLayout({ children, currentUser, balance, onLogout }: DashboardLayoutProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="w-64 bg-sidebar-background border-r border-sidebar-border flex flex-col">
        <div className="p-6 border-b border-sidebar-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="Zap" size={20} className="text-sidebar-foreground" />
            <span className="text-sidebar-foreground font-semibold text-lg">Goliath Services</span>
          </div>
          <button className="text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors">
            <Icon name="PanelLeftClose" size={20} />
          </button>
        </div>

        <nav className="flex-1 py-6">
          <div className="px-4 mb-4">
            <span className="text-xs text-muted-foreground uppercase font-medium">Main</span>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full px-6 py-2.5 flex items-center gap-3 text-sidebar-accent-foreground bg-sidebar-accent border-l-2 border-sidebar-accent-foreground"
          >
            <Icon name="LayoutDashboard" size={18} />
            <span className="text-sm font-medium">Dashboard</span>
          </button>
          <button className="w-full px-6 py-2.5 flex items-center gap-3 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors">
            <Icon name="Swords" size={18} />
            <span className="text-sm font-medium">Attacks</span>
          </button>
          <button className="w-full px-6 py-2.5 flex items-center gap-3 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors">
            <Icon name="FileText" size={18} />
            <span className="text-sm font-medium">Documentation</span>
          </button>

          <div className="px-4 mt-6 mb-4">
            <span className="text-xs text-muted-foreground uppercase font-medium">Billing</span>
          </div>
          <button className="w-full px-6 py-2.5 flex items-center gap-3 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors">
            <Icon name="CreditCard" size={18} />
            <span className="text-sm font-medium">Plans</span>
          </button>
          <button className="w-full px-6 py-2.5 flex items-center gap-3 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors">
            <Icon name="DollarSign" size={18} />
            <span className="text-sm font-medium">Deposit</span>
          </button>
        </nav>

        <div className="border-t border-sidebar-border">
          <button className="w-full px-6 py-3 flex items-center gap-3 text-zinc-400 hover:text-white hover:bg-white/5 transition-colors">
            <Icon name="Send" size={18} />
            <span className="text-sm font-medium">Telegram</span>
          </button>
          <button className="w-full px-6 py-3 flex items-center gap-3 text-zinc-400 hover:text-white hover:bg-white/5 transition-colors">
            <Icon name="FileCheck" size={18} />
            <span className="text-sm font-medium">Terms</span>
          </button>
        </div>

        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center text-sidebar-accent-foreground text-sm font-medium">
                {currentUser.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="text-sm text-sidebar-foreground font-medium">{currentUser}</div>
                <div className="text-xs text-muted-foreground">Balance: {balance} $</div>
              </div>
            </div>
            <button onClick={onLogout} className="text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors">
              <Icon name="MoreVertical" size={18} />
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}