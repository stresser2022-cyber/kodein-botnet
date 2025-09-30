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

  const SETTINGS_API = 'https://functions.poehali.dev/b3667882-e8de-45d6-8bb7-8c54646552a1';
  const ATTACKS_API = 'https://functions.poehali.dev/2cec0d22-6495-4fc9-83d1-0b97c37fac2b';

  useEffect(() => {
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
      case 'pro':
        return 'from-blue-500 to-blue-700';
      default:
        return 'from-gray-500 to-gray-700';
    }
  };

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case 'ultimate':
        return 'Crown';
      case 'pro':
        return 'Zap';
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
      <div className="bg-[#0f0f0f] border border-white/10 rounded-lg p-6">
        <div className="flex items-center justify-center h-32">
          <Icon name="Loader2" size={24} className="animate-spin text-white/50" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0f0f0f] border border-white/10 rounded-lg p-6">
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
