import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Command, X, ScanSearch, Briefcase, MessageSquare, Zap } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useCareerStore } from '../../store/useCareerStore';
import { cn } from '../../lib/utils';

const COMMANDS = [
  { icon: Zap, label: 'Go to Dashboard', path: '/dashboard', shortcut: 'D' },
  { icon: ScanSearch, label: 'Run Career X-Ray', path: '/xray', shortcut: 'X' },
  { icon: Briefcase, label: 'View Applications', path: '/applications', shortcut: 'A' },
  { icon: MessageSquare, label: 'Practice Interview', path: '/interview', shortcut: 'I' },
];

function CommandPalette({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const filtered = COMMANDS.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase())
  );

  const run = useCallback(
    (path: string) => {
      navigate(path);
      onClose();
    },
    [navigate, onClose]
  );

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -16 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-lg bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
          <Search size={16} className="text-textMuted shrink-0" />
          <input
            autoFocus
            className="flex-1 bg-transparent text-white placeholder-textMuted text-base outline-none"
            placeholder="Search commands..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-surfaceLight text-textMuted hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        <div className="p-2 max-h-80 overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="text-center text-sm text-textMuted py-8">No commands found.</p>
          ) : (
            filtered.map((cmd) => (
              <button
                key={cmd.path}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surfaceLight transition-colors text-left group"
                onClick={() => run(cmd.path)}
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <cmd.icon size={15} className="text-primary" />
                </div>
                <span className="text-sm text-white flex-1">{cmd.label}</span>
                <span className="text-xs text-textMuted bg-surfaceLight/50 border border-border px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {cmd.shortcut}
                </span>
              </button>
            ))
          )}
        </div>
        <div className="px-5 py-3 border-t border-border flex items-center gap-4 text-xs text-textMuted">
          <span className="flex items-center gap-1"><Command size={10} /> K</span>
          <span>to open · Esc to close</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function TopBar() {
  const [showPalette, setShowPalette] = useState(false);
  const { user } = useCareerStore();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowPalette((v) => !v);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <>
      <header className="h-16 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-6">
        <div className="flex-1" />
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPalette(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surfaceLight border border-border text-textSecondary text-sm hover:text-white hover:border-textMuted transition-colors"
          >
            <Search size={13} />
            <span className="hidden sm:inline">Search commands...</span>
            <div className="flex items-center gap-0.5 ml-1 text-xs bg-surface px-1.5 py-0.5 rounded text-textMuted border border-border">
              <Command size={9} />K
            </div>
          </button>

          {user && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/5 border border-primary/20">
              <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-primary to-violet-400 flex items-center justify-center text-white text-xs font-bold">
                {user.name.charAt(0)}
              </div>
              <span className="text-sm font-medium text-white">{user.name}</span>
            </div>
          )}
        </div>
      </header>

      <AnimatePresence>
        {showPalette && <CommandPalette onClose={() => setShowPalette(false)} />}
      </AnimatePresence>
    </>
  );
}
