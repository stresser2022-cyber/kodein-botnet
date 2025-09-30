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
            <h1 className="text-3xl font-bold mb-2">Choose Your Plan</h1>
            <p className="text-gray-400">Select the plan that fits your needs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div 
                key={plan.id}
                className={`bg-[#0f0f0f] border rounded-lg p-6 transition-all hover:border-purple-500 ${
                  plan.popular ? 'border-purple-500 relative' : 'border-gray-800'
                } ${selectedPlan === plan.id ? 'ring-2 ring-purple-500' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    POPULAR
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-2">
                    <div className="text-lg font-bold text-purple-400">€{plan.price} Monthly</div>
                    <div className="text-sm text-gray-400">or €{plan.price * 2} Lifetime</div>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm">
                    <Icon name="Zap" size={16} className="text-purple-400" />
                    <span>Concurrent: {plan.features.concurrents}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Icon name="Clock" size={16} className="text-purple-400" />
                    <span>Max Time: {plan.features.maxTime}s</span>
                  </div>
                  
                  {plan.features.methods.map((method, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <Icon name="Check" size={16} className="text-purple-400" />
                      <span className="text-gray-300">{method}</span>
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
                      ? 'bg-purple-600 hover:bg-purple-700' 
                      : 'bg-gray-800 hover:bg-gray-700'
                  }`}
                >
                  Select Plan
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-[#0f0f0f] border border-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Plan Comparison</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Feature</th>
                    {plans.map(plan => (
                      <th key={plan.id} className="text-center py-3 px-4 font-medium">{plan.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-800">
                    <td className="py-3 px-4 text-gray-400">Concurrent Attacks</td>
                    {plans.map(plan => (
                      <td key={plan.id} className="text-center py-3 px-4">{plan.features.concurrents}</td>
                    ))}
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-3 px-4 text-gray-400">Max Duration</td>
                    {plans.map(plan => (
                      <td key={plan.id} className="text-center py-3 px-4">{plan.features.maxTime}s</td>
                    ))}
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-3 px-4 text-gray-400">Cooldown</td>
                    {plans.map(plan => (
                      <td key={plan.id} className="text-center py-3 px-4">0s</td>
                    ))}
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-3 px-4 text-gray-400">VIP Access</td>
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
                    <td className="py-3 px-4 text-gray-400">API Access</td>
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