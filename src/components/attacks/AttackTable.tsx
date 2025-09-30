import Icon from '@/components/ui/icon';

interface Attack {
  id: number;
  target: string;
  port: number;
  method: string;
  duration: number;
  expires_at: string;
  status: string;
  started_at?: string;
  created_at?: string;
}

interface AttackTableProps {
  attacks: Attack[];
  filterTarget: string;
  setFilterTarget: (value: string) => void;
  loading: boolean;
  onStopAll: () => void;
}

export default function AttackTable({
  attacks,
  filterTarget,
  setFilterTarget,
  loading,
  onStopAll
}: AttackTableProps) {
  const filteredAttacks = attacks.filter(a => 
    filterTarget === '' || a.target.toLowerCase().includes(filterTarget.toLowerCase())
  );

  return (
    <div data-slot="card" className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm w-full min-w-0 justify-self-stretch self-start opacity-0 animate-[fadeIn_0.5s_ease-in-out_forwards]" style={{ animationDelay: '0.2s' }}>
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
              onClick={onStopAll}
              disabled={attacks.length === 0 || loading}
              className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-2 ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Icon name="X" size={16} />
              {loading ? 'Stopping...' : 'Stop All'}
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
                        <td className="p-2 align-middle whitespace-nowrap text-xs">{new Date(attack.expires_at).toLocaleString()}</td>
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
  );
}