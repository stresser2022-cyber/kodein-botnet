import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import Dashboard from "./pages/Dashboard";
import Attacks from "./pages/Attacks";
import Plans from "./pages/Plans";
import Deposit from "./pages/Deposit";
import Documentation from "./pages/Documentation";
import History from "./pages/History";
import AdminBalance from "./pages/AdminBalance";
import NotFound from "./pages/NotFound";
import Icon from "@/components/ui/icon";

const queryClient = new QueryClient();

const App = () => {
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => setLoading(false), 800);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/attacks" element={<Attacks />} />
            <Route path="/dashboard/plans" element={<Plans />} />
            <Route path="/dashboard/deposit" element={<Deposit />} />
            <Route path="/dashboard/docs" element={<Documentation />} />
            <Route path="/dashboard/history" element={<History />} />
            <Route path="/admin/balance" element={<AdminBalance />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>

        <Toaster />
        <Sonner />
        
        {loading && (
          <div className={`fixed inset-0 z-[9998] flex items-center justify-center bg-background/80 backdrop-blur-sm transition-all duration-1000 pointer-events-none ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
            <Icon name="Loader2" size={64} className="text-white/80 animate-spin" />
          </div>
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;