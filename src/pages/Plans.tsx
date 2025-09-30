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
        methods: ['UDP', 'TCP'],
        apiAccess: false
      }
    },
    {
      id: 'standard',
      name: 'Standard',
      price: 25,
      duration: 30,
      features: {
        concurrents: 3,
        maxTime: 120,
        methods: ['UDP', 'TCP', 'HTTP'],
        apiAccess: true
      },
      popular: true
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 50,
      duration: 30,
      features: {
        concurrents: 5,
        maxTime: 300,
        methods: ['UDP', 'TCP', 'HTTP', 'ICMP', 'Custom'],
        apiAccess: true
      }
    },
    {
      id: 'ultimate',
      name: 'Ultimate',
      price: 100,
      duration: 30,
      features: {
        concurrents: 10,
        maxTime: 600,
        methods: ['All Methods', 'Custom Scripts'],
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                    <span className="text-4xl font-bold">${plan.price}</span>
                    <span className="text-gray-400">/{plan.duration}d</span>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm">
                    <Icon name="Zap" size={16} className="text-purple-400" />
                    <span>{plan.features.concurrents} Concurrent Attack{plan.features.concurrents > 1 ? 's' : ''}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Icon name="Clock" size={16} className="text-purple-400" />
                    <span>Max {plan.features.maxTime}s per attack</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Icon name="Shield" size={16} className="text-purple-400" />
                    <span>{plan.features.methods.length} Attack Methods</span>
                  </div>
                  
                  <div className="flex items-start gap-2 text-sm">
                    <Icon name="Check" size={16} className="text-purple-400 mt-0.5" />
                    <div>
                      {plan.features.methods.map((method, idx) => (
                        <div key={idx} className="text-gray-300">{method}</div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    {plan.features.apiAccess ? (
                      <>
                        <Icon name="Check" size={16} className="text-green-400" />
                        <span>API Access</span>
                      </>
                    ) : (
                      <>
                        <Icon name="X" size={16} className="text-gray-600" />
                        <span className="text-gray-600">No API Access</span>
                      </>
                    )}
                  </div>
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
                    <td className="py-3 px-4 text-gray-400">Attack Methods</td>
                    {plans.map(plan => (
                      <td key={plan.id} className="text-center py-3 px-4">{plan.features.methods.length}</td>
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