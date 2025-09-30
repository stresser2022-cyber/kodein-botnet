import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  authMode: 'login' | 'register';
  setAuthMode: (mode: 'login' | 'register') => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  username: string;
  setUsername: (username: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function AuthModal({
  open,
  onOpenChange,
  authMode,
  setAuthMode,
  email,
  setEmail,
  password,
  setPassword,
  username,
  setUsername,
  onSubmit
}: AuthModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black border-white/20 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {authMode === 'login' ? 'Sign In' : 'Create Account'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 mt-4">
          {authMode === 'register' && (
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm text-zinc-300">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-white/5 border-white/20 text-white"
                placeholder="Enter your username"
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm text-zinc-300">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/5 border-white/20 text-white"
              placeholder="Enter your email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm text-zinc-300">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white/5 border-white/20 text-white"
              placeholder="Enter your password"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-white text-black hover:bg-white/90 font-medium"
          >
            {authMode === 'login' ? 'Sign In' : 'Create Account'}
          </Button>
          <div className="text-center text-sm text-zinc-400">
            {authMode === 'login' ? (
              <span>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className="text-white hover:underline"
                >
                  Sign up
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className="text-white hover:underline"
                >
                  Sign in
                </button>
              </span>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
