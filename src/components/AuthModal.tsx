import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

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
  onSubmit: (e: React.FormEvent, captchaValid: boolean) => void;
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
  onSubmit,
  onCaptchaError
}: AuthModalProps) {
  const [captcha, setCaptcha] = useState({ num1: 0, num2: 0 });
  const [captchaAnswer, setCaptchaAnswer] = useState('');

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    setCaptcha({ num1, num2 });
    setCaptchaAnswer('');
  };

  useEffect(() => {
    if (open && authMode === 'register') {
      generateCaptcha();
    }
  }, [open, authMode]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onOpenChange(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      onClick={() => onOpenChange(false)}
    >
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
      
      <div
        className="relative z-10 w-full max-w-md bg-black border border-white/20 rounded-lg shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 transition-opacity text-white"
        >
          <Icon name="X" size={18} />
          <span className="sr-only">Close</span>
        </button>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-white">
            {authMode === 'login' ? 'Sign In' : 'Create Account'}
          </h2>
        </div>

        <form onSubmit={(e) => {
          e.preventDefault();
          let captchaValid = true;
          
          if (authMode === 'register') {
            const correctAnswer = captcha.num1 + captcha.num2;
            if (parseInt(captchaAnswer) !== correctAnswer) {
              captchaValid = false;
              generateCaptcha();
            }
          }
          
          onSubmit(e, captchaValid);
        }} className="space-y-4">
          {authMode === 'register' && (
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm text-zinc-300">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-white/5 border-white/20 text-white placeholder:text-zinc-500"
                placeholder="Enter your username"
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm text-zinc-300">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/5 border-white/20 text-white placeholder:text-zinc-500"
              placeholder="Enter your email"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm text-zinc-300">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white/5 border-white/20 text-white placeholder:text-zinc-500"
              placeholder="Enter your password"
            />
          </div>
          
          {authMode === 'register' && (
            <div className="space-y-2">
              <Label className="text-sm text-zinc-300">
                Security Check
              </Label>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-white/5 border border-white/20 rounded-md px-4 py-2.5 flex items-center justify-center gap-2 select-none">
                  <span className="text-2xl font-bold text-white">{captcha.num1}</span>
                  <span className="text-xl text-zinc-400">+</span>
                  <span className="text-2xl font-bold text-white">{captcha.num2}</span>
                  <span className="text-xl text-zinc-400">=</span>
                  <span className="text-2xl text-zinc-400">?</span>
                </div>
                <button
                  type="button"
                  onClick={generateCaptcha}
                  className="p-2.5 bg-white/5 border border-white/20 rounded-md hover:bg-white/10 transition-colors"
                  title="Refresh captcha"
                >
                  <Icon name="RefreshCw" size={18} />
                </button>
              </div>
              <Input
                type="number"
                value={captchaAnswer}
                onChange={(e) => setCaptchaAnswer(e.target.value)}
                className="bg-white/5 border-white/20 text-white placeholder:text-zinc-500"
                placeholder="Enter the answer"
                required
              />
            </div>
          )}
          
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
      </div>
    </div>
  );
}