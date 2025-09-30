import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import Icon from '@/components/ui/icon';

interface DocSection {
  id: string;
  title: string;
  icon: string;
  content: {
    subtitle: string;
    text: string;
    code?: string;
    steps?: string[];
  }[];
}

export default function Documentation() {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('getting-started');

  const currentUser = localStorage.getItem('current_user');

  if (!currentUser) {
    navigate('/');
    return null;
  }

  const docSections: DocSection[] = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: 'Rocket',
      content: [
        {
          subtitle: 'Welcome to Kodein Services',
          text: 'Kodein Services provides powerful DDoS testing capabilities for network security professionals. This documentation will guide you through all features and best practices.',
        },
        {
          subtitle: 'Quick Start',
          text: 'Follow these steps to launch your first attack:',
          steps: [
            'Navigate to the Attacks page from the sidebar',
            'Enter target IP address or domain',
            'Select port number (80, 443, etc.)',
            'Choose attack method (UDP, TCP, HTTP, ICMP)',
            'Set duration in seconds',
            'Click "Launch Attack" button'
          ]
        },
        {
          subtitle: 'Important Notes',
          text: '⚠️ Only use this service for authorized testing on systems you own or have explicit permission to test. Unauthorized DDoS attacks are illegal and punishable by law.',
        }
      ]
    },
    {
      id: 'attack-methods',
      title: 'Attack Methods',
      icon: 'Zap',
      content: [
        {
          subtitle: 'UDP Flood',
          text: 'User Datagram Protocol flood attack sends large volumes of UDP packets to random ports on the target. Best for testing network bandwidth capacity.',
          code: 'Method: UDP\nPort: Any\nEffective against: Bandwidth-limited targets\nDuration: 30-300s recommended'
        },
        {
          subtitle: 'TCP SYN',
          text: 'TCP SYN flood exploits the three-way handshake by sending multiple SYN requests without completing the connection. Tests connection state table capacity.',
          code: 'Method: TCP\nPort: 80, 443, 8080\nEffective against: Web servers, connection tables\nDuration: 60-600s recommended'
        },
        {
          subtitle: 'HTTP Flood',
          text: 'Application layer attack that sends legitimate-looking HTTP requests to overwhelm web servers. Most effective against web applications.',
          code: 'Method: HTTP\nPort: 80, 443\nEffective against: Web applications, APIs\nDuration: 120-600s recommended'
        },
        {
          subtitle: 'ICMP Flood',
          text: 'Internet Control Message Protocol flood (Ping Flood) sends rapid ICMP echo requests to consume bandwidth and processing power.',
          code: 'Method: ICMP\nPort: N/A\nEffective against: Network devices, routers\nDuration: 30-180s recommended'
        }
      ]
    },
    {
      id: 'plans-billing',
      title: 'Plans & Billing',
      icon: 'CreditCard',
      content: [
        {
          subtitle: 'Choosing the Right Plan',
          text: 'Select a plan based on your testing requirements:',
          steps: [
            'Basic ($10/mo): Single concurrent attack, ideal for beginners',
            'Standard ($25/mo): 3 concurrent attacks, includes API access',
            'Premium ($50/mo): 5 concurrent attacks, extended duration',
            'Ultimate ($100/mo): 10 concurrent attacks, all methods, custom scripts'
          ]
        },
        {
          subtitle: 'Adding Funds',
          text: 'Deposit funds using multiple payment methods:',
          steps: [
            'Navigate to Deposit page',
            'Select payment method (Crypto, PayPal, Credit Card)',
            'Enter deposit amount (minimum varies by method)',
            'Complete payment through secure gateway',
            'Funds appear in your account within 10-30 minutes'
          ]
        },
        {
          subtitle: 'Billing Cycle',
          text: 'Plans are billed monthly. Auto-renewal can be enabled in settings. Unused funds roll over to the next billing cycle.',
        }
      ]
    },
    {
      id: 'api-access',
      title: 'API Access',
      icon: 'Code',
      content: [
        {
          subtitle: 'API Authentication',
          text: 'Standard plan and above include API access. Authenticate using your API key from the dashboard.',
          code: 'curl -X POST https://api.kodein.services/v1/attack \\\n  -H "X-Api-Key: your_api_key_here" \\\n  -H "Content-Type: application/json" \\\n  -d \'{\n    "target": "192.168.1.1",\n    "port": 80,\n    "method": "UDP",\n    "duration": 60\n  }\''
        },
        {
          subtitle: 'List Active Attacks',
          text: 'Retrieve all active attacks for your account:',
          code: 'curl -X GET https://api.kodein.services/v1/attacks \\\n  -H "X-Api-Key: your_api_key_here"'
        },
        {
          subtitle: 'Stop an Attack',
          text: 'Terminate a running attack by ID:',
          code: 'curl -X DELETE https://api.kodein.services/v1/attack/:id \\\n  -H "X-Api-Key: your_api_key_here"'
        },
        {
          subtitle: 'Rate Limits',
          text: 'API requests are limited based on your plan tier. Standard: 100 req/hour, Premium: 500 req/hour, Ultimate: Unlimited.',
        }
      ]
    },
    {
      id: 'best-practices',
      title: 'Best Practices',
      icon: 'Shield',
      content: [
        {
          subtitle: 'Legal Compliance',
          text: 'Always ensure you have written authorization before testing any network or system. Unauthorized access is illegal in most jurisdictions.',
          steps: [
            'Obtain written permission from system owners',
            'Document the scope and timeline of testing',
            'Notify relevant parties before initiating tests',
            'Keep logs of all testing activities',
            'Report findings responsibly'
          ]
        },
        {
          subtitle: 'Testing Guidelines',
          text: 'Follow these guidelines for effective and responsible testing:',
          steps: [
            'Start with lower intensity attacks',
            'Monitor target system response',
            'Use appropriate attack duration',
            'Test during off-peak hours when possible',
            'Have mitigation strategies ready',
            'Document all test results'
          ]
        },
        {
          subtitle: 'Security Considerations',
          text: 'Protect your account and testing activities:',
          steps: [
            'Use strong, unique passwords',
            'Enable two-factor authentication (if available)',
            'Never share your API keys',
            'Regularly review account activity',
            'Use VPN for additional privacy'
          ]
        }
      ]
    },
    {
      id: 'faq',
      title: 'FAQ',
      icon: 'HelpCircle',
      content: [
        {
          subtitle: 'How long do attacks take to start?',
          text: 'Attacks typically begin within 5-10 seconds after launching. You will see real-time status updates in the dashboard.',
        },
        {
          subtitle: 'Can I run multiple attacks simultaneously?',
          text: 'Yes, depending on your plan. Basic allows 1, Standard allows 3, Premium allows 5, and Ultimate allows 10 concurrent attacks.',
        },
        {
          subtitle: 'What happens if my attack fails?',
          text: 'Failed attacks are not charged to your account. Check the error message in the dashboard for details and try adjusting your parameters.',
        },
        {
          subtitle: 'How do I cancel my subscription?',
          text: 'Navigate to Plans page and click "Cancel Subscription". Your access will continue until the end of the current billing period.',
        },
        {
          subtitle: 'Is customer support available?',
          text: 'Yes! Join our Telegram channel for 24/7 community support and direct access to our technical team.',
        }
      ]
    },
    {
      id: 'support',
      title: 'Support',
      icon: 'MessageCircle',
      content: [
        {
          subtitle: 'Contact Us',
          text: 'Get help from our support team:',
          steps: [
            'Telegram: @join_kodein (24/7 community support)',
            'Email: support@kodein.services',
            'Response time: < 24 hours',
            'Emergency support available for Premium+ plans'
          ]
        },
        {
          subtitle: 'Common Issues',
          text: 'Before contacting support, check these common solutions:',
          steps: [
            'Clear browser cache and cookies',
            'Verify your internet connection',
            'Check that you have sufficient account balance',
            'Ensure target is not blocking ICMP/UDP packets',
            'Review API rate limits if using API access'
          ]
        }
      ]
    }
  ];

  const currentSection = docSections.find(s => s.id === activeSection) || docSections[0];

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white">
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
        <div className="flex">
          <div className="w-64 border-r border-gray-800 h-screen sticky top-0 overflow-y-auto bg-[#0a0a0a]">
            <div className="p-4">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Documentation</h2>
              <nav className="space-y-1">
                {docSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                      activeSection === section.id
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Icon name={section.icon} size={18} />
                    {section.title}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          <div className="flex-1 p-8 max-w-4xl">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <Icon name={currentSection.icon} size={32} className="text-purple-400" />
                <h1 className="text-3xl font-bold">{currentSection.title}</h1>
              </div>
            </div>

            <div className="space-y-8">
              {currentSection.content.map((item, index) => (
                <div key={index} className="bg-[#0f0f0f] border border-gray-800 rounded-lg p-6">
                  <h2 className="text-xl font-semibold mb-4">{item.subtitle}</h2>
                  <p className="text-gray-300 mb-4 leading-relaxed">{item.text}</p>
                  
                  {item.code && (
                    <pre className="bg-black border border-gray-800 rounded-lg p-4 overflow-x-auto">
                      <code className="text-sm text-gray-300 font-mono">{item.code}</code>
                    </pre>
                  )}
                  
                  {item.steps && (
                    <ul className="space-y-2">
                      {item.steps.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="text-gray-300">{step}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-12 bg-purple-900/20 border border-purple-500/30 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <Icon name="AlertCircle" size={24} className="text-purple-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-purple-300 mb-2">Need Help?</h3>
                  <p className="text-gray-300 text-sm mb-3">
                    Can't find what you're looking for? Our support team is ready to help you 24/7.
                  </p>
                  <a
                    href="https://t.me/join_kodein"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    <Icon name="Send" size={16} />
                    Join Telegram Support
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
