import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

export default function Settings() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  const currentUser = localStorage.getItem('current_user');
  const userId = localStorage.getItem('kodein_user_id');

  if (!currentUser) {
    navigate('/');
    return null;
  }

  const [email, setEmail] = useState('user@example.com');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [notifications, setNotifications] = useState({
    email: true,
    telegram: false,
    attackComplete: true,
    planExpiry: true,
    newsletter: false
  });

  const handleUpdateEmail = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Success',
      description: 'Email updated successfully'
    });
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: 'Error',
        description: 'Please fill in all password fields',
        variant: 'destructive'
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: 'Error',
        description: 'New passwords do not match',
        variant: 'destructive'
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: 'Error',
        description: 'Password must be at least 8 characters',
        variant: 'destructive'
      });
      return;
    }

    toast({
      title: 'Success',
      description: 'Password changed successfully'
    });

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      localStorage.clear();
      toast({
        title: 'Account Deleted',
        description: 'Your account has been permanently deleted'
      });
      setTimeout(() => navigate('/'), 1000);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white">
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
            <h1 className="text-3xl font-bold mb-2">Account Settings</h1>
            <p className="text-gray-400">Manage your account preferences and security</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-[#0f0f0f] border border-gray-800 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Icon name="User" size={24} className="text-purple-400" />
                  <h2 className="text-xl font-semibold">Profile Information</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-300">Username</Label>
                    <div className="mt-1 bg-black border border-gray-800 rounded-lg p-3 text-gray-400">
                      {currentUser}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Username cannot be changed</p>
                  </div>

                  <div>
                    <Label className="text-gray-300">User ID</Label>
                    <div className="mt-1 bg-black border border-gray-800 rounded-lg p-3 text-gray-400 font-mono text-sm">
                      {userId}
                    </div>
                  </div>

                  <form onSubmit={handleUpdateEmail}>
                    <Label htmlFor="email" className="text-gray-300">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1 bg-black border-gray-700 text-white"
                    />
                    <Button type="submit" className="mt-3 bg-purple-600 hover:bg-purple-700">
                      Update Email
                    </Button>
                  </form>
                </div>
              </div>

              <div className="bg-[#0f0f0f] border border-gray-800 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Icon name="Lock" size={24} className="text-purple-400" />
                  <h2 className="text-xl font-semibold">Change Password</h2>
                </div>

                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword" className="text-gray-300">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="mt-1 bg-black border-gray-700 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="newPassword" className="text-gray-300">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="mt-1 bg-black border-gray-700 text-white"
                    />
                    <p className="text-xs text-gray-500 mt-1">At least 8 characters</p>
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword" className="text-gray-300">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="mt-1 bg-black border-gray-700 text-white"
                    />
                  </div>

                  <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                    Change Password
                  </Button>
                </form>
              </div>

              <div className="bg-[#0f0f0f] border border-gray-800 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Icon name="Bell" size={24} className="text-purple-400" />
                  <h2 className="text-xl font-semibold">Notifications</h2>
                </div>

                <div className="space-y-4">
                  <label className="flex items-center justify-between p-3 bg-black border border-gray-800 rounded-lg cursor-pointer hover:border-gray-700 transition-colors">
                    <div>
                      <p className="font-medium text-white">Email Notifications</p>
                      <p className="text-xs text-gray-400">Receive notifications via email</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.email}
                      onChange={(e) => setNotifications({...notifications, email: e.target.checked})}
                      className="w-5 h-5"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 bg-black border border-gray-800 rounded-lg cursor-pointer hover:border-gray-700 transition-colors">
                    <div>
                      <p className="font-medium text-white">Telegram Notifications</p>
                      <p className="text-xs text-gray-400">Receive notifications via Telegram bot</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.telegram}
                      onChange={(e) => setNotifications({...notifications, telegram: e.target.checked})}
                      className="w-5 h-5"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 bg-black border border-gray-800 rounded-lg cursor-pointer hover:border-gray-700 transition-colors">
                    <div>
                      <p className="font-medium text-white">Attack Completion</p>
                      <p className="text-xs text-gray-400">Notify when attacks finish</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.attackComplete}
                      onChange={(e) => setNotifications({...notifications, attackComplete: e.target.checked})}
                      className="w-5 h-5"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 bg-black border border-gray-800 rounded-lg cursor-pointer hover:border-gray-700 transition-colors">
                    <div>
                      <p className="font-medium text-white">Plan Expiry Alerts</p>
                      <p className="text-xs text-gray-400">Notify before plan expires</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.planExpiry}
                      onChange={(e) => setNotifications({...notifications, planExpiry: e.target.checked})}
                      className="w-5 h-5"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 bg-black border border-gray-800 rounded-lg cursor-pointer hover:border-gray-700 transition-colors">
                    <div>
                      <p className="font-medium text-white">Newsletter</p>
                      <p className="text-xs text-gray-400">Receive updates and promotions</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.newsletter}
                      onChange={(e) => setNotifications({...notifications, newsletter: e.target.checked})}
                      className="w-5 h-5"
                    />
                  </label>
                </div>
              </div>

              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Icon name="AlertTriangle" size={24} className="text-red-400" />
                  <h2 className="text-xl font-semibold text-red-300">Danger Zone</h2>
                </div>

                <p className="text-sm text-gray-300 mb-4">
                  Once you delete your account, there is no going back. All your data, attack history, and plans will be permanently deleted.
                </p>

                <Button
                  onClick={handleDeleteAccount}
                  variant="destructive"
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Icon name="Trash2" size={16} className="mr-2" />
                  Delete Account
                </Button>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-[#0f0f0f] border border-gray-800 rounded-lg p-6 sticky top-8">
                <h2 className="text-xl font-semibold mb-6">Account Info</h2>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Current Plan</p>
                    <p className="text-lg font-semibold text-purple-400">Free Plan</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 mb-1">Balance</p>
                    <p className="text-lg font-semibold">€0.00</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 mb-1">Member Since</p>
                    <p className="text-sm">October 2025</p>
                  </div>

                  <div className="pt-4 border-t border-gray-800">
                    <p className="text-xs text-gray-400 mb-3">Quick Actions</p>
                    <div className="space-y-2">
                      <Button
                        onClick={() => navigate('/dashboard/plans')}
                        variant="outline"
                        className="w-full border-gray-700 hover:bg-gray-800"
                      >
                        <Icon name="CreditCard" size={16} className="mr-2" />
                        Upgrade Plan
                      </Button>
                      <Button
                        onClick={() => navigate('/dashboard/deposit')}
                        variant="outline"
                        className="w-full border-gray-700 hover:bg-gray-800"
                      >
                        <Icon name="Wallet" size={16} className="mr-2" />
                        Add Funds
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
