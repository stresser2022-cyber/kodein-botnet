import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardStats from '@/components/dashboard/DashboardStats';
import DashboardAnnouncements from '@/components/dashboard/DashboardAnnouncements';
import DashboardPlan from '@/components/dashboard/DashboardPlan';

export default function Dashboard() {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const currentUser = localStorage.getItem('current_user');

  if (!currentUser) {
    navigate('/');
    return null;
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <DashboardSidebar 
        currentUser={currentUser}
        collapsed={sidebarCollapsed} 
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        onLogout={() => {
          localStorage.clear();
          navigate('/');
        }}
      />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        <header className="border-b border-border px-8 py-6">
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        </header>

        <main className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 space-y-6">
              <DashboardStats />
              <DashboardAnnouncements />
            </div>
            <div>
              <DashboardPlan currentUser={currentUser} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}