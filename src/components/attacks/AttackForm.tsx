import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';

interface PlanLimits {
  max_concurrents: number;
  max_duration: number;
  methods: string[] | string;
}

interface AttackFormProps {
  target: string;
  setTarget: (value: string) => void;
  port: string;
  setPort: (value: string) => void;
  duration: string;
  setDuration: (value: string) => void;
  method: string;
  setMethod: (value: string) => void;
  concurrents: number;
  setConcurrents: (value: number) => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  userPlan: string;
  planLimits: PlanLimits;
}

export default function AttackForm({
  target,
  setTarget,
  port,
  setPort,
  duration,
  setDuration,
  method,
  setMethod,
  concurrents,
  setConcurrents,
  loading,
  onSubmit,
  userPlan,
  planLimits
}: AttackFormProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div 
      data-slot="card" 
      className={`bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm w-full min-w-0 justify-self-stretch self-start transition-opacity ${
        mounted ? 'opacity-0 animate-[fadeIn_0.5s_ease-in-out_forwards]' : 'opacity-0'
      }`}
    >
      <div data-slot="card-header" className="@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6">
        <div data-slot="card-title" className="leading-none font-semibold">Panel</div>
        <div data-slot="card-description" className="text-muted-foreground text-sm">Launch new attack in one click.</div>
      </div>


      <div data-slot="card-content" className="px-6">
        <form onSubmit={onSubmit}>
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
                <SelectContent className="max-h-60 bg-black border-zinc-800 text-white">
                  <SelectItem value="dns" className="text-white hover:text-white focus:text-white hover:bg-zinc-700 focus:bg-zinc-700 cursor-pointer">dns</SelectItem>
                  <SelectItem value="udp" className="text-white hover:text-white focus:text-white hover:bg-zinc-700 focus:bg-zinc-700 cursor-pointer">udp</SelectItem>
                  <SelectItem value="pps" className="text-white hover:text-white focus:text-white hover:bg-zinc-700 focus:bg-zinc-700 cursor-pointer">pps</SelectItem>
                  <SelectItem value="tcp" className="text-white hover:text-white focus:text-white hover:bg-zinc-700 focus:bg-zinc-700 cursor-pointer">tcp</SelectItem>
                  <SelectItem value="tcpdrop" className="text-white hover:text-white focus:text-white hover:bg-zinc-700 focus:bg-zinc-700 cursor-pointer">tcpdrop</SelectItem>
                  <SelectItem value="fivem" className="text-white hover:text-white focus:text-white hover:bg-zinc-700 focus:bg-zinc-700 cursor-pointer">fivem</SelectItem>
                  <SelectItem value="discord" className="text-white hover:text-white focus:text-white hover:bg-zinc-700 focus:bg-zinc-700 cursor-pointer">discord</SelectItem>
                  <SelectItem value="rand" className="text-white hover:text-white focus:text-white hover:bg-zinc-700 focus:bg-zinc-700 cursor-pointer">rand</SelectItem>
                  <SelectItem value="ack" className="text-white hover:text-white focus:text-white hover:bg-zinc-700 focus:bg-zinc-700 cursor-pointer">ack</SelectItem>
                  <SelectItem value="socket" className="text-white hover:text-white focus:text-white hover:bg-zinc-700 focus:bg-zinc-700 cursor-pointer">socket</SelectItem>
                  <SelectItem value="syn" className="text-white hover:text-white focus:text-white hover:bg-zinc-700 focus:bg-zinc-700 cursor-pointer">syn</SelectItem>
                  <SelectItem value="gudp" className="text-white hover:text-white focus:text-white hover:bg-zinc-700 focus:bg-zinc-700 cursor-pointer">gudp</SelectItem>
                  <SelectItem value="udpbypass" className="text-white hover:text-white focus:text-white hover:bg-zinc-700 focus:bg-zinc-700 cursor-pointer">udpbypass</SelectItem>
                  <SelectItem value="tcp-spoof" className="text-white hover:text-white focus:text-white hover:bg-zinc-700 focus:bg-zinc-700 cursor-pointer">tcp-spoof</SelectItem>
                  <SelectItem value="ovh" className="text-white hover:text-white focus:text-white hover:bg-zinc-700 focus:bg-zinc-700 cursor-pointer">ovh</SelectItem>
                  <SelectItem value="udpdrop" className="text-white hover:text-white focus:text-white hover:bg-zinc-700 focus:bg-zinc-700 cursor-pointer">udpdrop</SelectItem>
                  <SelectItem value="tls" className="text-white hover:text-white focus:text-white hover:bg-zinc-700 focus:bg-zinc-700 cursor-pointer">tls</SelectItem>
                  <SelectItem value="http" className="text-white hover:text-white focus:text-white hover:bg-zinc-700 focus:bg-zinc-700 cursor-pointer">http</SelectItem>
                  <SelectItem value="flood" className="text-white hover:text-white focus:text-white hover:bg-zinc-700 focus:bg-zinc-700 cursor-pointer">flood</SelectItem>
                  <SelectItem value="browser" className="text-white hover:text-white focus:text-white hover:bg-zinc-700 focus:bg-zinc-700 cursor-pointer">browser</SelectItem>
                  <SelectItem value="priv-flood" className="text-white hover:text-white focus:text-white hover:bg-zinc-700 focus:bg-zinc-700 cursor-pointer">priv-flood</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1">
                <label className="flex items-center gap-2 text-sm leading-none font-medium mb-2" htmlFor="concurrents">Concurrents</label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1 h-1.5 bg-secondary rounded-full">
                    <input
                      type="range"
                      min="1"
                      max="3"
                      value={concurrents}
                      onChange={(e) => setConcurrents(parseInt(e.target.value))}
                      className="absolute w-full h-1.5 bg-transparent appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-foreground [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-foreground [&::-webkit-slider-thumb]:shadow-sm [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-foreground [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-foreground [&::-moz-range-thumb]:shadow-sm"
                    />
                  </div>
                  <span className="w-12 text-xs text-center text-foreground">{concurrents} / 3</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div data-slot="card-footer" className="items-center px-6 grid">
        <button 
          onClick={onSubmit}
          disabled={loading}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-zinc-700 text-white hover:bg-zinc-600 h-9 px-4 py-2 w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Launching...' : 'Start'}
        </button>
      </div>
    </div>
  );
}