import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

interface Attack {
  id: number;
  target: string;
  port: number;
  method: string;
  expire: string;
  status: string;
}

export default function Attacks() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [target, setTarget] = useState('');
  const [port, setPort] = useState('');
  const [duration, setDuration] = useState('');
  const [method, setMethod] = useState('');
  const [concurrents, setConcurrents] = useState(1);
  const [filterTarget, setFilterTarget] = useState('');
  const [attacks, setAttacks] = useState<Attack[]>([]);

  const currentUser = localStorage.getItem('current_user');

  if (!currentUser) {
    navigate('/');
    return null;
  }

  const handleLaunchAttack = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!target || !port || !duration || !method) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive'
      });
      return;
    }

    const newAttack: Attack = {
      id: Date.now(),
      target,
      port: parseInt(port),
      method,
      expire: new Date(Date.now() + parseInt(duration) * 1000).toLocaleString(),
      status: 'running'
    };

    setAttacks([newAttack, ...attacks]);
    
    toast({
      title: 'Success',
      description: `Attack launched on ${target}:${port}`
    });

    setTarget('');
    setPort('');
    setDuration('');
    setMethod('');
  };

  const handleStopAll = () => {
    setAttacks(attacks.map(a => ({ ...a, status: 'stopped' })));
    toast({
      title: 'Stopped',
      description: 'All attacks have been stopped'
    });
  };

  const filteredAttacks = attacks.filter(a => 
    filterTarget === '' || a.target.toLowerCase().includes(filterTarget.toLowerCase())
  );

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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-card rounded-xl border border-border py-6 shadow-sm">
              <div className="px-6 pb-6">
                <h2 className="text-xl font-semibold mb-1">Panel</h2>
                <p className="text-sm text-muted-foreground mb-6">Launch new attack in one click.</p>
              </div>
              <div className="px-6">
              <form onSubmit={handleLaunchAttack} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="target" className="text-sm text-white mb-2 block">Target</Label>
                    <Input
                      id="target"
                      value={target}
                      onChange={(e) => setTarget(e.target.value)}
                      placeholder="1.1.1.1"
                      className="bg-transparent border-input text-white placeholder:text-muted-foreground focus-visible:ring-ring/50"
                    />
                  </div>

                  <div>
                    <Label htmlFor="port" className="text-sm text-white mb-2 block">Port</Label>
                    <Input
                      id="port"
                      type="number"
                      value={port}
                      onChange={(e) => setPort(e.target.value)}
                      placeholder="443"
                      className="bg-transparent border-input text-white placeholder:text-muted-foreground focus-visible:ring-ring/50"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="duration" className="text-sm text-white mb-2 block">Duration</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="1200"
                    className="bg-transparent border-input text-white placeholder:text-muted-foreground focus-visible:ring-ring/50"
                  />
                </div>

                <div>
                  <Label htmlFor="method" className="text-sm text-white mb-2 block">Method</Label>
                  <Select value={method} onValueChange={setMethod}>
                    <SelectTrigger className="bg-transparent border-input text-white">
                      <SelectValue placeholder="Select a method" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border text-white max-h-60">
                      <SelectItem value="dns">dns</SelectItem>
                      <SelectItem value="udp">udp</SelectItem>
                      <SelectItem value="pps">pps</SelectItem>
                      <SelectItem value="tcp">tcp</SelectItem>
                      <SelectItem value="tcpdrop">tcpdrop</SelectItem>
                      <SelectItem value="fivem">fivem</SelectItem>
                      <SelectItem value="discord">discord</SelectItem>
                      <SelectItem value="rand">rand</SelectItem>
                      <SelectItem value="ack">ack</SelectItem>
                      <SelectItem value="socket">socket</SelectItem>
                      <SelectItem value="syn">syn</SelectItem>
                      <SelectItem value="gudp">gudp</SelectItem>
                      <SelectItem value="udpbypass">udpbypass</SelectItem>
                      <SelectItem value="tcp-spoof">tcp-spoof</SelectItem>
                      <SelectItem value="ovh">ovh</SelectItem>
                      <SelectItem value="udpdrop">udpdrop</SelectItem>
                      <SelectItem value="tls">tls</SelectItem>
                      <SelectItem value="http">http</SelectItem>
                      <SelectItem value="flood">flood</SelectItem>
                      <SelectItem value="browser">browser</SelectItem>
                      <SelectItem value="priv-flood">priv-flood</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="concurrents" className="text-sm text-white mb-2 block">Concurrents</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="concurrents"
                      type="range"
                      min="1"
                      max="10"
                      value={concurrents}
                      onChange={(e) => setConcurrents(parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-sm text-gray-400 min-w-[3rem]">{concurrents}/1</span>
                  </div>
                </div>

              </form>
              </div>
              <div className="px-6 pt-6">
                <Button type="submit" onClick={handleLaunchAttack} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-xs">
                  Start
                </Button>
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border py-6 shadow-sm">
              <div className="flex items-start justify-between mb-6 px-6">
                <div>
                  <h2 className="text-xl font-semibold mb-1">Your Attacks</h2>
                  <p className="text-sm text-muted-foreground">Manage your attacks in one click.</p>
                </div>
                <Button 
                  onClick={handleStopAll}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs"
                  size="sm"
                  disabled={attacks.length === 0}
                >
                  <Icon name="X" size={14} className="mr-1" />
                  Stop All
                </Button>
              </div>

              <div className="px-6">
              <div className="mb-4">
                <Input
                  value={filterTarget}
                  onChange={(e) => setFilterTarget(e.target.value)}
                  placeholder="Filter target..."
                  className="bg-transparent border-input text-white placeholder:text-muted-foreground focus-visible:ring-ring/50"
                />
              </div>

              <div className="rounded-lg border border-border overflow-hidden">
                <div className="grid grid-cols-6 gap-4 p-3 text-xs font-medium text-muted-foreground border-b border-border bg-muted/50">
                  <div className="flex items-center gap-1">
                    ID
                    <Icon name="ArrowUpDown" size={12} />
                  </div>
                  <div className="flex items-center gap-1">
                    Target
                    <Icon name="ArrowUpDown" size={12} />
                  </div>
                  <div className="flex items-center gap-1">
                    Port
                    <Icon name="ArrowUpDown" size={12} />
                  </div>
                  <div className="flex items-center gap-1">
                    Method
                    <Icon name="ArrowUpDown" size={12} />
                  </div>
                  <div className="flex items-center gap-1">
                    Expire
                    <Icon name="ArrowUpDown" size={12} />
                  </div>
                  <div className="flex items-center gap-1">
                    Status
                    <Icon name="ArrowUpDown" size={12} />
                  </div>
                </div>

                {filteredAttacks.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground text-sm">
                    No results.
                  </div>
                ) : (
                  <div>
                    {filteredAttacks.map((attack) => (
                      <div key={attack.id} className="grid grid-cols-6 gap-4 p-3 text-sm border-b border-border hover:bg-muted/50 transition-colors">
                        <div className="text-gray-300 font-mono">{attack.id}</div>
                        <div className="text-white">{attack.target}</div>
                        <div className="text-gray-300">{attack.port}</div>
                        <div className="text-gray-300">{attack.method}</div>
                        <div className="text-gray-400 text-xs">{attack.expire}</div>
                        <div>
                          <span className={`px-2 py-1 rounded text-xs ${
                            attack.status === 'running' ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'
                          }`}>
                            {attack.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Current page 1 of {Math.max(1, Math.ceil(filteredAttacks.length / 10))}
                </span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="w-8 h-8 p-0" disabled>
                    <Icon name="ChevronsLeft" size={14} />
                  </Button>
                  <Button variant="outline" size="sm" className="w-8 h-8 p-0" disabled>
                    <Icon name="ChevronLeft" size={14} />
                  </Button>
                  <Button variant="outline" size="sm" className="w-8 h-8 p-0" disabled>
                    <Icon name="ChevronRight" size={14} />
                  </Button>
                  <Button variant="outline" size="sm" className="w-8 h-8 p-0" disabled>
                    <Icon name="ChevronsRight" size={14} />
                  </Button>
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