import { Outlet } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { LayoutDashboard, ScanSearch, Briefcase, MessageSquare, Settings } from 'lucide-react';
import { cn } from '../../lib/utils';

const mobileNav = [
  { icon: LayoutDashboard, label: 'Home', path: '/dashboard' },
  { icon: ScanSearch, label: 'X-Ray', path: '/xray' },
  { icon: Briefcase, label: 'Jobs', path: '/applications' },
  { icon: MessageSquare, label: 'Coach', path: '/interview' },
  { icon: Settings, label: 'AI', path: '/settings' },
];

export function AppLayout() {
  return (
    <div className="min-h-screen bg-background text-text flex">
      <Sidebar />

      <div className="flex-1 md:ml-64 flex flex-col min-w-0">
        <TopBar />
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8 max-w-7xl mx-auto w-full pb-24 md:pb-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-surface/95 backdrop-blur-xl border-t border-border">
        <div className="flex items-center justify-around px-2 py-2">
          {mobileNav.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all text-xs font-medium min-w-0',
                  isActive ? 'text-primary' : 'text-textMuted hover:text-textSecondary'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    size={20}
                    className={isActive ? 'text-primary' : 'text-textMuted'}
                  />
                  <span className="truncate">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
