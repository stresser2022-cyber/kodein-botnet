import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

interface Plan {
  id: string;
  name: string;
  price: number;
  duration: number;
  features: {
    concurrents: number;
    maxTime: number;
    methods: string[];
    apiAccess: boolean;
  };
  popular?: boolean;
}

export default function Plans() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'lifetime'>('monthly');
  const [userBalance, setUserBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const currentUser = localStorage.getItem('current_user');

  useEffect(() => {
    if (!currentUser) {
      navigate('/');
      return;
    }
    loadBalance();
  }, []);

  const loadBalance = async () => {
    try {
      const response = await fetch(`https://functions.poehali.dev/9a41fb04-1027-4f22-b119-794df42bdde1?username=${currentUser}`, {
        method: 'GET',
        headers: {
          'X-Admin-Key': localStorage.getItem('admin_key') || ''
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUserBalance(data.balance || 0);
      }
    } catch (error) {
      console.error('Failed to load balance:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    navigate('/');
    return null;
  }

  const plans: Plan[] = [
    {
      id: 'basic',
      name: 'Basic',
      price: 10,
      duration: 30,
      features: {
        concurrents: 1,
        maxTime: 60,
        methods: ['Cooldown: 0s'],
        apiAccess: false
      }
    },
    {
      id: 'medium',
      name: 'Medium',
      price: 30,
      duration: 30,
      features: {
        concurrents: 2,
        maxTime: 120,
        methods: ['Cooldown: 0s', 'VIP Access'],
        apiAccess: false
      },
      popular: true
    },
    {
      id: 'advanced',
      name: 'Advanced',
      price: 50,
      duration: 30,
      features: {
        concurrents: 3,
        maxTime: 180,
        methods: ['Cooldown: 0s', 'VIP Access'],
        apiAccess: false
      }
    }
  ];

  const handleSelectPlan = async (planId: string) => {
    const plan = plans.find(p => p.id === planId);
    if (!plan) return;

    const planPrice = billingCycle === 'monthly' 
      ? plan.price 
      : (plan.price === 10 ? 50 : plan.price === 30 ? 70 : 100);

    if (userBalance < planPrice) {
      toast({
        title: 'Insufficient Balance',
        description: `You need $${planPrice} but have $${userBalance.toFixed(2)}. Please add balance first.`,
        variant: 'destructive'
      });
      setTimeout(() => navigate('/dashboard/deposit'), 1500);
      return;
    }

    setSelectedPlan(planId);
    
    try {
      const newBalance = userBalance - planPrice;
      const response = await fetch('https://functions.poehali.dev/9a41fb04-1027-4f22-b119-794df42bdde1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Key': localStorage.getItem('admin_key') || ''
        },
        body: JSON.stringify({
          username: currentUser,
          amount: -planPrice
        })
      });

      if (!response.ok) throw new Error('Payment failed');

      setUserBalance(newBalance);
      toast({
        title: 'Plan Activated!',
        description: `${plan.name} plan activated. Remaining balance: $${newBalance.toFixed(2)}`
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to activate plan. Please contact support.',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
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
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">Choose Your Plan</h1>
                <p className="text-muted-foreground">Select the plan that fits your needs</p>
              </div>
              <div className="bg-card border border-border rounded-lg px-6 py-3">
                <div className="text-sm text-muted-foreground mb-1">Your Balance</div>
                <div className="text-2xl font-bold text-foreground">
                  {loading ? '...' : `$${userBalance.toFixed(2)}`}
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('lifetime')}
                className={`px-6 py-2 rounded-lg font-medium transition-all relative ${
                  billingCycle === 'lifetime'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                Lifetime
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                  Save 33%
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div 
                key={plan.id}
                className={`bg-card border rounded-lg p-6 transition-all duration-300 hover:border-foreground hover:shadow-xl hover:shadow-foreground/10 hover:scale-105 cursor-pointer ${
                  plan.popular ? 'border-foreground relative' : 'border-border'
                } ${selectedPlan === plan.id ? 'ring-2 ring-foreground' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                    POPULAR
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-2">
                    {billingCycle === 'monthly' ? (
                      <>
                        <div className="text-3xl font-bold text-foreground">€{plan.price}</div>
                        <div className="text-sm text-muted-foreground">per month</div>
                      </>
                    ) : (
                      <>
                        <div className="text-3xl font-bold text-foreground">€{plan.price === 10 ? 50 : plan.price === 30 ? 70 : 100}</div>
                        <div className="text-sm text-muted-foreground">one-time payment</div>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm">
                    <Icon name="Zap" size={16} className="text-foreground" />
                    <span>Concurrent: {plan.features.concurrents}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Icon name="Clock" size={16} className="text-foreground" />
                    <span>Max Time: {plan.features.maxTime}s</span>
                  </div>
                  
                  {plan.features.methods.map((method, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <Icon name="Check" size={16} className="text-foreground" />
                      <span className="text-card-foreground">{method}</span>
                    </div>
                  ))}
                  
                  {plan.name !== 'Basic' && (
                    <div className="flex items-center gap-2 text-sm">
                      <Icon name="Award" size={16} className="text-yellow-400" />
                      <span className="text-yellow-400">VIP</span>
                    </div>
                  )}
                </div>

                <Button
                  onClick={() => handleSelectPlan(plan.id)}
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                      : 'bg-secondary hover:bg-secondary/80 text-secondary-foreground'
                  }`}
                >
                  {billingCycle === 'monthly' ? 'Subscribe Monthly' : 'Buy Lifetime'}
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Plan Comparison</h2>
              <div className="text-sm text-muted-foreground">
                Viewing: <span className="text-foreground font-medium">{billingCycle === 'monthly' ? 'Monthly' : 'Lifetime'}</span> prices
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Feature</th>
                    {plans.map(plan => (
                      <th key={plan.id} className="text-center py-3 px-4 font-medium">{plan.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="py-3 px-4 text-muted-foreground">Price</td>
                    {plans.map(plan => (
                      <td key={plan.id} className="text-center py-3 px-4 font-semibold text-foreground">
                        €{billingCycle === 'monthly' ? plan.price : (plan.price === 10 ? 50 : plan.price === 30 ? 70 : 100)}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 px-4 text-muted-foreground">Concurrent Attacks</td>
                    {plans.map(plan => (
                      <td key={plan.id} className="text-center py-3 px-4">{plan.features.concurrents}</td>
                    ))}
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 px-4 text-muted-foreground">Max Duration</td>
                    {plans.map(plan => (
                      <td key={plan.id} className="text-center py-3 px-4">{plan.features.maxTime}s</td>
                    ))}
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 px-4 text-muted-foreground">Cooldown</td>
                    {plans.map(plan => (
                      <td key={plan.id} className="text-center py-3 px-4">0s</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-muted-foreground">VIP Access</td>
                    {plans.map(plan => (
                      <td key={plan.id} className="text-center py-3 px-4">
                        {plan.name !== 'Basic' ? (
                          <Icon name="Check" size={16} className="inline text-yellow-400" />
                        ) : (
                          <Icon name="X" size={16} className="inline text-gray-600" />
                        )}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-8 bg-card border-2 border-foreground/20 rounded-lg p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 to-transparent pointer-events-none"></div>
            <div className="relative flex items-start gap-3">
              <Icon name="Lock" size={24} className="text-foreground flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">VIP Methods</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Unlock 6 premium attack methods with Medium or Advanced plan
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {['cloudflare', 'priv-flood', 'gudp', 'udpbypass', 'tcpbypass', 'ovh'].map((method) => (
                    <div key={method} className="flex items-center gap-1.5 text-sm">
                      <Icon name="Crown" size={14} className="text-foreground/70" />
                      <code className="text-foreground/90 font-mono">{method}</code>
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