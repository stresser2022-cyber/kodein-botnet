import DashboardLayout from '@/components/layout/DashboardLayout';
import DashboardStats from '@/components/dashboard/DashboardStats';
import DashboardAnnouncements from '@/components/dashboard/DashboardAnnouncements';
import DashboardPlan from '@/components/dashboard/DashboardPlan';

export default function Dashboard() {
  const currentUser = localStorage.getItem('current_user') || '';

  return (
    <DashboardLayout>
      <header className="border-b border-white/10 px-8 py-6">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
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
    </DashboardLayout>
  );
}
