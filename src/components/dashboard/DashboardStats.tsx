import Icon from '@/components/ui/icon';

export default function DashboardStats() {
  const stats = [
    {
      title: 'Total Users',
      value: '1 640',
      trend: '+0%',
      trendUp: true,
      subtitle: 'More than yesterday',
      description: 'Users for the whole time'
    },
    {
      title: 'Total Attacks',
      value: '10 389',
      trend: '+100%',
      trendUp: true,
      subtitle: 'More than yesterday',
      description: 'Attacks for the whole time'
    },
    {
      title: 'Running Attacks',
      value: '707',
      trend: null,
      trendUp: false,
      subtitle: 'Used out of 1 600 slots',
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
            <p className="text-sm text-zinc-300 flex items-center gap-1">
              {stat.subtitle}
              <Icon name="TrendingUp" size={14} className="text-zinc-500" />
            </p>
            <p className="text-xs text-zinc-500">{stat.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
