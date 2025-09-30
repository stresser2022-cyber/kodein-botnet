import Icon from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface AdminLoginProps {
  adminKey: string;
  setAdminKey: (key: string) => void;
  onLogin: (e: React.FormEvent) => void;
}

export default function AdminLogin({ adminKey, setAdminKey, onLogin }: AdminLoginProps) {
  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-black border border-white/20 rounded-lg p-8">
        <div className="flex items-center gap-2 mb-6">
          <Icon name="Shield" size={24} />
          <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
        </div>
        <form onSubmit={onLogin} className="space-y-4">
          <div>
            <label className="text-sm text-zinc-300 mb-2 block">Admin Key</label>
            <Input
              type="password"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              className="bg-white/5 border-white/20 text-white"
              placeholder="Enter admin key"
            />
          </div>
          <Button type="submit" className="w-full bg-white text-black hover:bg-white/90">
            Access Panel
          </Button>
        </form>
      </div>
    </div>
  );
}
