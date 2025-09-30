import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import Icon from '@/components/ui/icon';

interface ApiRouteAccordionProps {
  title: string;
  method: string;
  endpoint: string;
  description: string;
  params: { name: string; type: string; description: string }[];
}

function ApiRouteAccordion({ title, method, endpoint, description, params }: ApiRouteAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border border-zinc-800 rounded-lg bg-black/50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-zinc-900/50 transition-colors"
      >
        <span className="text-white font-medium text-lg">{title}</span>
        <Icon name="ChevronDown" size={20} className={`text-white transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="px-6 pb-4 pt-2 space-y-3 border-t border-zinc-800">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 text-xs font-semibold rounded ${
              method === 'GET' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'
            }`}>
              {method}
            </span>
            <code className="text-sm text-zinc-400 font-mono">{endpoint}</code>
          </div>
          
          <p className="text-sm text-zinc-400">{description}</p>
          
          {params.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-white">Parameters:</h4>
              <div className="space-y-2">
                {params.map((param, idx) => (
                  <div key={idx} className="bg-zinc-900/50 rounded p-3">
                    <div className="flex items-center gap-2">
                      <code className="text-sm text-blue-400 font-mono">{param.name}</code>
                      <span className="text-xs text-zinc-500">({param.type})</span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-1">{param.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Documentation() {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const currentUser = localStorage.getItem('current_user');

  if (!currentUser) {
    navigate('/');
    return null;
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <DashboardSidebar 
        currentUser={currentUser}
        collapsed={sidebarCollapsed} 
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        onLogout={() => {
          localStorage.clear();
          navigate('/');
        }}
      />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="w-full px-4 md:px-6 py-4 md:py-6">
            <div data-slot="card" className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm w-full max-w-4xl mx-auto">
              <div data-slot="card-header" className="@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6">
                <div data-slot="card-title" className="leading-none font-semibold text-2xl">Documentation</div>
                <div data-slot="card-description" className="text-muted-foreground text-sm">Here you can find the documentation for the API.</div>
              </div>

              <div data-slot="card-content" className="px-6">
                <div className="space-y-2">
                  <ApiRouteAccordion 
                    title="Start attack Route"
                    method="POST"
                    endpoint="/api/attack/start"
                    description="Start a new DDoS attack"
                    params={[
                      { name: 'target', type: 'string', description: 'Target IP or domain' },
                      { name: 'port', type: 'number', description: 'Target port' },
                      { name: 'method', type: 'string', description: 'Attack method' },
                      { name: 'duration', type: 'number', description: 'Attack duration in seconds' },
                      { name: 'concurrents', type: 'number', description: 'Number of concurrent connections' }
                    ]}
                  />
                  
                  <ApiRouteAccordion 
                    title="Get attack Route"
                    method="GET"
                    endpoint="/api/attack/:id"
                    description="Get information about a specific attack"
                    params={[
                      { name: 'id', type: 'number', description: 'Attack ID' }
                    ]}
                  />
                  
                  <ApiRouteAccordion 
                    title="Get all attacks Route"
                    method="GET"
                    endpoint="/api/attacks"
                    description="Get list of all attacks"
                    params={[]}
                  />
                  
                  <ApiRouteAccordion 
                    title="Stop attack Route"
                    method="POST"
                    endpoint="/api/attack/stop"
                    description="Stop a specific attack"
                    params={[
                      { name: 'id', type: 'number', description: 'Attack ID to stop' }
                    ]}
                  />
                  
                  <ApiRouteAccordion 
                    title="Stop all attacks Route"
                    method="POST"
                    endpoint="/api/attacks/stop-all"
                    description="Stop all running attacks"
                    params={[]}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}