import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

interface User {
  username: string;
  balance: number;
}

export default function AdminBalance() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState('');
  const [amount, setAmount] = useState('');

  const currentUser = localStorage.getItem('current_user');
  const adminKey = localStorage.getItem('admin_key');

  useEffect(() => {
    if (!currentUser || !adminKey) {
      navigate('/');
      return;
    }
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://functions.poehali.dev/9a41fb04-1027-4f22-b119-794df42bdde1', {
        method: 'GET',
        headers: {
          'X-Admin-Key': adminKey || ''
        }
      });

      if (!response.ok) {
        throw new Error('Failed to load users');
      }

      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load users',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddBalance = async () => {
    if (!selectedUser || !amount) {
      toast({
        title: 'Error',
        description: 'Please select user and enter amount',
        variant: 'destructive'
      });
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum)) {
      toast({
        title: 'Error',
        description: 'Invalid amount',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://functions.poehali.dev/9a41fb04-1027-4f22-b119-794df42bdde1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Key': adminKey || ''
        },
        body: JSON.stringify({
          username: selectedUser,
          amount: amountNum
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add balance');
      }

      toast({
        title: 'Success',
        description: `Added $${amountNum} to ${selectedUser}`
      });

      setSelectedUser('');
      setAmount('');
      await loadUsers();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add balance',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser || !adminKey) {
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
        <div className="p-8">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Manage User Balances</h1>
                <p className="text-zinc-400 mt-2">Add balance to users for purchasing plans</p>
              </div>
              <button
                onClick={() => navigate('/admin')}
                className="bg-zinc-700 text-white px-4 py-2 rounded-md hover:bg-zinc-600 transition-colors flex items-center gap-2"
              >
                <Icon name="ArrowLeft" size={16} />
                Back to Admin
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-card border border-zinc-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Add Balance</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">User</label>
                  <select
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    className="w-full h-10 px-3 bg-zinc-900/50 border border-zinc-800 rounded-md text-white focus:outline-none focus:border-zinc-700"
                  >
                    <option value="">Select user</option>
                    {users.map(user => (
                      <option key={user.username} value={user.username}>
                        {user.username} (Current: ${user.balance})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Amount ($)</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full h-10 px-3 bg-zinc-900/50 border border-zinc-800 rounded-md text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-700"
                  />
                </div>

                <button
                  onClick={handleAddBalance}
                  disabled={loading}
                  className="w-full px-6 py-2 bg-zinc-700 text-white rounded-md font-medium hover:bg-zinc-600 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Add Balance'}
                </button>
              </div>
            </div>

            <div className="bg-card border border-zinc-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">All Users</h2>
                <button
                  onClick={loadUsers}
                  disabled={loading}
                  className="px-4 py-1 text-sm bg-zinc-800 text-white rounded hover:bg-zinc-700 transition-colors disabled:opacity-50"
                >
                  Refresh
                </button>
              </div>

              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {loading ? (
                  <p className="text-zinc-400 text-center py-8">Loading...</p>
                ) : users.length === 0 ? (
                  <p className="text-zinc-400 text-center py-8">No users found</p>
                ) : (
                  users.map(user => (
                    <div
                      key={user.username}
                      className="flex items-center justify-between p-3 bg-zinc-900/50 border border-zinc-800 rounded-md"
                    >
                      <span className="font-medium">{user.username}</span>
                      <span className="text-zinc-400">${user.balance.toFixed(2)}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}