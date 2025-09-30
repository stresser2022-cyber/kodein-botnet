import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

export default function Deposit() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [amount, setAmount] = useState('');
  const [cryptocurrency, setCryptocurrency] = useState('');

  const currentUser = localStorage.getItem('current_user');

  if (!currentUser) {
    navigate('/');
    return null;
  }

  const handleProcess = () => {
    if (!amount || !cryptocurrency) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive'
      });
      return;
    }

    toast({
      title: 'Processing',
      description: 'Your deposit is being processed...'
    });
  };

  const handleCancel = () => {
    setAmount('');
    setCryptocurrency('');
  };

  return (
    <div className="dark flex min-h-screen bg-[#0a0a0a] text-white">
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
        <div className="flex items-center justify-center min-h-screen p-8">
          <div className="w-full max-w-xl bg-card border border-zinc-800 rounded-xl p-8">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold mb-2">Deposit</h1>
              <p className="text-zinc-400 text-sm">Top up your balance using cryptocurrency.</p>
            </div>

            <div className="space-y-6">
              <div>
                <label htmlFor="amount" className="block text-sm font-medium mb-2">Amount</label>
                <input
                  id="amount"
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Top-up amount"
                  className="w-full h-10 px-3 bg-zinc-900/50 border border-zinc-800 rounded-md text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700"
                />
              </div>

              <div>
                <label htmlFor="crypto" className="block text-sm font-medium mb-2">Cryptocurrency</label>
                <Select value={cryptocurrency} onValueChange={setCryptocurrency}>
                  <SelectTrigger className="w-full h-10 bg-zinc-900/50 border-zinc-800 text-white data-[placeholder]:text-zinc-500">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-zinc-800 text-white">
                    <SelectItem value="bitcoin" className="text-white hover:text-white focus:text-white hover:bg-zinc-700 focus:bg-zinc-700 cursor-pointer">Bitcoin (BTC)</SelectItem>
                    <SelectItem value="ethereum" className="text-white hover:text-white focus:text-white hover:bg-zinc-700 focus:bg-zinc-700 cursor-pointer">Ethereum (ETH)</SelectItem>
                    <SelectItem value="litecoin" className="text-white hover:text-white focus:text-white hover:bg-zinc-700 focus:bg-zinc-700 cursor-pointer">Litecoin (LTC)</SelectItem>
                    <SelectItem value="usdt" className="text-white hover:text-white focus:text-white hover:bg-zinc-700 focus:bg-zinc-700 cursor-pointer">Tether (USDT)</SelectItem>
                    <SelectItem value="bnb" className="text-white hover:text-white focus:text-white hover:bg-zinc-700 focus:bg-zinc-700 cursor-pointer">BNB (BNB)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleCancel}
                  className="px-6 py-2 bg-zinc-900/50 border border-zinc-800 rounded-md text-white hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleProcess}
                  className="flex-1 px-6 py-2 bg-white text-black rounded-md font-medium hover:bg-zinc-200 transition-colors"
                >
                  Process
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
