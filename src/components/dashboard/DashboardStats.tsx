import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';

interface Attack {
  id: number;
  target: string;
  port: number;
  method: string;
  expire: string;
  status: string;
}

export default function DashboardStats() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalAttacks, setTotalAttacks] = useState(0);
  const [runningAttacks, setRunningAttacks] = useState(0);

  useEffect(() => {
    const users = localStorage.getItem('registered_users');
    if (users) {
      try {
        const userList = JSON.parse(users);
        setTotalUsers(Array.isArray(userList) ? userList.length : 0);
      } catch {
        setTotalUsers(0);
      }
    }

    const attacks = localStorage.getItem('attacks');
    if (attacks) {
      try {
        const attackList: Attack[] = JSON.parse(attacks);
        if (Array.isArray(attackList)) {
          setTotalAttacks(attackList.length);
          
          const running = attackList.filter(attack => {
            if (attack.status === 'running') {
              const expireTime = new Date(attack.expire).getTime();
              return expireTime > Date.now();
            }
            return false;
          }).length;
          
          setRunningAttacks(running);
        }
      } catch {
        setTotalAttacks(0);
        setRunningAttacks(0);
      }
    }
  }, []);

  const stats = [
    {
      title: 'Total Users',
      value: totalUsers.toString(),
      trend: null,
      trendUp: false,
      subtitle: 'Registered users',
      description: 'Users for the whole time'
    },
    {
      title: 'Total Attacks',
      value: totalAttacks.toString(),
      trend: null,
      trendUp: false,
      subtitle: 'All attacks launched',
      description: 'Attacks for the whole time'
    },
    {
      title: 'Running Attacks',
      value: runningAttacks.toString(),
      trend: null,
      trendUp: false,
      subtitle: 'Currently active',
      description: 'Attacks that are currently running'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <div 
          key={index}
          className="bg-[#0f0f0f] border border-white/10 rounded-lg p-6"
        >
          <div className="flex items-start justify-between mb-4">
            <p className="text-sm text-zinc-400">{stat.title}</p>
            {stat.trend && (
              <div className={`flex items-center gap-1 text-xs ${
                stat.trendUp ? 'text-green-400' : 'text-red-400'
              }`}>
                <Icon name={stat.trendUp ? 'TrendingUp' : 'TrendingDown'} size={14} />
                {stat.trend}
              </div>
            )}
          </div>
          <h2 className="text-4xl font-bold text-white mb-3">{stat.value}</h2>
          <div className="space-y-1">
            <p className="text-sm text-zinc-300">{stat.subtitle}</p>
            <p className="text-xs text-zinc-500">{stat.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
