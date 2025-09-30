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
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="w-full grid grid-cols-1 gap-4 px-4 md:grid-cols-[minmax(0,0.999fr)_minmax(0,2fr)] md:gap-6 md:px-6 py-4 md:py-6">
            
            <div data-slot="card" className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm w-full min-w-0 justify-self-stretch self-start">
              <div data-slot="card-header" className="@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6">
                <div data-slot="card-title" className="leading-none font-semibold">Panel</div>
                <div data-slot="card-description" className="text-muted-foreground text-sm">Launch new attack in one click.</div>
              </div>
              
              <div data-slot="card-content" className="px-6">
                <form onSubmit={handleLaunchAttack}>
                  <div className="grid w-full items-center gap-4">
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:gap-2">
                      <div>
                        <label className="flex items-center gap-2 text-sm leading-none font-medium mb-2" htmlFor="target">Target</label>
                        <input 
                          className="placeholder:text-muted-foreground dark:bg-input/30 border-input flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]" 
                          id="target" 
                          placeholder="1.1.1.1" 
                          type="text"
                          value={target}
                          onChange={(e) => setTarget(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="flex items-center gap-2 text-sm leading-none font-medium mb-2" htmlFor="port">Port</label>
                        <input 
                          className="placeholder:text-muted-foreground dark:bg-input/30 border-input flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]" 
                          id="port" 
                          placeholder="443" 
                          type="text"
                          value={port}
                          onChange={(e) => setPort(e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm leading-none font-medium mb-2" htmlFor="duration">Duration</label>
                      <input 
                        className="placeholder:text-muted-foreground dark:bg-input/30 border-input flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]" 
                        id="duration" 
                        placeholder="1200" 
                        type="text"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                      />
                    </div>

                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="method">Method</Label>
                      <Select value={method} onValueChange={setMethod}>
                        <SelectTrigger className="border-input data-[placeholder]:text-muted-foreground dark:bg-input/30 dark:hover:bg-input/50 h-auto">
                          <SelectValue placeholder="Select a method" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
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

                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <label className="flex items-center gap-2 text-sm leading-none font-medium mb-2" htmlFor="concurrents">Concurrents</label>
                        <div className="flex items-center gap-2">
                          <div className="relative flex-1 h-1.5 bg-muted rounded-full">
                            <input
                              type="range"
                              min="1"
                              max="1"
                              value={concurrents}
                              onChange={(e) => setConcurrents(parseInt(e.target.value))}
                              className="absolute w-full h-1.5 bg-transparent appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-background [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:shadow-sm [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-background [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:shadow-sm"
                            />
                          </div>
                          <span className="w-12 text-xs text-center">{concurrents} / 1</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              <div data-slot="card-footer" className="items-center px-6 grid">
                <button 
                  onClick={handleLaunchAttack}
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-2 w-full"
                >
                  Start
                </button>
              </div>
            </div>

            <div data-slot="card" className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm w-full min-w-0 justify-self-stretch self-start">
              <div data-slot="card-header" className="@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6">
                <div data-slot="card-title" className="leading-none font-semibold">Your Attacks</div>
                <div data-slot="card-description" className="text-muted-foreground text-sm">Manage your attacks in one click.</div>
              </div>

              <div data-slot="card-content" className="px-6">
                <div className="w-full">
                  <div className="flex items-center py-4 gap-4">
                    <input 
                      className="placeholder:text-muted-foreground dark:bg-input/30 border-input flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] max-w-sm" 
                      placeholder="Filter target..." 
                      value={filterTarget}
                      onChange={(e) => setFilterTarget(e.target.value)}
                    />
                    <button 
                      onClick={handleStopAll}
                      disabled={attacks.length === 0}
                      className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-2 ml-auto disabled:opacity-50"
                    >
                      <Icon name="X" size={16} />
                      Stop All
                    </button>
                  </div>

                  <div className="rounded-md border">
                    <div className="relative w-full overflow-x-auto">
                      <table className="w-full caption-bottom text-sm">
                        <thead className="[&_tr]:border-b">
                          <tr className="hover:bg-muted/50 border-b transition-colors">
                            <th className="text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap">
                              <div className="cursor-pointer flex items-center gap-2 ml-2">
                                ID
                                <Icon name="ArrowDown" size={16} className="text-foreground/50" />
                              </div>
                            </th>
                            <th className="text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap">
                              <div className="cursor-pointer flex items-center gap-2">
                                Target
                                <Icon name="ArrowUpDown" size={16} className="text-foreground/50" />
                              </div>
                            </th>
                            <th className="text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap">
                              <div className="cursor-pointer flex items-center gap-2">
                                Port
                                <Icon name="ArrowUpDown" size={16} className="text-foreground/50" />
                              </div>
                            </th>
                            <th className="text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap">
                              <div className="cursor-pointer flex items-center gap-2">
                                Method
                                <Icon name="ArrowUpDown" size={16} className="text-foreground/50" />
                              </div>
                            </th>
                            <th className="text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap">
                              <div className="cursor-pointer flex items-center gap-2">
                                Expire
                                <Icon name="ArrowUpDown" size={16} className="text-foreground/50" />
                              </div>
                            </th>
                            <th className="text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap">
                              <div className="cursor-pointer flex items-center gap-2">
                                Status
                                <Icon name="ArrowUpDown" size={16} className="text-foreground/50" />
                              </div>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                          {filteredAttacks.length === 0 ? (
                            <tr className="hover:bg-muted/50 border-b transition-colors">
                              <td className="p-2 align-middle h-24 text-center" colSpan={6}>
                                No results.
                              </td>
                            </tr>
                          ) : (
                            filteredAttacks.map((attack) => (
                              <tr key={attack.id} className="hover:bg-muted/50 border-b transition-colors">
                                <td className="p-2 align-middle whitespace-nowrap">{attack.id}</td>
                                <td className="p-2 align-middle whitespace-nowrap">{attack.target}</td>
                                <td className="p-2 align-middle whitespace-nowrap">{attack.port}</td>
                                <td className="p-2 align-middle whitespace-nowrap">{attack.method}</td>
                                <td className="p-2 align-middle whitespace-nowrap text-xs">{attack.expire}</td>
                                <td className="p-2 align-middle whitespace-nowrap">
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

                  <div className="flex items-center justify-between py-4">
                    <div className="text-sm font-medium text-foreground/50">
                      Current page 1 of {Math.max(1, Math.ceil(filteredAttacks.length / 10))}
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="border bg-background shadow-xs hover:bg-accent dark:bg-input/30 dark:border-input dark:hover:bg-input/50 hidden h-8 w-8 lg:flex items-center justify-center rounded-md" disabled>
                        <Icon name="ChevronsLeft" size={16} />
                      </button>
                      <button className="border bg-background shadow-xs hover:bg-accent dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-8 w-8 inline-flex items-center justify-center rounded-md" disabled>
                        <Icon name="ChevronLeft" size={16} />
                      </button>
                      <button className="border bg-background shadow-xs hover:bg-accent dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-8 w-8 inline-flex items-center justify-center rounded-md" disabled>
                        <Icon name="ChevronRight" size={16} />
                      </button>
                      <button className="border bg-background shadow-xs hover:bg-accent dark:bg-input/30 dark:border-input dark:hover:bg-input/50 hidden h-8 w-8 lg:flex items-center justify-center rounded-md" disabled>
                        <Icon name="ChevronsRight" size={16} />
                      </button>
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
