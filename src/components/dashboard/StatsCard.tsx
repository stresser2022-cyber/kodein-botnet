import Icon from '@/components/ui/icon';

interface StatsCardProps {
  title: string;
  value: string | number;
  trend?: string;
  subtitle: string;
  icon?: string;
}

export default function StatsCard({ title, value, trend, subtitle, icon }: StatsCardProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <span className="text-sm text-muted-foreground">{title}</span>
        {trend && (
          <div className="flex items-center gap-1 text-xs text-green-400">
            <Icon name="TrendingUp" size={14} />
            <span>{trend}</span>
          </div>
        )}
      </div>
      <div className="text-4xl font-bold text-foreground mb-2">{value}</div>
      <div className="text-sm text-muted-foreground">{subtitle}</div>
    </div>
  );
}