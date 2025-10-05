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
  const [email] = useState('');
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
    const user = localStorage.getItem('lunacy_user');
    if (user) {
      setIsLoggedIn(true);
      setCurrentUser(user);
    }
  }, []);

  const handleAuth = async (e: React.FormEvent, captchaValid: boolean) => {
    e.preventDefault();
    
    if (!captchaValid) {
      toast({
        title: 'Error',
        description: 'Please verify that you are not a robot',
        variant: 'destructive'
      });
      return;
    }
    
    const AUTH_URL = 'https://functions.poehali.dev/8ec3d566-fc44-442e-ad1d-fee49d4a799b';
    
    try {
      if (authMode === 'register') {
        if (!username || !password) {
          toast({
            title: 'Error',
            description: 'Please fill in all fields',
            variant: 'destructive'
          });
          return;
        }
        
        const response = await fetch(AUTH_URL, {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            action: 'register',
            username,
            password
          })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          toast({
            title: 'Error',
            description: data.error || 'Registration failed',
            variant: 'destructive'
          });
          return;
        }
        
        localStorage.setItem('lunacy_user', data.user.username);
        localStorage.setItem('lunacy_user_id', data.user.id);
        localStorage.setItem('current_user', data.user.username);
        
        setIsLoggedIn(true);
        setCurrentUser(data.user.username);
        setAuthOpen(false);
        
        toast({
          title: 'Success',
          description: 'Account created! Redirecting...'
        });
        
        setPassword('');
        setUsername('');
        
        if (data.token) {
          localStorage.setItem('auth_token', data.token);
        }
        
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 100);
      } else {
        if (!username || !password) {
          toast({
            title: 'Error',
            description: 'Please fill in all fields',
            variant: 'destructive'
          });
          return;
        }
        
        const response = await fetch(AUTH_URL, {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            action: 'login',
            username,
            password
          })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          toast({
            title: 'Error',
            description: data.error || 'Login failed',
            variant: 'destructive'
          });
          return;
        }
        
        localStorage.setItem('lunacy_user', data.user.username);
        localStorage.setItem('lunacy_user_id', data.user.id);
        localStorage.setItem('current_user', data.user.username);
        
        setIsLoggedIn(true);
        setCurrentUser(data.user.username);
        setAuthOpen(false);
        
        toast({
          title: 'Success',
          description: 'Logged in! Redirecting...'
        });
        
        setPassword('');
        setUsername('');
        
        if (data.token) {
          localStorage.setItem('auth_token', data.token);
        }
        
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 100);
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      console.error('Error type:', error.name);
      console.error('Error message:', error.message);
      
      let errorMessage = 'Failed to connect to server.';
      
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        errorMessage = 'Please check:\n1. Disable ad blocker\n2. Try different browser\n3. Check antivirus/firewall';
      }
      
      toast({
        title: 'Connection Error',
        description: errorMessage,
        variant: 'destructive'
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('lunacy_user');
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