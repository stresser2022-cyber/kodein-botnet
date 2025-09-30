import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import AuthModal from '@/components/AuthModal';
import HeroSection from '@/components/HeroSection';
import StatsSection from '@/components/StatsSection';
import FeaturesSection from '@/components/FeaturesSection';
import PricingSection from '@/components/PricingSection';
import AddonsSection from '@/components/AddonsSection';
import MethodsSection from '@/components/MethodsSection';
import Footer from '@/components/Footer';

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

  return (
    <div className="min-h-screen w-full bg-black">
      <Header 
        isLoggedIn={isLoggedIn}
        currentUser={currentUser}
        onSignIn={() => setAuthOpen(true)}
        onLogout={handleLogout}
      />

      <AuthModal
        open={authOpen}
        onOpenChange={setAuthOpen}
        authMode={authMode}
        setAuthMode={setAuthMode}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        username={username}
        setUsername={setUsername}
        onSubmit={handleAuth}
      />

      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <PricingSection activeTab={activeTab} setActiveTab={setActiveTab} />
      <AddonsSection />
      <MethodsSection />
      <Footer />
    </div>
  );
}
