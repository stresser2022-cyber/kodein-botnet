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
    <div className="flex min-h-screen bg-black text-white">
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
        <div className="p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-[minmax(0,0.999fr)_minmax(0,2fr)] gap-4 md:gap-6">
            {/* Panel Card */}
            <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 flex flex-col">
              <div className="p-6 border-b border-gray-800">
                <h2 className="text-lg font-semibold leading-none mb-1.5">Panel</h2>
                <p className="text-sm text-gray-400">Launch new attack in one click.</p>
              </div>
              
              <div className="p-6 flex-1">
                <form onSubmit={handleLaunchAttack} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="target" className="text-sm font-medium mb-2 block">Target</Label>
                      <Input
                        id="target"
                        value={target}
                        onChange={(e) => setTarget(e.target.value)}
                        placeholder="1.1.1.1"
                        className="bg-transparent border-gray-700 text-white placeholder:text-gray-500 h-9"
                      />
                    </div>

                    <div>
                      <Label htmlFor="port" className="text-sm font-medium mb-2 block">Port</Label>
                      <Input
                        id="port"
                        type="number"
                        value={port}
                        onChange={(e) => setPort(e.target.value)}
                        placeholder="443"
                        className="bg-transparent border-gray-700 text-white placeholder:text-gray-500 h-9"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="duration" className="text-sm font-medium mb-2 block">Duration</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="1200"
                      className="bg-transparent border-gray-700 text-white placeholder:text-gray-500 h-9"
                    />
                  </div>

                  <div>
                    <Label htmlFor="method" className="text-sm font-medium mb-2 block">Method</Label>
                    <Select value={method} onValueChange={setMethod}>
                      <SelectTrigger className="bg-transparent border-gray-700 text-white h-9">
                        <SelectValue placeholder="Select a method" className="text-gray-500" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1a1a] border-gray-700 text-white max-h-60">
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
                    <Label htmlFor="concurrents" className="text-sm font-medium mb-2 block">Concurrents</Label>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1 h-1.5 bg-gray-800 rounded-full">
                        <input
                          id="concurrents"
                          type="range"
                          min="1"
                          max="1"
                          value={concurrents}
                          onChange={(e) => setConcurrents(parseInt(e.target.value))}
                          className="absolute w-full h-1.5 bg-transparent appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-sm [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-sm"
                        />
                      </div>
                      <span className="text-xs text-gray-400 w-12 text-center">{concurrents} / 1</span>
                    </div>
                  </div>
                </form>
              </div>

              <div className="p-6 border-t border-gray-800">
                <Button 
                  type="submit" 
                  onClick={handleLaunchAttack}
                  className="w-full bg-white hover:bg-gray-100 text-black font-medium h-9"
                >
                  Start
                </Button>
              </div>
            </div>

            {/* Your Attacks Card */}
            <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 flex flex-col">
              <div className="p-6 border-b border-gray-800">
                <h2 className="text-lg font-semibold leading-none mb-1.5">Your Attacks</h2>
                <p className="text-sm text-gray-400">Manage your attacks in one click.</p>
              </div>
              
              <div className="p-6 flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <Input
                    value={filterTarget}
                    onChange={(e) => setFilterTarget(e.target.value)}
                    placeholder="Filter target..."
                    className="bg-transparent border-gray-700 text-white placeholder:text-gray-500 h-9 max-w-sm flex-1"
                  />
                  <Button 
                    onClick={handleStopAll}
                    className="bg-white hover:bg-gray-100 text-black h-9 px-4 ml-auto"
                    disabled={attacks.length === 0}
                  >
                    <Icon name="X" size={14} className="mr-1" />
                    Stop All
                  </Button>
                </div>

                <div className="rounded-md border border-gray-800 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b border-gray-800 bg-[#0f0f0f]">
                        <tr>
                          <th className="h-10 px-2 text-left align-middle font-medium text-sm whitespace-nowrap">
                            <div className="flex items-center gap-2 ml-2">
                              ID
                              <Icon name="ArrowDown" size={14} className="text-gray-500" />
                            </div>
                          </th>
                          <th className="h-10 px-2 text-left align-middle font-medium text-sm whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              Target
                              <Icon name="ArrowUpDown" size={14} className="text-gray-500" />
                            </div>
                          </th>
                          <th className="h-10 px-2 text-left align-middle font-medium text-sm whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              Port
                              <Icon name="ArrowUpDown" size={14} className="text-gray-500" />
                            </div>
                          </th>
                          <th className="h-10 px-2 text-left align-middle font-medium text-sm whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              Method
                              <Icon name="ArrowUpDown" size={14} className="text-gray-500" />
                            </div>
                          </th>
                          <th className="h-10 px-2 text-left align-middle font-medium text-sm whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              Expire
                              <Icon name="ArrowUpDown" size={14} className="text-gray-500" />
                            </div>
                          </th>
                          <th className="h-10 px-2 text-left align-middle font-medium text-sm whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              Status
                              <Icon name="ArrowUpDown" size={14} className="text-gray-500" />
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredAttacks.length === 0 ? (
                          <tr className="border-b border-gray-800">
                            <td colSpan={6} className="h-24 text-center text-sm text-gray-400">
                              No results.
                            </td>
                          </tr>
                        ) : (
                          filteredAttacks.map((attack) => (
                            <tr key={attack.id} className="border-b border-gray-800 hover:bg-[#252525] transition-colors">
                              <td className="p-2 align-middle whitespace-nowrap text-sm text-gray-300 font-mono">{attack.id}</td>
                              <td className="p-2 align-middle whitespace-nowrap text-sm text-white">{attack.target}</td>
                              <td className="p-2 align-middle whitespace-nowrap text-sm text-gray-300">{attack.port}</td>
                              <td className="p-2 align-middle whitespace-nowrap text-sm text-gray-300">{attack.method}</td>
                              <td className="p-2 align-middle whitespace-nowrap text-xs text-gray-400">{attack.expire}</td>
                              <td className="p-2 align-middle whitespace-nowrap text-sm">
                                <span className={`px-2 py-1 rounded text-xs ${
                                  attack.status === 'running' ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'
                                }`}>
                                  {attack.status}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <span className="text-xs text-gray-500">
                    Current page 1 of {Math.max(1, Math.ceil(filteredAttacks.length / 10))}
                  </span>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-800" disabled>
                      <Icon name="ChevronsLeft" size={14} />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-800" disabled>
                      <Icon name="ChevronLeft" size={14} />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-800" disabled>
                      <Icon name="ChevronRight" size={14} />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-800" disabled>
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
