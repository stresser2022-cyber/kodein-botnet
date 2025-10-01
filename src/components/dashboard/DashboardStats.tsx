import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';

interface Stats {
  total_users: number;
  total_attacks: number;
  running_attacks: number;
}

export default function DashboardStats() {
  const [stats, setStats] = useState<Stats>({
    total_users: 0,
    total_attacks: 0,
    running_attacks: 0
  });
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchStats = async () => {
      try {
        const response = await fetch('https://functions.poehali.dev/7b4a6500-26cb-418d-8a2d-d5f5d4601582');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const statsDisplay = [
    {
      title: 'Total Users',
      value: loading ? '...' : stats.total_users.toString(),
      trend: null,
      trendUp: false,
      subtitle: 'Registered users',
      description: 'Users for the whole time'
    },
    {
      title: 'Total Attacks',
      value: loading ? '...' : stats.total_attacks.toString(),
      trend: null,
      trendUp: false,
      subtitle: 'All attacks launched',
      description: 'Attacks for the whole time'
    },
    {
      title: 'Running Attacks',
      value: loading ? '...' : stats.running_attacks.toString(),
      trend: null,
      trendUp: false,
      subtitle: 'Currently active',
      description: 'Attacks that are currently running'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {statsDisplay.map((stat, index) => (
        <div 
          key={index}
          className={`bg-card border border-border rounded-lg p-6 transition-opacity duration-500 ${
            mounted ? 'opacity-0 animate-[fadeIn_0.5s_ease-in-out_forwards]' : 'opacity-0'
          }`}
          style={mounted ? { animationDelay: `${index * 0.1}s` } : {}}
        >
          <div className="flex items-start justify-between mb-4">
            <p className="text-sm text-muted-foreground">{stat.title}</p>
            {stat.trend && (
              <div className={`flex items-center gap-1 text-xs ${
                stat.trendUp ? 'text-green-400' : 'text-red-400'
              }`}>
                <Icon name={stat.trendUp ? 'TrendingUp' : 'TrendingDown'} size={14} />
                {stat.trend}
              </div>
            )}
          </div>
          <h2 className="text-4xl font-bold text-foreground mb-3">{stat.value}</h2>
          <div className="space-y-1">
            <p className="text-sm text-card-foreground">{stat.subtitle}</p>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}