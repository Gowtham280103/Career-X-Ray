import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Cpu,
  RefreshCw,
  ShieldCheck,
  Lock,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Bot,
  Database,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useCareerStore } from '../store/useCareerStore';
import { fetchAIStatus } from '../lib/apiClient';

export function AISettings() {
  const { aiStatus, setAIStatus } = useCareerStore();
  const [loading, setLoading] = useState(false);

  const checkStatus = async () => {
    setLoading(true);
    try {
      const status = await fetchAIStatus();
      setAIStatus(status);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isConnected = aiStatus?.connected ?? false;

  return (
    <div className="max-w-3xl mx-auto pb-16">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">AI Engine</h1>
        <p className="text-textSecondary">
          CareerBuddy uses local open-weight AI through Ollama. Your data stays on
          your device.
        </p>
      </div>

      {/* Status Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <Card
          className={`border-2 ${
            isConnected ? 'border-success/30 bg-success/5' : 'border-warning/30 bg-warning/5'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                  isConnected
                    ? 'bg-success/10 border border-success/20'
                    : 'bg-warning/10 border border-warning/20'
                }`}
              >
                {isConnected ? (
                  <Wifi size={24} className="text-success" />
                ) : (
                  <WifiOff size={24} className="text-warning" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isConnected ? 'bg-success animate-pulse' : 'bg-warning animate-pulse'
                    }`}
                  />
                  <span
                    className={`text-sm font-bold ${
                      isConnected ? 'text-success' : 'text-warning'
                    }`}
                  >
                    {isConnected ? 'LOCAL AI CONNECTED' : 'LOCAL AI OFFLINE'}
                  </span>
                </div>
                <p className="text-textSecondary text-sm">
                  {isConnected
                    ? 'Ollama is running and ready for local inference.'
                    : 'Ollama is not running. Demo mode is active.'}
                </p>
              </div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={checkStatus}
              className="gap-2 shrink-0"
              disabled={loading}
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              Refresh
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        {[
          {
            icon: Bot,
            label: 'Provider',
            value: aiStatus?.provider ?? 'Ollama',
            sub: 'Open-source local AI runtime',
          },
          {
            icon: Cpu,
            label: 'Model',
            value: isConnected
              ? (aiStatus?.model ?? 'Detecting...')
              : 'Not detected',
            sub: isConnected
              ? 'Active model for inference'
              : 'Start Ollama to detect model',
          },
          {
            icon: Database,
            label: 'Inference Mode',
            value: aiStatus?.inference ?? 'Local',
            sub: 'All computation runs on your device',
          },
          {
            icon: Lock,
            label: 'Data Privacy',
            value: 'LOCAL ONLY',
            sub: 'No data sent to external servers',
          },
        ].map((info) => (
          <motion.div
            key={info.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <info.icon size={16} className="text-primary" />
                </div>
                <p className="text-xs font-bold uppercase tracking-wider text-textMuted">
                  {info.label}
                </p>
              </div>
              <p className="text-lg font-bold text-white">{info.value}</p>
              <p className="text-xs text-textMuted mt-1">{info.sub}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Privacy Statement */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="mb-6 border-success/20 bg-success/5">
          <div className="flex items-start gap-4">
            <ShieldCheck size={22} className="text-success shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-white mb-2">Private by design</h3>
              <p className="text-sm text-textSecondary leading-relaxed">
                CareerBuddy runs AI inference entirely on your local machine using Ollama.
                Your resume, job descriptions, career goals, and practice sessions never
                leave your device. There are no external API calls, no telemetry, and no
                cloud storage.
              </p>
              <div className="mt-3 space-y-2">
                {[
                  'Resume text is analyzed locally',
                  'Interview answers are evaluated locally',
                  'Job match scores are computed locally',
                  'No account or signup required',
                ].map((point) => (
                  <div key={point} className="flex items-center gap-2 text-sm text-textSecondary">
                    <CheckCircle2 size={13} className="text-success shrink-0" />
                    {point}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Setup Guide */}
      {!isConnected && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-warning/20">
            <div className="flex items-start gap-3 mb-5">
              <AlertTriangle size={18} className="text-warning shrink-0 mt-0.5" />
              <h3 className="font-bold text-white">Ollama is not running</h3>
            </div>
            <p className="text-sm text-textSecondary mb-5 leading-relaxed">
              To enable local AI features, install and start Ollama on your device.
              CareerBuddy works in Demo Mode without it — but with Ollama, your
              Career X-Ray and Interview Coach use real AI.
            </p>
            <div className="space-y-3">
              {[
                {
                  step: '1',
                  title: 'Install Ollama',
                  cmd: 'Download from ollama.ai',
                  href: 'https://ollama.ai',
                },
                {
                  step: '2',
                  title: 'Pull a model',
                  cmd: 'ollama pull llama3.2',
                  href: null,
                },
                {
                  step: '3',
                  title: 'Start Ollama',
                  cmd: 'ollama serve',
                  href: null,
                },
                {
                  step: '4',
                  title: 'Click Refresh above',
                  cmd: 'CareerBuddy will detect the model automatically',
                  href: null,
                },
              ].map((s) => (
                <div key={s.step} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-warning/20 text-warning text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {s.step}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{s.title}</p>
                    {s.href ? (
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-primary flex items-center gap-1 mt-0.5 hover:underline"
                      >
                        {s.cmd}
                        <ExternalLink size={10} />
                      </a>
                    ) : (
                      <code className="text-xs text-success bg-surfaceLight px-2 py-0.5 rounded border border-border mt-0.5 block w-fit">
                        {s.cmd}
                      </code>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
