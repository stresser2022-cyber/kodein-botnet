import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';

interface PlanInfoProps {
  plan: string;
  concurrents: number;
  attackTime: number;
  vipAccess: boolean;
  apiAccess: boolean;
  expireDate: string;
  onGoProfile: () => void;
}

export default function PlanInfo({
  plan,
  concurrents,
  attackTime,
  vipAccess,
  apiAccess,
  expireDate,
  onGoProfile
}: PlanInfoProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-foreground mb-2">Information</h3>
      <p className="text-sm text-muted-foreground mb-6">Summary of your current plan.</p>

      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Icon name="Award" size={16} />
            <span>Plan</span>
          </div>
          <span className="text-foreground font-medium">{plan}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Icon name="Users" size={16} />
            <span>Concurrents</span>
          </div>
          <span className="text-foreground font-medium">{concurrents} attacks</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Icon name="Clock" size={16} />
            <span>Attack time</span>
          </div>
          <span className="text-foreground font-medium">{attackTime} sec.</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Icon name="Crown" size={16} />
            <span>VIP Access</span>
          </div>
          <span className="text-foreground font-medium">{vipAccess ? 'Yes' : 'No'}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Icon name="Code" size={16} />
            <span>API Access</span>
          </div>
          <span className="text-foreground font-medium">{apiAccess ? 'Yes' : 'No'}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Icon name="Calendar" size={16} />
            <span>Expire</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-foreground font-medium">{expireDate}</span>
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <Icon name="X" size={14} />
            </button>
          </div>
        </div>
      </div>

      <Button 
        onClick={onGoProfile}
        className="w-full"
      >
        Go Profile
      </Button>
    </div>
  );
}