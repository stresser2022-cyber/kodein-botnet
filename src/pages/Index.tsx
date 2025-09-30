import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function Index() {
  const [activeTab, setActiveTab] = useState<'plans' | 'api'>('plans');
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '-50px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          entry.target.classList.remove('animate-out');
        } else {
          entry.target.classList.remove('animate-in');
          entry.target.classList.add('animate-out');
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const user = localStorage.getItem('kodein_user');
    if (user) {
      setIsLoggedIn(true);
      setCurrentUser(user);
    }
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (authMode === 'register') {
      if (!username || !email || !password) {
        toast({
          title: 'Error',
          description: 'Please fill in all fields',
          variant: 'destructive'
        });
        return;
      }
      
      const users = JSON.parse(localStorage.getItem('kodein_users') || '[]');
      const userExists = users.find((u: any) => u.email === email);
      
      if (userExists) {
        toast({
          title: 'Error',
          description: 'User with this email already exists',
          variant: 'destructive'
        });
        return;
      }
      
      users.push({ username, email, password });
      localStorage.setItem('kodein_users', JSON.stringify(users));
      localStorage.setItem('kodein_user', username);
      
      setIsLoggedIn(true);
      setCurrentUser(username);
      setAuthOpen(false);
      
      toast({
        title: 'Success',
        description: 'Account created successfully!'
      });
      
      setEmail('');
      setPassword('');
      setUsername('');
    } else {
      if (!email || !password) {
        toast({
          title: 'Error',
          description: 'Please fill in all fields',
          variant: 'destructive'
        });
        return;
      }
      
      const users = JSON.parse(localStorage.getItem('kodein_users') || '[]');
      const user = users.find((u: any) => u.email === email && u.password === password);
      
      if (!user) {
        toast({
          title: 'Error',
          description: 'Invalid email or password',
          variant: 'destructive'
        });
        return;
      }
      
      localStorage.setItem('kodein_user', user.username);
      setIsLoggedIn(true);
      setCurrentUser(user.username);
      setAuthOpen(false);
      
      toast({
        title: 'Success',
        description: 'Logged in successfully!'
      });
      
      setEmail('');
      setPassword('');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('kodein_user');
    setIsLoggedIn(false);
    setCurrentUser(null);
    toast({
      title: 'Success',
      description: 'Logged out successfully'
    });
  };

  const plans = [
    {
      name: 'Basic',
      price: '10€ Monthly - 30€ Lifetime',
      features: [
        'Concurrent: 1',
        'Max Time: 60s',
        'Cooldown: 0s',
        'Without VIP'
      ]
    },
    {
      name: 'Medium',
      price: '25€ Monthly - 50€ Lifetime',
      features: [
        'Concurrent: 2',
        'Max Time: 120s',
        'Cooldown: 0s',
        'With VIP'
      ]
    },
    {
      name: 'Advanced',
      price: '45€ Monthly - 80€ Lifetime',
      features: [
        'Concurrent: 3',
        'Max Time: 180s',
        'Cooldown: 0s',
        'With VIP'
      ]
    }
  ];

  const apiPlans = [
    {
      name: 'API Basic',
      price: '15€ Monthly - 40€ Lifetime',
      features: [
        'API Access',
        'Concurrent: 1',
        'Max Time: 60s',
        'Full Documentation'
      ]
    },
    {
      name: 'API Pro',
      price: '35€ Monthly - 70€ Lifetime',
      features: [
        'API Access',
        'Concurrent: 3',
        'Max Time: 180s',
        'Priority Support'
      ]
    },
    {
      name: 'API Enterprise',
      price: '75€ Monthly - 150€ Lifetime',
      features: [
        'API Access',
        'Concurrent: 5',
        'Max Time: 300s',
        'Dedicated Support'
      ]
    }
  ];

  const addons = [
    { name: 'Bypass Power Saving', price: '50€' },
    { name: '+1 Concurrents', price: '30€' },
    { name: '+60s', price: '20€' },
    { name: 'No Cooldown', price: '10€' },
    { name: 'Private Power (1Tbps+)', price: '400€' }
  ];

  const methods = [
    '!dns', '!udp', '!pps', '!tcp', '!tcpdrop', '!fivem', '!discord', '!rand',
    '!ack', '!socket', '!syn', '!gudp', '!udpbypass', '!tcp-spoof', '!ovh',
    '!udpdrop', '!tls', '!http', '!flood', '!browser', '!priv-flood'
  ];

  return (
    <div className="min-h-screen w-full bg-black">
      <header className="max-w-6xl mx-auto flex items-center justify-between py-6 px-6">
        <div className="text-base font-semibold tracking-tight flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-white" />
          Kodein Botnet
        </div>
        <div className="flex items-center gap-3">
          <a
            className="button-ghost px-4 py-2 rounded-md flex items-center gap-2"
            href="https://t.me/join_kodein"
          >
            <Icon name="Zap" size={14} />
            Telegram
          </a>
          <a
            className="button-ghost px-4 py-2 rounded-md flex items-center gap-2"
            href="https://discord.gg/Y5mNrQm6pp"
          >
            <Icon name="Shield" size={14} />
            Discord
          </a>
          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-zinc-400">Hi, {currentUser}</span>
              <button
                onClick={handleLogout}
                className="button-ghost px-4 py-2 rounded-md flex items-center gap-2 text-sm"
              >
                <Icon name="LogOut" size={14} />
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => setAuthOpen(true)}
              className="bg-white text-black px-4 py-2 rounded-md text-sm font-medium hover:bg-white/90 transition-colors"
            >
              Sign In
            </button>
          )}
        </div>
      </header>

      <Dialog open={authOpen} onOpenChange={setAuthOpen}>
        <DialogContent className="bg-black border-white/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {authMode === 'login' ? 'Sign In' : 'Create Account'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAuth} className="space-y-4 mt-4">
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

      <section className="max-w-6xl mx-auto relative py-24 sm:py-32 text-center px-6">
        <h1
          id="home"
          className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white opacity-0 translate-y-5"
          data-animate
        >
          Kodein Botnet
        </h1>
        <p className="text-xl sm:text-2xl mt-6 font-medium text-white opacity-0 translate-y-5" data-animate>
          Massive Power. Real Results.
        </p>
        <p
          className="text-zinc-400 mt-6 max-w-2xl mx-auto text-sm leading-relaxed opacity-0 translate-y-5"
          data-animate
        >
          Extreme network load with 200–500 Gbps+ Layer 4 firepower and 2–3 million RPS at Layer 7. 
          Daily updates, optimized payloads, and cutting-edge bypass methods for maximum efficiency.
        </p>
        <div className="mt-10 flex justify-center opacity-0 translate-y-5" data-animate>
          <a
            target="_blank"
            className="button-ghost px-6 py-2.5 rounded-md inline-flex items-center gap-2 text-white text-sm"
            href="https://t.me/join_kodein"
            rel="noreferrer"
          >
            <Icon name="Zap" size={14} />
            Join Telegram
          </a>
        </div>
      </section>

      <section className="max-w-6xl mx-auto relative py-16 px-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="soft-border rounded-lg p-6 bg-transparent hover:bg-white/[0.02] transition-colors opacity-0 translate-y-4" data-animate>
            <div className="text-2xl font-bold tracking-tight text-white">350+ Gbps</div>
            <div className="text-zinc-400 mt-2 text-sm">Layer 4 Throughput</div>
          </div>
          <div className="soft-border rounded-lg p-6 bg-transparent hover:bg-white/[0.02] transition-colors opacity-0 translate-y-4" data-animate>
            <div className="text-2xl font-bold tracking-tight text-white">2,000,000+ RPS</div>
            <div className="text-zinc-400 mt-2 text-sm">Requests per Second</div>
          </div>
          <div className="soft-border rounded-lg p-6 bg-transparent hover:bg-white/[0.02] transition-colors opacity-0 translate-y-4" data-animate>
            <div className="text-2xl font-bold tracking-tight text-white">20+ Mpps</div>
            <div className="text-zinc-400 mt-2 text-sm">Packets per Second</div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto relative py-16 px-6">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-white opacity-0 translate-y-5" data-animate>
          Born for Power, Built with Precision
        </h2>
        <p className="text-zinc-400 text-center max-w-2xl mx-auto mt-4 text-sm">
          Experience large scale attack powered by real botnet infrastructure.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10">
          <div className="soft-border rounded-lg p-6 bg-transparent hover:bg-white/[0.02] transition-colors opacity-0 translate-y-4" data-animate>
            <div className="flex items-center gap-3 text-base font-semibold mb-3 text-white">
              <Icon name="Shield" size={18} />
              Network Compatibility
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Unmatched L4 strength with constant updates. At L7, smart bypasses over numbers, 
              real power, real impact, unbeatable for the price.
            </p>
          </div>
          <div className="soft-border rounded-lg p-6 bg-transparent hover:bg-white/[0.02] transition-colors opacity-0 translate-y-4" data-animate>
            <div className="flex items-center gap-3 text-base font-semibold mb-3 text-white">
              <Icon name="Cloud" size={18} />
              Bypass Technology
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed">
              High-efficiency methods designed to simulate real users and bypass advanced 
              filtering and mitigation layers.
            </p>
          </div>
          <div className="soft-border rounded-lg p-6 bg-transparent hover:bg-white/[0.02] transition-colors opacity-0 translate-y-4" data-animate>
            <div className="flex items-center gap-3 text-base font-semibold mb-3 text-white">
              <Icon name="Zap" size={18} />
              Scalable & Future-Ready
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Constantly updated and instantly delivered, our system scales with demand while 
              ensuring precision and excellent service.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto relative py-16 px-6">
        <h2 id="pricing" className="text-3xl sm:text-4xl font-bold text-center text-white opacity-0 translate-y-5" data-animate>
          Kodein Networks Pricing
        </h2>
        <p className="text-zinc-400 text-center max-w-2xl mx-auto mt-4 text-sm">
          Choose the plan that suits your testing needs.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            className={`px-4 py-2 rounded-md cursor-pointer transition-colors text-sm text-white ${
              activeTab === 'plans'
                ? 'bg-white/[0.08] border border-white/20'
                : 'button-ghost'
            }`}
            onClick={() => setActiveTab('plans')}
          >
            Plans
          </button>
          <button
            className={`px-4 py-2 rounded-md cursor-pointer transition-colors text-sm text-white ${
              activeTab === 'api'
                ? 'bg-white/[0.08] border border-white/20'
                : 'button-ghost'
            }`}
            onClick={() => setActiveTab('api')}
          >
            API Plans
          </button>
        </div>
        <div className="mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(activeTab === 'plans' ? plans : apiPlans).map((plan, idx) => (
              <div
                key={idx}
                className="soft-border rounded-lg p-6 bg-transparent hover:bg-white/[0.02] transition-colors flex flex-col"
              >
                <div className="text-lg font-bold text-white">
                  {plan.name} Plan
                </div>
                <div className="text-zinc-400 mt-2 text-sm">{plan.price}</div>
                <ul className="mt-4 text-zinc-400 text-sm flex-1 space-y-1.5">
                  {plan.features.map((feature, fidx) => (
                    <li key={fidx}>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto relative py-16 px-6">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-white opacity-0 translate-y-5" data-animate>
          Addons & Power-Ups
        </h2>
        <p className="text-zinc-400 text-center max-w-2xl mx-auto mt-4 text-sm">
          Boost your plan with extra features.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-10">
          {addons.map((addon, idx) => (
            <div
              key={idx}
              className="soft-border rounded-lg p-5 bg-transparent hover:bg-white/[0.02] transition-colors opacity-0 translate-y-4"
              data-animate
            >
              <div className="text-base font-bold text-white">{addon.name}</div>
              <div className="text-zinc-400 mt-2 text-sm">{addon.price}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto relative py-16 px-6">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-white opacity-0 translate-y-5" data-animate>
          Available Methods
        </h2>
        <p className="text-zinc-400 text-center max-w-2xl mx-auto mt-4 text-sm">
          Comprehensive arsenal of attack vectors for maximum effectiveness.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mt-10">
          {methods.map((method, idx) => (
            <div
              key={idx}
              className="soft-border rounded-md p-3 bg-transparent hover:bg-white/[0.02] transition-colors text-center opacity-0 translate-y-4"
              data-animate
            >
              <code className="text-xs font-mono text-zinc-300">{method}</code>
            </div>
          ))}
        </div>
      </section>

      <footer className="max-w-6xl mx-auto py-12 text-center text-xs text-zinc-600 px-6">
        © 2025 Kodein Networks. All rights reserved.
      </footer>
    </div>
  );
}