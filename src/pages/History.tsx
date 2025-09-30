import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import Icon from '@/components/ui/icon';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

interface Attack {
  id: number;
  target: string;
  port: number;
  method: string;
  duration: number;
  status: string;
  created_at: string;
  started_at?: string;
  expires_at?: string;
}

export default function History() {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [attacks, setAttacks] = useState<Attack[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const currentUser = localStorage.getItem('current_user');

  if (!currentUser) {
    navigate('/');
    return null;
  }

  const loadHistory = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://functions.poehali.dev/2cec0d22-6495-4fc9-83d1-0b97c37fac2b', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': currentUser
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAttacks(data.attacks || []);
      }
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAttacks = attacks
    .filter(a => {
      if (filter === 'active') return a.status === 'running';
      if (filter === 'completed') return a.status === 'completed';
      return true;
    })
    .filter(a => 
      searchTerm === '' || 
      a.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.method.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const exportData = (format: 'json' | 'csv') => {
    const dataToExport = filteredAttacks;
    
    if (format === 'json') {
      const jsonString = JSON.stringify(dataToExport, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `attacks_${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } else if (format === 'csv') {
      const headers = ['ID', 'Target', 'Port', 'Method', 'Duration', 'Status', 'Created'];
      const rows = dataToExport.map(a => [
        a.id,
        a.target,
        a.port,
        a.method,
        a.duration,
        a.status,
        a.created_at
      ]);
      
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `attacks_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  useKeyboardShortcuts([
    {
      key: 'r',
      ctrl: true,
      action: loadHistory,
      description: 'Refresh History'
    },
    {
      key: 'e',
      ctrl: true,
      action: () => exportData('json'),
      description: 'Export as JSON'
    },
    {
      key: 'e',
      ctrl: true,
      shift: true,
      action: () => exportData('csv'),
      description: 'Export as CSV'
    }
  ]);

  return (
    <div className="dark flex min-h-screen bg-[#0a0a0a] text-white">
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
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">История атак</h1>
            <p className="text-zinc-400">Полная история всех ваших атак</p>
          </div>

          <div className="bg-card rounded-xl border p-6">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <input 
                type="text"
                placeholder="Поиск по цели или методу..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 h-10 px-4 rounded-md border border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-700"
              />
              
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    filter === 'all' 
                      ? 'bg-zinc-700 text-white' 
                      : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
                  }`}
                >
                  Все
                </button>
                <button
                  onClick={() => setFilter('active')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    filter === 'active' 
                      ? 'bg-green-700 text-white' 
                      : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
                  }`}
                >
                  Активные
                </button>
                <button
                  onClick={() => setFilter('completed')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    filter === 'completed' 
                      ? 'bg-blue-700 text-white' 
                      : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
                  }`}
                >
                  Завершённые
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => exportData('json')}
                  className="px-3 py-2 rounded-md bg-blue-700 hover:bg-blue-600 text-white flex items-center gap-2"
                  title="Export as JSON"
                >
                  <Icon name="Download" size={16} />
                  <span className="hidden sm:inline">JSON</span>
                </button>
                <button
                  onClick={() => exportData('csv')}
                  className="px-3 py-2 rounded-md bg-green-700 hover:bg-green-600 text-white flex items-center gap-2"
                  title="Export as CSV"
                >
                  <Icon name="FileText" size={16} />
                  <span className="hidden sm:inline">CSV</span>
                </button>
                <button
                  onClick={loadHistory}
                  disabled={loading}
                  className="px-4 py-2 rounded-md bg-zinc-800 hover:bg-zinc-700 text-white flex items-center gap-2 disabled:opacity-50"
                >
                  <Icon name="RefreshCw" size={16} className={loading ? 'animate-spin' : ''} />
                  <span className="hidden sm:inline">Обновить</span>
                </button>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12 text-zinc-400">
                Загрузка...
              </div>
            ) : filteredAttacks.length === 0 ? (
              <div className="text-center py-12 text-zinc-400">
                <Icon name="Inbox" size={48} className="mx-auto mb-4 opacity-50" />
                <p>Атаки не найдены</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-zinc-800 text-left">
                      <th className="pb-3 pl-4 font-medium text-zinc-400">ID</th>
                      <th className="pb-3 font-medium text-zinc-400">Цель</th>
                      <th className="pb-3 font-medium text-zinc-400">Порт</th>
                      <th className="pb-3 font-medium text-zinc-400">Метод</th>
                      <th className="pb-3 font-medium text-zinc-400">Длительность</th>
                      <th className="pb-3 font-medium text-zinc-400">Статус</th>
                      <th className="pb-3 font-medium text-zinc-400">Запущена</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAttacks.map((attack) => (
                      <tr key={attack.id} className="border-b border-zinc-800 hover:bg-zinc-900/50">
                        <td className="py-3 pl-4 text-zinc-500">#{attack.id}</td>
                        <td className="py-3 font-mono text-sm">{attack.target}</td>
                        <td className="py-3 text-zinc-400">{attack.port}</td>
                        <td className="py-3">
                          <span className="px-2 py-1 rounded bg-zinc-800 text-xs font-mono">
                            {attack.method.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 text-zinc-400">{attack.duration}s</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            attack.status === 'running' 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-blue-500/20 text-blue-400'
                          }`}>
                            {attack.status === 'running' ? 'Активна' : 'Завершена'}
                          </span>
                        </td>
                        <td className="py-3 text-zinc-400 text-sm">
                          {formatDate(attack.started_at || attack.created_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="mt-6 flex justify-between items-center text-sm text-zinc-400">
              <div>Всего атак: {filteredAttacks.length}</div>
              <div>Активных: {attacks.filter(a => a.status === 'running').length}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}