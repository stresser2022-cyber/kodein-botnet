import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminFilters from '@/components/admin/AdminFilters';
import AdminUsersTable, { User } from '@/components/admin/AdminUsersTable';
import AdminAnnouncements from '@/components/admin/AdminAnnouncements';
import AdminAnnouncementsList from '@/components/admin/AdminAnnouncementsList';

export default function Admin() {
  const [adminKey, setAdminKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<Set<number>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [announcementsRefresh, setAnnouncementsRefresh] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();

  const API_URL = 'https://functions.poehali.dev/ea2e0a89-2830-4344-8e0b-06e2d82e72b5';

  useEffect(() => {
    const savedKey = localStorage.getItem('admin_key');
    if (savedKey) {
      setAdminKey(savedKey);
      verifyAndFetchUsers(savedKey);
    }
  }, []);

  const verifyAndFetchUsers = async (key: string) => {
    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          'X-Admin-Key': key
        }
      });

      if (!response.ok) {
        setIsAuthenticated(false);
        localStorage.removeItem('admin_key');
        toast({
          title: 'Session Expired',
          description: 'Please log in again',
          variant: 'destructive'
        });
        return;
      }

      const data = await response.json();
      setUsers(data.users);
      setTotal(data.total);
      setIsAuthenticated(true);
    } catch (error) {
      setIsAuthenticated(false);
      localStorage.removeItem('admin_key');
      toast({
        title: 'Error',
        description: 'Authentication failed',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

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

  const handleToggleStatus = async (userId: number, currentStatus: boolean) => {
    const action = currentStatus ? 'deactivate' : 'activate';
    
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'X-Admin-Key': adminKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: userId,
          action: action
        })
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: 'Error',
          description: data.error || 'Failed to update user status',
          variant: 'destructive'
        });
        return;
      }

      toast({
        title: 'Success',
        description: data.message || 'User status updated successfully'
      });

      fetchUsers(adminKey);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Network error',
        variant: 'destructive'
      });
    }
  };

  const handleUpdatePlan = async (userId: number, plan: string, days: number) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'X-Admin-Key': adminKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: userId,
          action: 'update_plan',
          plan: plan,
          days: days
        })
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: 'Error',
          description: data.error || 'Failed to update plan',
          variant: 'destructive'
        });
        return;
      }

      toast({
        title: 'Success',
        description: `Plan updated to ${plan}${days > 0 ? ` for ${days} days` : ''}`
      });

      fetchUsers(adminKey);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Network error',
        variant: 'destructive'
      });
    }
  };

  const handleSelectUser = (userId: number) => {
    setSelectedUsers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toString().includes(searchTerm);
    
    const matchesStatus = 
      statusFilter === 'all' ||
      (statusFilter === 'active' && user.is_active) ||
      (statusFilter === 'inactive' && !user.is_active);
    
    return matchesSearch && matchesStatus;
  });

  const handleSelectAll = () => {
    const visibleUserIds = filteredUsers.map(u => u.id);
    if (selectedUsers.size === filteredUsers.length && filteredUsers.length > 0) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(visibleUserIds));
    }
  };

  const handleBulkAction = async (action: 'activate' | 'deactivate') => {
    if (selectedUsers.size === 0) {
      toast({
        title: 'Warning',
        description: 'Please select at least one user',
        variant: 'destructive'
      });
      return;
    }

    setIsProcessing(true);
    let successCount = 0;
    let failCount = 0;

    for (const userId of selectedUsers) {
      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'X-Admin-Key': adminKey,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            user_id: userId,
            action: action
          })
        });

        if (response.ok) {
          successCount++;
        } else {
          failCount++;
        }
      } catch (error) {
        failCount++;
      }
    }

    setIsProcessing(false);
    setSelectedUsers(new Set());

    if (failCount === 0) {
      toast({
        title: 'Success',
        description: `${successCount} user(s) ${action}d successfully`
      });
    } else {
      toast({
        title: 'Partial Success',
        description: `${successCount} succeeded, ${failCount} failed`,
        variant: 'destructive'
      });
    }

    fetchUsers(adminKey);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      const response = await fetch(`${API_URL}?id=${userId}`, {
        method: 'DELETE',
        headers: {
          'X-Admin-Key': adminKey
        }
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: 'Error',
          description: data.error || 'Failed to delete user',
          variant: 'destructive'
        });
        return;
      }

      toast({
        title: 'Success',
        description: 'User deleted successfully'
      });

      fetchUsers(adminKey);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Network error',
        variant: 'destructive'
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <AdminLogin 
        adminKey={adminKey}
        setAdminKey={setAdminKey}
        onLogin={handleLogin}
      />
    );
  }

  return (
    <div className="min-h-screen w-full bg-black">
      <AdminHeader
        onRefresh={() => fetchUsers(adminKey)}
        onHome={() => navigate('/')}
        onLogout={handleLogout}
        loading={loading}
      />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <AdminAnnouncements
          adminKey={adminKey}
          onSuccess={() => {
            toast({
              title: 'Success',
              description: 'Announcement published successfully'
            });
          }}
          onError={(message) => {
            toast({
              title: 'Error',
              description: message,
              variant: 'destructive'
            });
          }}
          onPublished={() => setAnnouncementsRefresh(prev => prev + 1)}
        />

        <AdminAnnouncementsList
          adminKey={adminKey}
          refreshTrigger={announcementsRefresh}
          onSuccess={() => {
            toast({
              title: 'Success',
              description: 'Announcement deleted successfully'
            });
          }}
          onError={(message) => {
            toast({
              title: 'Error',
              description: message,
              variant: 'destructive'
            });
          }}
        />

        <AdminFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          filteredCount={filteredUsers.length}
          totalCount={total}
          selectedCount={selectedUsers.size}
          isProcessing={isProcessing}
          onBulkActivate={() => handleBulkAction('activate')}
          onBulkDeactivate={() => handleBulkAction('deactivate')}
        />

        <AdminUsersTable
          users={filteredUsers}
          selectedUsers={selectedUsers}
          onSelectUser={handleSelectUser}
          onSelectAll={handleSelectAll}
          onToggleStatus={handleToggleStatus}
          onUpdatePlan={handleUpdatePlan}
          onDeleteUser={handleDeleteUser}
          formatDate={formatDate}
          loading={loading}
          hasNoUsers={users.length === 0}
          hasNoFilteredUsers={filteredUsers.length === 0}
          onClearFilters={handleClearFilters}
        />
      </main>
    </div>
  );
}