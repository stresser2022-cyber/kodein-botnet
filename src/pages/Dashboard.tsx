import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardStats from '@/components/dashboard/DashboardStats';
import DashboardAnnouncements from '@/components/dashboard/DashboardAnnouncements';
import DashboardInfo from '@/components/dashboard/DashboardInfo';
import DashboardPlan from '@/components/dashboard/DashboardPlan';

export default function Dashboard() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('current_user');
    if (!user) {
      navigate('/');
      return;
    }
    setCurrentUser(user);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('current_user');
    navigate('/');
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen w-full bg-black flex">
      <DashboardSidebar
        currentUser={currentUser}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        onLogout={handleLogout}
      />

      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        <header className="border-b border-white/10 px-8 py-6">
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        </header>

        <main className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
            <div className="lg:col-span-3">
              <DashboardStats />
            </div>
            <div>
              <DashboardPlan currentUser={currentUser} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <DashboardAnnouncements />
            </div>
            <div>
              <DashboardInfo currentUser={currentUser} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}