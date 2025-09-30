import { useState } from 'react';
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

  const currentUser = localStorage.getItem('current_user');

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
      price: 25,
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
      price: 45,
      duration: 30,
      features: {
        concurrents: 3,
        maxTime: 180,
        methods: ['Cooldown: 0s', 'VIP Access'],
        apiAccess: false
      }
    },
    {
      id: 'api-basic',
      name: 'API Basic',
      price: 15,
      duration: 30,
      features: {
        concurrents: 1,
        maxTime: 60,
        methods: ['Full Documentation'],
        apiAccess: true
      }
    },
    {
      id: 'api-pro',
      name: 'API Pro',
      price: 35,
      duration: 30,
      features: {
        concurrents: 3,
        maxTime: 180,
        methods: ['Priority Support'],
        apiAccess: true
      }
    },
    {
      id: 'api-enterprise',
      name: 'API Enterprise',
      price: 75,
      duration: 30,
      features: {
        concurrents: 5,
        maxTime: 300,
        methods: ['Dedicated Support'],
        apiAccess: true
      }
    }
  ];

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    toast({
      title: 'Plan Selected',
      description: 'Proceed to deposit to activate this plan'
    });
    setTimeout(() => navigate('/deposit'), 1500);
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
            <h1 className="text-3xl font-bold mb-2">Choose Your Plan</h1>
            <p className="text-gray-400">Select the plan that fits your needs</p>
            
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-white text-black'
                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('lifetime')}
                className={`px-6 py-2 rounded-lg font-medium transition-all relative ${
                  billingCycle === 'lifetime'
                    ? 'bg-white text-black'
                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
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
                className={`bg-card border rounded-lg p-6 transition-all duration-300 hover:border-white hover:shadow-xl hover:shadow-white/10 hover:scale-105 cursor-pointer ${
                  plan.popular ? 'border-white relative' : 'border-zinc-800'
                } ${selectedPlan === plan.id ? 'ring-2 ring-white' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-black text-xs font-bold px-3 py-1 rounded-full">
                    POPULAR
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-2">
                    {billingCycle === 'monthly' ? (
                      <>
                        <div className="text-3xl font-bold text-white">€{plan.price}</div>
                        <div className="text-sm text-zinc-400">per month</div>
                      </>
                    ) : (
                      <>
                        <div className="text-3xl font-bold text-white">€{plan.price === 10 ? 30 : plan.price === 25 ? 50 : plan.price === 45 ? 80 : plan.price === 15 ? 40 : plan.price === 35 ? 70 : 150}</div>
                        <div className="text-sm text-zinc-400">one-time payment</div>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm">
                    <Icon name="Zap" size={16} className="text-white" />
                    <span>Concurrent: {plan.features.concurrents}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Icon name="Clock" size={16} className="text-white" />
                    <span>Max Time: {plan.features.maxTime}s</span>
                  </div>
                  
                  {plan.features.methods.map((method, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <Icon name="Check" size={16} className="text-white" />
                      <span className="text-zinc-300">{method}</span>
                    </div>
                  ))}
                  
                  {plan.features.apiAccess && (
                    <div className="flex items-center gap-2 text-sm">
                      <Icon name="Key" size={16} className="text-green-400" />
                      <span className="text-green-400">API Access</span>
                    </div>
                  )}
                  
                  {!plan.features.apiAccess && plan.name !== 'Basic' && (
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
                      ? 'bg-white text-black hover:bg-zinc-200' 
                      : 'bg-zinc-800 hover:bg-zinc-700 text-white'
                  }`}
                >
                  {billingCycle === 'monthly' ? 'Subscribe Monthly' : 'Buy Lifetime'}
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-card border border-zinc-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Plan Comparison</h2>
              <div className="text-sm text-zinc-400">
                Viewing: <span className="text-white font-medium">{billingCycle === 'monthly' ? 'Monthly' : 'Lifetime'}</span> prices
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="text-left py-3 px-4 text-zinc-400 font-medium">Feature</th>
                    {plans.map(plan => (
                      <th key={plan.id} className="text-center py-3 px-4 font-medium">{plan.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-zinc-800">
                    <td className="py-3 px-4 text-zinc-400">Price</td>
                    {plans.map(plan => (
                      <td key={plan.id} className="text-center py-3 px-4 font-semibold text-white">
                        €{billingCycle === 'monthly' ? plan.price : (plan.price === 10 ? 30 : plan.price === 25 ? 50 : plan.price === 45 ? 80 : plan.price === 15 ? 40 : plan.price === 35 ? 70 : 150)}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-zinc-800">
                    <td className="py-3 px-4 text-zinc-400">Concurrent Attacks</td>
                    {plans.map(plan => (
                      <td key={plan.id} className="text-center py-3 px-4">{plan.features.concurrents}</td>
                    ))}
                  </tr>
                  <tr className="border-b border-zinc-800">
                    <td className="py-3 px-4 text-zinc-400">Max Duration</td>
                    {plans.map(plan => (
                      <td key={plan.id} className="text-center py-3 px-4">{plan.features.maxTime}s</td>
                    ))}
                  </tr>
                  <tr className="border-b border-zinc-800">
                    <td className="py-3 px-4 text-zinc-400">Cooldown</td>
                    {plans.map(plan => (
                      <td key={plan.id} className="text-center py-3 px-4">0s</td>
                    ))}
                  </tr>
                  <tr className="border-b border-zinc-800">
                    <td className="py-3 px-4 text-zinc-400">VIP Access</td>
                    {plans.map(plan => (
                      <td key={plan.id} className="text-center py-3 px-4">
                        {plan.name !== 'Basic' && !plan.features.apiAccess ? (
                          <Icon name="Check" size={16} className="inline text-yellow-400" />
                        ) : (
                          <Icon name="X" size={16} className="inline text-gray-600" />
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-zinc-400">API Access</td>
                    {plans.map(plan => (
                      <td key={plan.id} className="text-center py-3 px-4">
                        {plan.features.apiAccess ? (
                          <Icon name="Check" size={16} className="inline text-green-400" />
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
        </div>
      </div>
    </div>
  );
}