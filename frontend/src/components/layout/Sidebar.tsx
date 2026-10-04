import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ScanSearch,
  Briefcase,
  MessageSquare,
  Settings,
  ShieldCheck,
  Bot,
  Zap,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useEffect } from 'react';
import { fetchAIStatus } from '../../lib/apiClient';
import { useCareerStore } from '../../store/useCareerStore';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: ScanSearch, label: 'Career X-Ray', path: '/xray', highlight: true },
  { icon: Briefcase, label: 'Applications', path: '/applications' },
  { icon: MessageSquare, label: 'Interview Coach', path: '/interview' },
];

const bottomNavItems = [
  { icon: Settings, label: 'AI Settings', path: '/settings' },
];

export function Sidebar() {
  const { aiStatus, setAIStatus, user } = useCareerStore();

  useEffect(() => {
    fetchAIStatus().then(setAIStatus).catch(() => {});
  }, [setAIStatus]);

  const isConnected = aiStatus?.connected ?? false;

  return (
    <aside className="w-64 h-screen bg-surface border-r border-border hidden md:flex flex-col fixed left-0 top-0 z-30">
      {/* Logo */}
      <div className="p-6 border-b border-border/50">
        <NavLink to="/dashboard" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-primary shadow-[0_0_15px_rgba(99,102,241,0.4)] flex items-center justify-center">
            <Bot size={16} className="text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">CareerBuddy</span>
        </NavLink>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium group',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : item.highlight
                  ? 'text-primary/80 hover:bg-primary/5 hover:text-primary'
                  : 'text-textSecondary hover:text-white hover:bg-surfaceLight'
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  size={18}
                  className={cn(
                    'transition-all',
                    isActive ? 'text-primary' : ''
                  )}
                />
                <span>{item.label}</span>
                {item.label === 'Career X-Ray' && (
                  <span className="ml-auto text-[9px] font-bold uppercase tracking-wider bg-primary/20 text-primary px-1.5 py-0.5 rounded">
                    AI
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}

        <div className="my-4 h-px bg-border mx-2" />

        {bottomNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-textSecondary hover:text-white hover:bg-surfaceLight'
              )
            }
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border/50 space-y-3">
        {/* AI Status Badge */}
        <div className="rounded-xl p-3 border bg-surfaceLight/50 border-border">
          <div className="flex items-start gap-2.5">
            <ShieldCheck
              size={15}
              className={isConnected ? 'text-success shrink-0 mt-0.5' : 'text-warning shrink-0 mt-0.5'}
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span
                  className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                    isConnected ? 'bg-success animate-pulse' : 'bg-warning animate-pulse'
                  }`}
                />
                <span className="text-xs font-bold text-white">
                  {isConnected ? 'LOCAL AI' : 'DEMO MODE'}
                </span>
              </div>
              <p className="text-[10px] text-textMuted leading-snug truncate">
                {isConnected
                  ? `${aiStatus?.provider} · ${aiStatus?.model}`
                  : 'Ollama offline · deterministic fallback'}
              </p>
            </div>
          </div>
        </div>

        {/* User profile */}
        {user && (
          <div className="flex items-center gap-3 px-2 py-1.5 rounded-xl hover:bg-surfaceLight cursor-pointer transition-colors">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-violet-400 flex items-center justify-center text-white font-bold text-sm shrink-0">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user.name}</p>
              <p className="text-xs text-textMuted truncate">{user.targetRole}</p>
            </div>
            <Zap size={12} className="text-primary shrink-0" />
          </div>
        )}
      </div>
    </aside>
  );
}
