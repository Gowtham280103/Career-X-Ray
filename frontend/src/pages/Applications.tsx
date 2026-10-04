import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Briefcase,
  MapPin,
  CalendarDays,
  ChevronDown,
  Trash2,
  Edit3,
  X,
  Save,
  ArrowRight,
  AlertTriangle,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useCareerStore, type Application, type AppStage } from '../store/useCareerStore';
import { STAGE_CONFIG } from '../types';
import { cn } from '../lib/utils';

const STAGES: AppStage[] = [
  'Saved',
  'Applied',
  'Assessment',
  'Interview',
  'Final Round',
  'Offer',
  'Rejected',
];

const emptyForm: Omit<Application, 'id'> = {
  company: '',
  role: '',
  location: '',
  jobDescription: '',
  status: 'Saved',
  appliedDate: new Date().toISOString().split('T')[0],
  deadline: '',
  interviewDate: '',
  nextAction: '',
  notes: '',
  matchScore: undefined,
  salary: '',
};

function StageSelect({
  value,
  onChange,
}: {
  value: AppStage;
  onChange: (v: AppStage) => void;
}) {
  const [open, setOpen] = useState(false);
  const cfg = STAGE_CONFIG[value];
  return (
    <div className="relative">
      <button
        type="button"
        className={cn(
          'flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors',
          cfg.color,
          cfg.bg,
          cfg.border
        )}
        onClick={() => setOpen((v) => !v)}
      >
        {cfg.label}
        <ChevronDown size={12} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute top-full mt-2 left-0 z-50 bg-surface border border-border rounded-xl shadow-2xl overflow-hidden min-w-[160px]"
          >
            {STAGES.map((s) => {
              const c = STAGE_CONFIG[s];
              return (
                <button
                  key={s}
                  type="button"
                  className={cn(
                    'w-full text-left flex items-center gap-2 px-4 py-2.5 text-xs font-semibold transition-colors hover:bg-surfaceLight',
                    c.color
                  )}
                  onClick={() => {
                    onChange(s);
                    setOpen(false);
                  }}
                >
                  {c.label}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ApplicationModal({
  initial,
  onSave,
  onClose,
}: {
  initial?: Application;
  onSave: (app: Omit<Application, 'id'>) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<Omit<Application, 'id'>>(
    initial ? { ...initial } : { ...emptyForm }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.company || !form.role) return;
    onSave(form);
    onClose();
  };

  const field = (
    label: string,
    key: keyof typeof form,
    placeholder = '',
    type = 'text',
    required = false
  ) => (
    <div>
      <label className="block text-xs font-semibold text-textMuted mb-1.5 uppercase tracking-wider">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <input
        type={type}
        className="w-full bg-surfaceLight border border-border rounded-lg px-3 py-2.5 text-sm text-white placeholder-textMuted focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
        placeholder={placeholder}
        value={typeof form[key] === 'number' ? String(form[key] ?? '') : (form[key] as string) ?? ''}
        onChange={(e) =>
          setForm((f) => ({
            ...f,
            [key]: type === 'number' ? Number(e.target.value) : e.target.value,
          }))
        }
        required={required}
      />
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-surface border border-border rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">
            {initial ? 'Edit Application' : 'New Application'}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surfaceLight text-textMuted hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {field('Company', 'company', 'e.g. Google', 'text', true)}
            {field('Role', 'role', 'e.g. Software Engineer', 'text', true)}
          </div>
          {field('Location', 'location', 'e.g. Bangalore (Hybrid)')}
          {field('Salary Range', 'salary', 'e.g. 8–12 LPA')}
          <div>
            <label className="block text-xs font-semibold text-textMuted mb-1.5 uppercase tracking-wider">
              Stage
            </label>
            <StageSelect
              value={form.status}
              onChange={(v) => setForm((f) => ({ ...f, status: v }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {field('Applied Date', 'appliedDate', '', 'date')}
            {field('Interview Date', 'interviewDate', '', 'date')}
          </div>
          {field('Deadline', 'deadline', '', 'date')}
          <div>
            <label className="block text-xs font-semibold text-textMuted mb-1.5 uppercase tracking-wider">
              Job Description
            </label>
            <textarea
              className="w-full bg-surfaceLight border border-border rounded-lg px-3 py-2.5 text-sm text-white placeholder-textMuted focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none h-24"
              placeholder="Paste the job description..."
              value={form.jobDescription}
              onChange={(e) => setForm((f) => ({ ...f, jobDescription: e.target.value }))}
            />
          </div>
          {field('Next Action', 'nextAction', 'e.g. Follow up on Friday')}
          <div>
            <label className="block text-xs font-semibold text-textMuted mb-1.5 uppercase tracking-wider">
              Notes
            </label>
            <textarea
              className="w-full bg-surfaceLight border border-border rounded-lg px-3 py-2.5 text-sm text-white placeholder-textMuted focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none h-20"
              placeholder="Any notes about this application..."
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" className="flex-1 gap-2">
              <Save size={16} />
              {initial ? 'Save Changes' : 'Add Application'}
            </Button>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export function Applications() {
  const { applications, addApplication, updateApplication, deleteApplication, moveApplicationStage } =
    useCareerStore();
  const [showModal, setShowModal] = useState(false);
  const [editApp, setEditApp] = useState<Application | undefined>(undefined);
  const [filterStage, setFilterStage] = useState<AppStage | 'ALL'>('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered =
    filterStage === 'ALL'
      ? applications
      : applications.filter((a) => a.status === filterStage);

  const attentionApps = applications.filter((a) =>
    ['Assessment', 'Interview'].includes(a.status)
  );

  return (
    <div className="max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Applications</h1>
          <p className="text-textSecondary">
            {applications.length} total · {attentionApps.length} need attention
          </p>
        </div>
        <Button
          onClick={() => {
            setEditApp(undefined);
            setShowModal(true);
          }}
          className="gap-2 self-start md:self-auto"
        >
          <Plus size={18} />
          New Application
        </Button>
      </div>

      {/* Attention Banner */}
      {attentionApps.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-xl bg-warning/10 border border-warning/30 flex items-start gap-3"
        >
          <AlertTriangle size={16} className="text-warning shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-warning">Action Required</p>
            <p className="text-sm text-textSecondary mt-0.5">
              {attentionApps.map((a) => a.company).join(', ')} — these applications need your attention.
            </p>
          </div>
        </motion.div>
      )}

      {/* Stage Pipeline summary */}
      <div className="grid grid-cols-3 md:grid-cols-7 gap-2 mb-8">
        {STAGES.map((stage) => {
          const count = applications.filter((a) => a.status === stage).length;
          const cfg = STAGE_CONFIG[stage];
          return (
            <button
              key={stage}
              onClick={() => setFilterStage(filterStage === stage ? 'ALL' : stage)}
              className={cn(
                'rounded-xl p-3 border text-center transition-all',
                filterStage === stage
                  ? `${cfg.bg} ${cfg.border}`
                  : 'bg-surfaceLight/50 border-border hover:border-primary/20'
              )}
            >
              <p className={cn('text-xl font-bold', filterStage === stage ? cfg.color : 'text-white')}>
                {count}
              </p>
              <p className="text-[10px] text-textMuted mt-0.5 leading-tight">{stage}</p>
            </button>
          );
        })}
      </div>

      {/* Applications List */}
      <div className="space-y-3">
        <AnimatePresence>
          {filtered.map((app) => {
            const cfg = STAGE_CONFIG[app.status];
            const isExpanded = expandedId === app.id;

            return (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div
                  className={cn(
                    'rounded-2xl border bg-surface transition-all',
                    isExpanded ? 'border-primary/30' : 'border-border hover:border-primary/20'
                  )}
                >
                  {/* Main row */}
                  <div
                    className="p-5 flex items-center gap-4 cursor-pointer"
                    onClick={() => setExpandedId(isExpanded ? null : app.id)}
                  >
                    <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-lg font-bold text-primary shrink-0">
                      {app.company.charAt(0)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-bold text-white">{app.company}</p>
                        {app.salary && (
                          <span className="text-xs text-success bg-success/10 border border-success/20 px-2 py-0.5 rounded-full">
                            {app.salary}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-textSecondary mt-0.5">{app.role}</p>
                      {app.location && (
                        <p className="text-xs text-textMuted mt-1 flex items-center gap-1">
                          <MapPin size={10} />
                          {app.location}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {app.matchScore && (
                        <div className="hidden md:flex flex-col items-center">
                          <span className="text-lg font-bold text-white">{app.matchScore}%</span>
                          <span className="text-[10px] text-textMuted">match</span>
                        </div>
                      )}
                      <StageSelect
                        value={app.status}
                        onChange={(s) => moveApplicationStage(app.id, s)}
                      />
                      <ChevronDown
                        size={16}
                        className={cn(
                          'text-textMuted transition-transform',
                          isExpanded && 'rotate-180'
                        )}
                      />
                    </div>
                  </div>

                  {/* Expanded details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden border-t border-border"
                      >
                        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div className="space-y-4">
                            {app.nextAction && (
                              <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-textMuted mb-1.5">
                                  Next Action
                                </p>
                                <p className="text-sm text-white flex items-start gap-2">
                                  <ArrowRight size={14} className="text-primary shrink-0 mt-0.5" />
                                  {app.nextAction}
                                </p>
                              </div>
                            )}
                            {app.interviewDate && (
                              <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-textMuted mb-1.5">
                                  Interview Date
                                </p>
                                <p className="text-sm text-primary flex items-center gap-2">
                                  <CalendarDays size={13} />
                                  {new Date(app.interviewDate).toLocaleDateString('en-US', {
                                    weekday: 'short',
                                    month: 'short',
                                    day: 'numeric',
                                  })}
                                </p>
                              </div>
                            )}
                            {app.deadline && (
                              <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-textMuted mb-1.5">
                                  Deadline
                                </p>
                                <p className="text-sm text-warning flex items-center gap-2">
                                  <CalendarDays size={13} />
                                  {new Date(app.deadline).toLocaleDateString()}
                                </p>
                              </div>
                            )}
                          </div>
                          <div className="space-y-4">
                            {app.notes && (
                              <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-textMuted mb-1.5">
                                  Notes
                                </p>
                                <p className="text-sm text-textSecondary leading-relaxed">
                                  {app.notes}
                                </p>
                              </div>
                            )}
                            {app.appliedDate && (
                              <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-textMuted mb-1.5">
                                  Applied
                                </p>
                                <p className="text-sm text-textSecondary">
                                  {new Date(app.appliedDate).toLocaleDateString()}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="px-5 pb-5 flex items-center gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            className="gap-1.5"
                            onClick={() => {
                              setEditApp(app);
                              setShowModal(true);
                            }}
                          >
                            <Edit3 size={13} />
                            Edit
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            className="gap-1.5"
                            onClick={() => deleteApplication(app.id)}
                          >
                            <Trash2 size={13} />
                            Delete
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Briefcase size={40} className="text-textMuted mx-auto mb-4" />
            <p className="text-textSecondary font-medium">No applications here yet.</p>
            <p className="text-sm text-textMuted mt-1">
              {filterStage !== 'ALL'
                ? `No applications in "${filterStage}" stage.`
                : 'Click "New Application" to start tracking.'}
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <ApplicationModal
            initial={editApp}
            onSave={(data) => {
              if (editApp) {
                updateApplication(editApp.id, data);
              } else {
                addApplication(data);
              }
            }}
            onClose={() => {
              setShowModal(false);
              setEditApp(undefined);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
