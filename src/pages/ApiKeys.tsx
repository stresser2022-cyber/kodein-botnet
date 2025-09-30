import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  created: string;
  lastUsed: string | null;
  permissions: string[];
  status: 'active' | 'disabled';
}

export default function ApiKeys() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: '1',
      name: 'Production API',
      key: 'kdn_prod_8f7a9b2c4d5e6f1a2b3c4d5e6f7a8b9c',
      created: '2025-09-15',
      lastUsed: '2025-10-01 14:32:00',
      permissions: ['attack.launch', 'attack.stop', 'attack.list'],
      status: 'active'
    },
    {
      id: '2',
      name: 'Testing Key',
      key: 'kdn_test_1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d',
      created: '2025-09-20',
      lastUsed: null,
      permissions: ['attack.launch', 'attack.list'],
      status: 'active'
    }
  ]);
  const [isCreating, setIsCreating] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);

  const currentUser = localStorage.getItem('current_user');

  if (!currentUser) {
    navigate('/');
    return null;
  }

  const availablePermissions = [
    { id: 'attack.launch', name: 'Launch Attacks', description: 'Create new attack jobs' },
    { id: 'attack.stop', name: 'Stop Attacks', description: 'Terminate running attacks' },
    { id: 'attack.list', name: 'List Attacks', description: 'View attack history and status' },
    { id: 'account.read', name: 'Read Account', description: 'View account information' },
    { id: 'billing.read', name: 'Read Billing', description: 'View billing information' }
  ];

  const handleCreateKey = () => {
    if (!newKeyName.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a name for the API key',
        variant: 'destructive'
      });
      return;
    }

    if (selectedPermissions.length === 0) {
      toast({
        title: 'Error',
        description: 'Please select at least one permission',
        variant: 'destructive'
      });
      return;
    }

    const newKey = `kdn_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    const newApiKey: ApiKey = {
      id: Date.now().toString(),
      name: newKeyName,
      key: newKey,
      created: new Date().toISOString().split('T')[0],
      lastUsed: null,
      permissions: selectedPermissions,
      status: 'active'
    };

    setApiKeys([...apiKeys, newApiKey]);
    setNewlyCreatedKey(newKey);
    setNewKeyName('');
    setSelectedPermissions([]);

    toast({
      title: 'Success',
      description: 'API key created successfully'
    });
  };

  const handleDeleteKey = (id: string) => {
    setApiKeys(apiKeys.filter(key => key.id !== id));
    toast({
      title: 'Deleted',
      description: 'API key has been deleted'
    });
  };

  const handleToggleStatus = (id: string) => {
    setApiKeys(apiKeys.map(key => 
      key.id === id 
        ? { ...key, status: key.status === 'active' ? 'disabled' : 'active' }
        : key
    ));
    toast({
      title: 'Updated',
      description: 'API key status changed'
    });
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast({
      title: 'Copied',
      description: 'API key copied to clipboard'
    });
  };

  const togglePermission = (permId: string) => {
    if (selectedPermissions.includes(permId)) {
      setSelectedPermissions(selectedPermissions.filter(p => p !== permId));
    } else {
      setSelectedPermissions([...selectedPermissions, permId]);
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
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">API Keys</h1>
              <p className="text-gray-400">Manage your API access keys and permissions</p>
            </div>
            
            <Dialog open={isCreating} onOpenChange={setIsCreating}>
              <DialogTrigger asChild>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Icon name="Plus" size={16} className="mr-2" />
                  Create New Key
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#0f0f0f] border-gray-800 text-white">
                <DialogHeader>
                  <DialogTitle>Create New API Key</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Generate a new API key with specific permissions
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="keyName" className="text-gray-300">Key Name</Label>
                    <Input
                      id="keyName"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      placeholder="Production API, Testing, etc."
                      className="mt-1 bg-black border-gray-700 text-white"
                    />
                  </div>

                  <div>
                    <Label className="text-gray-300 mb-3 block">Permissions</Label>
                    <div className="space-y-2">
                      {availablePermissions.map((perm) => (
                        <label
                          key={perm.id}
                          className="flex items-start gap-3 p-3 bg-black border border-gray-800 rounded-lg cursor-pointer hover:border-purple-500 transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={selectedPermissions.includes(perm.id)}
                            onChange={() => togglePermission(perm.id)}
                            className="mt-1"
                          />
                          <div>
                            <p className="font-medium text-white">{perm.name}</p>
                            <p className="text-xs text-gray-400">{perm.description}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <Button 
                    onClick={handleCreateKey}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    Generate API Key
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {newlyCreatedKey && (
            <div className="mb-6 bg-green-900/20 border border-green-500/30 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <Icon name="CheckCircle" size={24} className="text-green-400 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold text-green-300 mb-2">API Key Created Successfully!</h3>
                  <p className="text-sm text-gray-300 mb-3">
                    ⚠️ Make sure to copy your API key now. You won't be able to see it again!
                  </p>
                  <div className="flex items-center gap-2 bg-black border border-gray-800 rounded-lg p-3">
                    <code className="flex-1 text-sm font-mono text-white break-all">
                      {newlyCreatedKey}
                    </code>
                    <Button
                      size="sm"
                      onClick={() => handleCopyKey(newlyCreatedKey)}
                      className="flex-shrink-0"
                    >
                      <Icon name="Copy" size={16} />
                    </Button>
                  </div>
                  <Button
                    onClick={() => setNewlyCreatedKey(null)}
                    size="sm"
                    variant="ghost"
                    className="mt-3 text-gray-400 hover:text-white"
                  >
                    I've saved my key
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="grid gap-4">
            {apiKeys.map((apiKey) => (
              <div key={apiKey.id} className="bg-[#0f0f0f] border border-gray-800 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">{apiKey.name}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        apiKey.status === 'active' 
                          ? 'bg-green-900/30 text-green-400' 
                          : 'bg-red-900/30 text-red-400'
                      }`}>
                        {apiKey.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">
                      Created: {apiKey.created} • Last used: {apiKey.lastUsed || 'Never'}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleStatus(apiKey.id)}
                      className="border-gray-700 hover:bg-gray-800"
                    >
                      <Icon name={apiKey.status === 'active' ? 'Ban' : 'CheckCircle'} size={16} className="mr-1" />
                      {apiKey.status === 'active' ? 'Disable' : 'Enable'}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteKey(apiKey.id)}
                    >
                      <Icon name="Trash2" size={16} />
                    </Button>
                  </div>
                </div>

                <div className="mb-4">
                  <Label className="text-gray-400 text-xs mb-2 block">API Key</Label>
                  <div className="flex items-center gap-2 bg-black border border-gray-800 rounded-lg p-3">
                    <code className="flex-1 text-sm font-mono text-gray-400">
                      {apiKey.key.substring(0, 20)}••••••••••••••••
                    </code>
                    <Button
                      size="sm"
                      onClick={() => handleCopyKey(apiKey.key)}
                    >
                      <Icon name="Copy" size={16} />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-gray-400 text-xs mb-2 block">Permissions</Label>
                  <div className="flex flex-wrap gap-2">
                    {apiKey.permissions.map((perm) => {
                      const permInfo = availablePermissions.find(p => p.id === perm);
                      return (
                        <span 
                          key={perm}
                          className="px-3 py-1 bg-purple-900/30 text-purple-400 rounded-full text-xs font-medium"
                        >
                          {permInfo?.name || perm}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-[#0f0f0f] border border-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Icon name="Code" size={24} className="text-purple-400" />
              API Usage Examples
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-300 mb-2">Launch Attack</h3>
                <pre className="bg-black border border-gray-800 rounded-lg p-4 overflow-x-auto">
                  <code className="text-sm text-gray-300 font-mono">{`curl -X POST https://api.kodein.services/v1/attack \\
  -H "X-Api-Key: YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "target": "192.168.1.1",
    "port": 80,
    "method": "UDP",
    "duration": 60
  }'`}</code>
                </pre>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-300 mb-2">List Active Attacks</h3>
                <pre className="bg-black border border-gray-800 rounded-lg p-4 overflow-x-auto">
                  <code className="text-sm text-gray-300 font-mono">{`curl -X GET https://api.kodein.services/v1/attacks \\
  -H "X-Api-Key: YOUR_API_KEY"`}</code>
                </pre>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-300 mb-2">Stop Attack</h3>
                <pre className="bg-black border border-gray-800 rounded-lg p-4 overflow-x-auto">
                  <code className="text-sm text-gray-300 font-mono">{`curl -X DELETE https://api.kodein.services/v1/attack/ATTACK_ID \\
  -H "X-Api-Key: YOUR_API_KEY"`}</code>
                </pre>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-800">
              <p className="text-sm text-gray-400">
                <Icon name="Info" size={16} className="inline mr-1 text-purple-400" />
                For detailed API documentation, visit the <a href="/dashboard/docs" className="text-purple-400 hover:underline">Documentation</a> page.
              </p>
            </div>
          </div>

          <div className="mt-6 bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <Icon name="AlertTriangle" size={24} className="text-yellow-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-yellow-300 mb-2">Security Best Practices</h3>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Never share your API keys publicly or commit them to version control</li>
                  <li>• Rotate API keys regularly (every 90 days recommended)</li>
                  <li>• Use different keys for production and testing environments</li>
                  <li>• Grant only the minimum permissions necessary for each key</li>
                  <li>• Disable or delete unused API keys immediately</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
