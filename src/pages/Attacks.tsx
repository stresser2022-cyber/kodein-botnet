import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import AttackForm from '@/components/attacks/AttackForm';
import AttackTable from '@/components/attacks/AttackTable';
import { useAttacks } from '@/hooks/useAttacks';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

export default function Attacks() {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [target, setTarget] = useState('');
  const [port, setPort] = useState('');
  const [duration, setDuration] = useState('');
  const [method, setMethod] = useState('');
  const [concurrents, setConcurrents] = useState(1);
  const [filterTarget, setFilterTarget] = useState('');

  const currentUser = localStorage.getItem('current_user');

  if (!currentUser) {
    navigate('/');
    return null;
  }

  const {
    attacks,
    loading,
    userPlan,
    planLimits,
    launchAttack,
    stopAllAttacks
  } = useAttacks(currentUser);

  const handleLaunchAttack = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    const success = await launchAttack(target, port, duration, method);
    
    if (success) {
      setTarget('');
      setPort('');
      setDuration('');
      setMethod('');
    }
  };

  useKeyboardShortcuts([
    {
      key: 'Enter',
      ctrl: true,
      action: () => handleLaunchAttack(),
      description: 'Launch Attack'
    },
    {
      key: 'x',
      ctrl: true,
      shift: true,
      action: stopAllAttacks,
      description: 'Stop All Attacks'
    }
  ]);

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
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="w-full grid grid-cols-1 gap-4 px-4 md:grid-cols-[minmax(0,0.999fr)_minmax(0,2fr)] md:gap-6 md:px-6 py-4 md:py-6">
            
            <AttackForm
              target={target}
              setTarget={setTarget}
              port={port}
              setPort={setPort}
              duration={duration}
              setDuration={setDuration}
              method={method}
              setMethod={setMethod}
              concurrents={concurrents}
              setConcurrents={setConcurrents}
              loading={loading}
              onSubmit={handleLaunchAttack}
              userPlan={userPlan}
              planLimits={planLimits}
            />

            <AttackTable
              attacks={attacks}
              filterTarget={filterTarget}
              setFilterTarget={setFilterTarget}
              loading={loading}
              onStopAll={stopAllAttacks}
            />

          </div>
        </div>
      </div>
    </div>
  );
}