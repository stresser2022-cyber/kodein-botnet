import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';

interface PlanLimits {
  max_concurrents: number;
  max_duration: number;
  methods: string[] | string;
}

interface UserPlan {
  plan: string;
  plan_expires_at: string | null;
  limits: PlanLimits;
  running_attacks: number;
}

const PLAN_LIMITS: Record<string, PlanLimits> = {
  free: {
    max_concurrents: 1,
    max_duration: 60,
    methods: ['dns', 'udp', 'tcp']
  },
  basic: {
    max_concurrents: 1,
    max_duration: 60,
    methods: ['dns', 'udp', 'tcp', 'syn']
  },
  medium: {
    max_concurrents: 2,
    max_duration: 120,
    methods: ['dns', 'udp', 'tcp', 'syn', 'ack', 'flood']
  },
  advanced: {
    max_concurrents: 3,
    max_duration: 180,
    methods: ['dns', 'udp', 'tcp', 'syn', 'ack', 'flood', 'http']
  },
  'api-basic': {
    max_concurrents: 1,
    max_duration: 60,
    methods: ['dns', 'udp', 'tcp', 'syn', 'api']
  },
  'api-pro': {
    max_concurrents: 3,
    max_duration: 180,
    methods: ['dns', 'udp', 'tcp', 'syn', 'ack', 'flood', 'http', 'api']
  },
  'api-enterprise': {
    max_concurrents: 5,
    max_duration: 300,
    methods: 'all'
  },
  pro: {
    max_concurrents: 3,
    max_duration: 300,
    methods: ['dns', 'udp', 'tcp', 'pps', 'syn', 'ack', 'flood', 'http']
  },
  ultimate: {
    max_concurrents: 10,
    max_duration: 1800,
    methods: 'all'
  }
};

interface DashboardPlanProps {
  currentUser: string;
}

export default function DashboardPlan({ currentUser }: DashboardPlanProps) {
  const [userPlan, setUserPlan] = useState<UserPlan>({
    plan: 'free',
    plan_expires_at: null,
    limits: PLAN_LIMITS.free,
    running_attacks: 0
  });
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const SETTINGS_API = 'https://functions.poehali.dev/b3667882-e8de-45d6-8bb7-8c54646552a1';
  const ATTACKS_API = 'https://functions.poehali.dev/2cec0d22-6495-4fc9-83d1-0b97c37fac2b';

  useEffect(() => {
    setMounted(true);
    fetchUserPlan();
  }, [currentUser]);

  const fetchUserPlan = async () => {
    try {
      const [settingsRes, attacksRes] = await Promise.all([
        fetch(SETTINGS_API, {
          headers: { 'X-User-Id': currentUser }
        }),
        fetch(ATTACKS_API, {
          headers: { 'X-User-Id': currentUser }
        })
      ]);

      if (settingsRes.ok) {
        const data = await settingsRes.json();
        const plan = data.plan || 'free';
        const planExpires = data.plan_expires_at;
        
        let activePlan = plan;
        if (planExpires && new Date(planExpires) < new Date()) {
          activePlan = 'free';
        }

        const limits = PLAN_LIMITS[activePlan] || PLAN_LIMITS.free;

        let runningCount = 0;
        if (attacksRes.ok) {
          const attacksData = await attacksRes.json();
          runningCount = attacksData.attacks?.filter((a: any) => 
            a.status === 'running' && new Date(a.expires_at) > new Date()
          ).length || 0;
        }

        setUserPlan({
          plan: activePlan,
          plan_expires_at: planExpires,
          limits,
          running_attacks: runningCount
        });
      }
    } catch (error) {
      console.error('Failed to fetch user plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'ultimate':
        return 'from-purple-500 to-purple-700';
      case 'api-enterprise':
        return 'from-purple-600 to-indigo-700';
      case 'pro':
        return 'from-blue-500 to-blue-700';
      case 'api-pro':
        return 'from-blue-600 to-cyan-700';
      case 'advanced':
        return 'from-green-500 to-green-700';
      case 'medium':
        return 'from-yellow-500 to-orange-600';
      case 'basic':
        return 'from-orange-500 to-red-600';
      case 'api-basic':
        return 'from-teal-500 to-teal-700';
      default:
        return 'from-gray-500 to-gray-700';
    }
  };

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case 'ultimate':
        return 'Crown';
      case 'api-enterprise':
        return 'Rocket';
      case 'pro':
        return 'Zap';
      case 'api-pro':
        return 'Key';
      case 'advanced':
        return 'Award';
      case 'medium':
        return 'Star';
      case 'basic':
        return 'Package';
      case 'api-basic':
        return 'Code';
      default:
        return 'Shield';
    }
  };

  const formatDuration = (seconds: number) => {
    if (seconds >= 60) {
      const minutes = Math.floor(seconds / 60);
      return `${minutes} min`;
    }
    return `${seconds} sec`;
  };

  if (loading) {
    return (
      <div className={`bg-[#0f0f0f] border border-white/10 rounded-lg p-6 transition-opacity ${
        mounted ? 'opacity-0 animate-[fadeIn_0.5s_ease-in-out_forwards]' : 'opacity-0'
      }`}>
        <div className="flex items-center justify-center h-32">
          <Icon name="Loader2" size={24} className="animate-spin text-white/50" />
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`bg-[#0f0f0f] border border-white/10 rounded-lg p-6 transition-opacity ${
        mounted ? 'opacity-0 animate-[fadeIn_0.5s_ease-in-out_forwards]' : 'opacity-0'
      }`}
      style={mounted ? { animationDelay: '0.2s' } : {}}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white">Your Plan</h2>
        <Icon name={getPlanIcon(userPlan.plan)} size={24} className="text-white/70" />
      </div>

      <div className={`bg-gradient-to-r ${getPlanColor(userPlan.plan)} rounded-lg p-4 mb-6`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-white capitalize">{userPlan.plan}</h3>
            {userPlan.plan_expires_at && userPlan.plan !== 'free' && (
              <p className="text-sm text-white/80 mt-1">
                {new Date(userPlan.plan_expires_at) > new Date() 
                  ? `Until ${new Date(userPlan.plan_expires_at).toLocaleDateString()}`
                  : 'Expired'}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
          <div className="flex items-center gap-2">
            <Icon name="Layers" size={18} className="text-zinc-400" />
            <span className="text-sm text-zinc-300">Concurrent Attacks</span>
          </div>
          <span className="text-sm font-medium text-white">
            {userPlan.running_attacks} / {userPlan.limits.max_concurrents}
          </span>
        </div>

        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
          <div className="flex items-center gap-2">
            <Icon name="Clock" size={18} className="text-zinc-400" />
            <span className="text-sm text-zinc-300">Max Duration</span>
          </div>
          <span className="text-sm font-medium text-white">
            {formatDuration(userPlan.limits.max_duration)}
          </span>
        </div>

        <div className="p-3 bg-white/5 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Shield" size={18} className="text-zinc-400" />
            <span className="text-sm text-zinc-300">Available Methods</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {userPlan.limits.methods === 'all' ? (
              <span className="px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded">
                All Methods
              </span>
            ) : (
              (userPlan.limits.methods as string[]).map((method) => (
                <span
                  key={method}
                  className="px-2 py-1 text-xs bg-zinc-700 text-zinc-300 rounded uppercase"
                >
                  {method}
                </span>
              ))
            )}
          </div>
        </div>
      </div>

      {userPlan.plan === 'free' && (
        <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <p className="text-xs text-blue-400">
            💡 Upgrade to Pro or Ultimate for more concurrents and longer attacks
          </p>
        </div>
      )}
    </div>
  );
}