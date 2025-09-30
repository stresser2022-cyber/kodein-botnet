import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: number;
  username: string;
  email: string;
  created_at: string | null;
  last_login: string | null;
  is_active: boolean;
}

export default function Admin() {
  const [adminKey, setAdminKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const API_URL = 'https://functions.poehali.dev/ea2e0a89-2830-4344-8e0b-06e2d82e72b5';

  useEffect(() => {
    const savedKey = localStorage.getItem('admin_key');
    if (savedKey) {
      setAdminKey(savedKey);
      fetchUsers(savedKey);
    }
  }, []);

  const fetchUsers = async (key: string) => {
    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          'X-Admin-Key': key
        }
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: 'Error',
          description: data.error || 'Failed to fetch users',
          variant: 'destructive'
        });
        setIsAuthenticated(false);
        localStorage.removeItem('admin_key');
        return;
      }

      setUsers(data.users);
      setTotal(data.total);
      setIsAuthenticated(true);
      localStorage.setItem('admin_key', key);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Network error',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminKey) {
      toast({
        title: 'Error',
        description: 'Please enter admin key',
        variant: 'destructive'
      });
      return;
    }
    fetchUsers(adminKey);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_key');
    setIsAuthenticated(false);
    setAdminKey('');
    setUsers([]);
    navigate('/');
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full bg-black flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-black border border-white/20 rounded-lg p-8">
          <div className="flex items-center gap-2 mb-6">
            <Icon name="Shield" size={24} />
            <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm text-zinc-300 mb-2 block">Admin Key</label>
              <Input
                type="password"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                className="bg-white/5 border-white/20 text-white"
                placeholder="Enter admin key"
              />
            </div>
            <Button type="submit" className="w-full bg-white text-black hover:bg-white/90">
              Access Panel
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-black">
      <header className="border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon name="Shield" size={24} />
            <h1 className="text-xl font-bold text-white">Admin Panel</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchUsers(adminKey)}
              className="button-ghost px-4 py-2 rounded-md flex items-center gap-2"
              disabled={loading}
            >
              <Icon name="RefreshCw" size={16} />
              Refresh
            </button>
            <button
              onClick={() => navigate('/')}
              className="button-ghost px-4 py-2 rounded-md flex items-center gap-2"
            >
              <Icon name="Home" size={16} />
              Home
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <Icon name="LogOut" size={16} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Registered Users</h2>
          <p className="text-zinc-400">Total users: {total}</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <Icon name="Loader2" size={32} className="animate-spin mx-auto text-white" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12 text-zinc-400">
            No users registered yet
          </div>
        ) : (
          <div className="bg-white/5 border border-white/20 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider">
                      Username
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider">
                      Created At
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider">
                      Last Login
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        {user.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        {user.username}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-400">
                        {formatDate(user.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-400">
                        {formatDate(user.last_login)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.is_active ? (
                          <span className="px-2 py-1 text-xs font-medium bg-green-500/20 text-green-400 rounded-full">
                            Active
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-medium bg-red-500/20 text-red-400 rounded-full">
                            Inactive
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
