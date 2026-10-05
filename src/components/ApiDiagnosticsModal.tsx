import React, { useState } from 'react';
import {
  X,
  Activity,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Terminal,
  Server,
  Zap,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';

interface ApiDiagnosticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiStatus: 'checking' | 'connected' | 'offline';
  apiInfo: any;
  onRecheck: () => Promise<void>;
  forceClientEngine: boolean;
  setForceClientEngine: (val: boolean) => void;
}

export const ApiDiagnosticsModal: React.FC<ApiDiagnosticsModalProps> = ({
  isOpen,
  onClose,
  apiStatus,
  apiInfo,
  onRecheck,
  forceClientEngine,
  setForceClientEngine,
}) => {
  const [testingEndpoint, setTestingEndpoint] = useState(false);
  const [testResult, setTestResult] = useState<{
    status: number;
    latencyMs: number;
    data: any;
    error?: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleRunTest = async () => {
    setTestingEndpoint(true);
    const start = performance.now();
    try {
      const res = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Diagnostic ping from API Monitor',
          model: 'gemini-3.8-flash',
        }),
      });
      const latencyMs = Math.round(performance.now() - start);
      let data = null;
      try {
        data = await res.json();
      } catch (err) {
        data = await res.text();
      }

      setTestResult({
        status: res.status,
        latencyMs,
        data,
      });
      if (res.ok) {
        await onRecheck();
      }
    } catch (err: any) {
      const latencyMs = Math.round(performance.now() - start);
      setTestResult({
        status: 0,
        latencyMs,
        data: null,
        error: err.message || 'Network fetch failed (Connection Refused or Server Offline)',
      });
    } finally {
      setTestingEndpoint(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in select-none">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#11141e] border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <Activity className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
                API Connection & Diagnostics
                <span
                  className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded-full ${
                    apiStatus === 'connected'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : apiStatus === 'checking'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {apiStatus === 'connected' ? 'Connected (200 OK)' : apiStatus === 'checking' ? 'Checking...' : 'Offline (404/Refused)'}
                </span>
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300">
          {/* Status Overview Card */}
          <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-200 flex items-center gap-2">
                <Server className="w-4 h-4 text-cyan-400" /> Express Backend Endpoint (/api)
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={onRecheck}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium transition-colors flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3 h-3 text-cyan-400" /> Ping Health
                </button>
                <button
                  onClick={handleRunTest}
                  disabled={testingEndpoint}
                  className="px-3 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-[11px] font-semibold transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                >
                  {testingEndpoint ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
                  Test /api/agent/chat
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[11px] font-mono">
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="text-slate-500 text-[10px] uppercase">Express Route</div>
                <div className="text-slate-200 font-semibold mt-0.5">/api/agent/chat</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="text-slate-500 text-[10px] uppercase">Gemini Service</div>
                <div className="text-emerald-400 font-semibold mt-0.5">
                  {apiInfo?.geminiConfigured ? 'Active (Ready)' : 'Fallback Ready'}
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="text-slate-500 text-[10px] uppercase">Vector Engine</div>
                <div className="text-cyan-400 font-semibold mt-0.5">Qdrant In-Memory</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="text-slate-500 text-[10px] uppercase">Current Mode</div>
                <div className={forceClientEngine ? 'text-amber-400 font-semibold mt-0.5' : 'text-emerald-400 font-semibold mt-0.5'}>
                  {forceClientEngine ? 'Client Standalone' : 'Full-Stack Server'}
                </div>
              </div>
            </div>
          </div>

          {/* Test Result Display if run */}
          {testResult && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-900/40 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-cyan-300 flex items-center gap-1.5">
                  {testResult.status === 200 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                  )}
                  Endpoint Test Response: {testResult.status ? `HTTP ${testResult.status}` : 'Connection Error'}
                </span>
                <span className="text-slate-400 font-mono">{testResult.latencyMs}ms</span>
              </div>
              <div className="bg-slate-900/90 rounded-xl p-3 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-40 border border-slate-800">
                {testResult.error ? (
                  <span className="text-rose-400">{testResult.error}</span>
                ) : (
                  <pre>{JSON.stringify(testResult.data, null, 2)}</pre>
                )}
              </div>
            </div>
          )}

          {/* 404 Error Explanation & Troubleshooting Guide */}
          <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-800/30 space-y-3">
            <div className="flex items-center gap-2 text-amber-300 font-semibold">
              <HelpCircle className="w-4 h-4 shrink-0" />
              <span>Understanding the ":4173/api/agent/chat:1 404 (Not Found)" Error</span>
            </div>
            <div className="space-y-2 text-slate-300 leading-relaxed text-[11px]">
              <p>
                Port <code className="px-1.5 py-0.5 rounded bg-slate-900 text-amber-300 font-mono font-bold">4173</code> is Vite’s default preview port (<code className="px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 font-mono">vite preview</code>). When Vite runs preview by itself, it only serves the static <code className="px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 font-mono">dist/</code> bundle without running the Express backend (<code className="px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 font-mono">server.ts</code>).
              </p>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5 font-mono text-[11px]">
                <div className="text-slate-400 font-bold flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" /> How to run properly:
                </div>
                <div className="text-emerald-400">
                  # 1. Full-Stack Development (Express + Vite middlewares on Port 3000):
                </div>
                <div className="text-slate-200 pl-4 bg-slate-900 py-1 rounded">npm run dev</div>
                <div className="text-emerald-400 pt-1">
                  # 2. Production Full-Stack Build & Preview:
                </div>
                <div className="text-slate-200 pl-4 bg-slate-900 py-1 rounded">npm run preview</div>
                <div className="text-slate-400 text-[10px] pl-4">
                  (Configured to start server.ts with production assets on port 3000)
                </div>
              </div>
              <p>
                We have also configured Vite preview proxy settings in <code className="px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 font-mono">vite.config.ts</code> so that if someone runs <code className="px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 font-mono">vite preview</code> on port 4173, any <code className="px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 font-mono">/api/*</code> requests automatically proxy to the Express server on port 3000!
              </p>
            </div>
          </div>

          {/* Fallback Engine Mode Toggle */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div>
              <div className="font-semibold text-slate-200">Execution Mode Override</div>
              <div className="text-[11px] text-slate-400">
                Switch between server-side API processing and client-side autonomous engine
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setForceClientEngine(false)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  !forceClientEngine
                    ? 'bg-cyan-600 text-white shadow-md'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Auto (Express API)
              </button>
              <button
                onClick={() => setForceClientEngine(true)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  forceClientEngine
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Force Client Engine
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-900/40 flex items-center justify-between">
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Express Server is active on port 3000
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
