import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

export default function Attacks() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [target, setTarget] = useState('');
  const [port, setPort] = useState('');
  const [duration, setDuration] = useState('30');
  const [method, setMethod] = useState('UDP');
  const [attacks, setAttacks] = useState([
    { id: 1, target: '192.168.1.1', port: 80, method: 'TCP', duration: 60, status: 'running', startTime: '2025-10-01 12:30:00' },
    { id: 2, target: 'example.com', port: 443, method: 'UDP', duration: 120, status: 'completed', startTime: '2025-10-01 11:15:00' },
  ]);

  const currentUser = localStorage.getItem('current_user');

  if (!currentUser) {
    navigate('/');
    return null;
  }

  const handleLaunchAttack = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!target || !port || !duration) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive'
      });
      return;
    }

    const newAttack = {
      id: Date.now(),
      target,
      port: parseInt(port),
      method,
      duration: parseInt(duration),
      status: 'running',
      startTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    setAttacks([newAttack, ...attacks]);
    
    toast({
      title: 'Success',
      description: `Attack launched on ${target}:${port}`
    });

    setTarget('');
    setPort('');
    setDuration('30');
  };

  const handleStopAttack = (id: number) => {
    setAttacks(attacks.map(a => a.id === id ? { ...a, status: 'stopped' } : a));
    toast({
      title: 'Stopped',
      description: 'Attack has been stopped'
    });
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
            <h1 className="text-3xl font-bold mb-2">Launch Attack</h1>
            <p className="text-gray-400">Configure and launch your DDoS attacks</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-[#0f0f0f] border border-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-6">Attack Configuration</h2>
                
                <form onSubmit={handleLaunchAttack} className="space-y-4">
                  <div>
                    <Label htmlFor="target" className="text-gray-300">Target IP/Domain</Label>
                    <Input
                      id="target"
                      value={target}
                      onChange={(e) => setTarget(e.target.value)}
                      placeholder="192.168.1.1 or example.com"
                      className="mt-1 bg-black border-gray-700 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="port" className="text-gray-300">Port</Label>
                    <Input
                      id="port"
                      type="number"
                      value={port}
                      onChange={(e) => setPort(e.target.value)}
                      placeholder="80"
                      className="mt-1 bg-black border-gray-700 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="method" className="text-gray-300">Method</Label>
                    <Select value={method} onValueChange={setMethod}>
                      <SelectTrigger className="mt-1 bg-black border-gray-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UDP">UDP Flood</SelectItem>
                        <SelectItem value="TCP">TCP SYN</SelectItem>
                        <SelectItem value="HTTP">HTTP Flood</SelectItem>
                        <SelectItem value="ICMP">ICMP Flood</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="duration" className="text-gray-300">Duration (seconds)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="30"
                      className="mt-1 bg-black border-gray-700 text-white"
                    />
                  </div>

                  <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                    <Icon name="Zap" size={16} className="mr-2" />
                    Launch Attack
                  </Button>
                </form>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-[#0f0f0f] border border-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-6">Active & Recent Attacks</h2>
                
                <div className="space-y-3">
                  {attacks.map((attack) => (
                    <div key={attack.id} className="bg-black border border-gray-800 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              attack.status === 'running' ? 'bg-green-900/30 text-green-400' :
                              attack.status === 'completed' ? 'bg-blue-900/30 text-blue-400' :
                              'bg-red-900/30 text-red-400'
                            }`}>
                              {attack.status.toUpperCase()}
                            </span>
                            <span className="text-sm text-gray-400">{attack.startTime}</span>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-gray-400">Target:</span>
                              <p className="font-mono text-white">{attack.target}</p>
                            </div>
                            <div>
                              <span className="text-gray-400">Port:</span>
                              <p className="font-mono text-white">{attack.port}</p>
                            </div>
                            <div>
                              <span className="text-gray-400">Method:</span>
                              <p className="font-mono text-purple-400">{attack.method}</p>
                            </div>
                            <div>
                              <span className="text-gray-400">Duration:</span>
                              <p className="font-mono text-white">{attack.duration}s</p>
                            </div>
                          </div>
                        </div>
                        
                        {attack.status === 'running' && (
                          <Button
                            onClick={() => handleStopAttack(attack.id)}
                            size="sm"
                            variant="destructive"
                            className="ml-4"
                          >
                            <Icon name="StopCircle" size={16} className="mr-1" />
                            Stop
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}