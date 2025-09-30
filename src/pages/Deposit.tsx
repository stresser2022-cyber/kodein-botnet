import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  fee: number;
  minAmount: number;
}

export default function Deposit() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [cryptoAddress, setCryptoAddress] = useState('');
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);

  const currentUser = localStorage.getItem('current_user');

  if (!currentUser) {
    navigate('/');
    return null;
  }

  const paymentMethods: PaymentMethod[] = [
    { id: 'bitcoin', name: 'Bitcoin', icon: 'Bitcoin', fee: 0, minAmount: 10 },
    { id: 'ethereum', name: 'Ethereum', icon: 'Coins', fee: 0, minAmount: 10 },
    { id: 'litecoin', name: 'Litecoin', icon: 'Coins', fee: 0, minAmount: 5 },
    { id: 'paypal', name: 'PayPal', icon: 'Wallet', fee: 3.5, minAmount: 5 },
    { id: 'card', name: 'Credit Card', icon: 'CreditCard', fee: 2.5, minAmount: 5 },
  ];

  const recentTransactions = [
    { id: 1, date: '2025-10-01', amount: 25, method: 'Bitcoin', status: 'completed' },
    { id: 2, date: '2025-09-28', amount: 50, method: 'Ethereum', status: 'completed' },
    { id: 3, date: '2025-09-25', amount: 10, method: 'PayPal', status: 'pending' },
  ];

  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId);
    setShowPaymentDetails(false);
  };

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMethod || !amount) {
      toast({
        title: 'Error',
        description: 'Please select payment method and enter amount',
        variant: 'destructive'
      });
      return;
    }

    const method = paymentMethods.find(m => m.id === selectedMethod);
    if (!method) return;

    const amountNum = parseFloat(amount);
    if (amountNum < method.minAmount) {
      toast({
        title: 'Error',
        description: `Minimum deposit is $${method.minAmount}`,
        variant: 'destructive'
      });
      return;
    }

    if (method.id === 'bitcoin' || method.id === 'ethereum' || method.id === 'litecoin') {
      setCryptoAddress('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa');
      setShowPaymentDetails(true);
      toast({
        title: 'Payment Address Generated',
        description: 'Send funds to the address below'
      });
    } else {
      toast({
        title: 'Processing',
        description: 'Redirecting to payment gateway...'
      });
      setTimeout(() => {
        toast({
          title: 'Success',
          description: 'Payment completed successfully!'
        });
      }, 2000);
    }
  };

  const selectedMethodData = paymentMethods.find(m => m.id === selectedMethod);
  const calculatedFee = selectedMethodData && amount ? (parseFloat(amount) * selectedMethodData.fee / 100).toFixed(2) : '0.00';
  const totalAmount = selectedMethodData && amount ? (parseFloat(amount) + parseFloat(calculatedFee)).toFixed(2) : '0.00';

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
            <h1 className="text-3xl font-bold mb-2">Deposit Funds</h1>
            <p className="text-gray-400">Add balance to your account</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-[#0f0f0f] border border-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-6">Select Payment Method</h2>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => handleMethodSelect(method.id)}
                      className={`p-4 rounded-lg border-2 transition-all hover:border-purple-500 ${
                        selectedMethod === method.id 
                          ? 'border-purple-500 bg-purple-900/20' 
                          : 'border-gray-800 bg-black'
                      }`}
                    >
                      <Icon name={method.icon} size={32} className="mx-auto mb-2 text-purple-400" />
                      <p className="font-medium text-center">{method.name}</p>
                      {method.fee > 0 && (
                        <p className="text-xs text-gray-400 text-center mt-1">{method.fee}% fee</p>
                      )}
                    </button>
                  ))}
                </div>

                {selectedMethod && (
                  <form onSubmit={handleDeposit} className="space-y-4">
                    <div>
                      <Label htmlFor="amount" className="text-gray-300">Amount (USD)</Label>
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder={`Min: $${selectedMethodData?.minAmount}`}
                        className="mt-1 bg-black border-gray-700 text-white"
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        Minimum deposit: ${selectedMethodData?.minAmount}
                      </p>
                    </div>

                    {showPaymentDetails && cryptoAddress && (
                      <div className="bg-black border border-gray-800 rounded-lg p-4">
                        <p className="text-sm text-gray-400 mb-2">Send {amount} USD worth of {selectedMethodData?.name} to:</p>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 bg-[#0f0f0f] p-2 rounded text-xs break-all">
                            {cryptoAddress}
                          </code>
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => {
                              navigator.clipboard.writeText(cryptoAddress);
                              toast({ title: 'Copied', description: 'Address copied to clipboard' });
                            }}
                          >
                            <Icon name="Copy" size={16} />
                          </Button>
                        </div>
                        <p className="text-xs text-yellow-400 mt-2">
                          ⚠️ Transaction will be confirmed within 10-30 minutes
                        </p>
                      </div>
                    )}

                    <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                      <Icon name="Wallet" size={16} className="mr-2" />
                      Proceed to Payment
                    </Button>
                  </form>
                )}
              </div>

              <div className="bg-[#0f0f0f] border border-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
                
                <div className="space-y-3">
                  {recentTransactions.map((tx) => (
                    <div key={tx.id} className="bg-black border border-gray-800 rounded-lg p-4 flex items-center justify-between">
                      <div>
                        <p className="font-medium">${tx.amount.toFixed(2)}</p>
                        <p className="text-sm text-gray-400">{tx.method} • {tx.date}</p>
                      </div>
                      <span className={`px-3 py-1 rounded text-xs font-medium ${
                        tx.status === 'completed' ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-400'
                      }`}>
                        {tx.status.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-[#0f0f0f] border border-gray-800 rounded-lg p-6 sticky top-8">
                <h2 className="text-xl font-semibold mb-6">Payment Summary</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Deposit Amount:</span>
                    <span className="font-medium">${amount || '0.00'}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Processing Fee:</span>
                    <span className="font-medium">${calculatedFee}</span>
                  </div>
                  
                  <div className="border-t border-gray-800 pt-4 flex justify-between">
                    <span className="font-semibold">Total:</span>
                    <span className="text-xl font-bold text-purple-400">${totalAmount}</span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-800">
                  <h3 className="font-semibold mb-3 text-sm">Payment Methods</h3>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li className="flex items-start gap-2">
                      <Icon name="Check" size={16} className="text-green-400 mt-0.5" />
                      <span>Instant crypto deposits</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon name="Check" size={16} className="text-green-400 mt-0.5" />
                      <span>Secure payment processing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon name="Check" size={16} className="text-green-400 mt-0.5" />
                      <span>24/7 support available</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}