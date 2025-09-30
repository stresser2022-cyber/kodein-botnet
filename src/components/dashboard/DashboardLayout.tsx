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
    <div className="min-h-screen bg-black flex">
      <aside className="w-64 bg-zinc-950 border-r border-white/10 flex flex-col">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="Zap" size={20} className="text-white" />
            <span className="text-white font-semibold text-lg">Goliath Services</span>
          </div>
          <button className="text-zinc-400 hover:text-white transition-colors">
            <Icon name="PanelLeftClose" size={20} />
          </button>
        </div>

        <nav className="flex-1 py-6">
          <div className="px-4 mb-4">
            <span className="text-xs text-zinc-500 uppercase font-medium">Main</span>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full px-6 py-2.5 flex items-center gap-3 text-white bg-white/10 border-l-2 border-white"
          >
            <Icon name="LayoutDashboard" size={18} />
            <span className="text-sm font-medium">Dashboard</span>
          </button>
          <button className="w-full px-6 py-2.5 flex items-center gap-3 text-zinc-400 hover:text-white hover:bg-white/5 transition-colors">
            <Icon name="Swords" size={18} />
            <span className="text-sm font-medium">Attacks</span>
          </button>
          <button className="w-full px-6 py-2.5 flex items-center gap-3 text-zinc-400 hover:text-white hover:bg-white/5 transition-colors">
            <Icon name="FileText" size={18} />
            <span className="text-sm font-medium">Documentation</span>
          </button>

          <div className="px-4 mt-6 mb-4">
            <span className="text-xs text-zinc-500 uppercase font-medium">Billing</span>
          </div>
          <button className="w-full px-6 py-2.5 flex items-center gap-3 text-zinc-400 hover:text-white hover:bg-white/5 transition-colors">
            <Icon name="CreditCard" size={18} />
            <span className="text-sm font-medium">Plans</span>
          </button>
          <button className="w-full px-6 py-2.5 flex items-center gap-3 text-zinc-400 hover:text-white hover:bg-white/5 transition-colors">
            <Icon name="DollarSign" size={18} />
            <span className="text-sm font-medium">Deposit</span>
          </button>
        </nav>

        <div className="border-t border-white/10">
          <button className="w-full px-6 py-3 flex items-center gap-3 text-zinc-400 hover:text-white hover:bg-white/5 transition-colors">
            <Icon name="Send" size={18} />
            <span className="text-sm font-medium">Telegram</span>
          </button>
          <button className="w-full px-6 py-3 flex items-center gap-3 text-zinc-400 hover:text-white hover:bg-white/5 transition-colors">
            <Icon name="FileCheck" size={18} />
            <span className="text-sm font-medium">Terms</span>
          </button>
        </div>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white text-sm font-medium">
                {currentUser.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="text-sm text-white font-medium">{currentUser}</div>
                <div className="text-xs text-zinc-500">Balance: {balance} $</div>
              </div>
            </div>
            <button onClick={onLogout} className="text-zinc-400 hover:text-white transition-colors">
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