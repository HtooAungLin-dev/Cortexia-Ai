import React, { useState, useEffect } from 'react';
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
  Globe,
  Save,
  RotateCcw,
  Layers,
  ArrowRight,
  Copy,
  Check,
} from 'lucide-react';
import {
  getBackendUrl,
  setBackendUrl,
  resetBackendUrl,
  checkBackendHealth,
  sendChatMessage,
} from '../services/apiClient';

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
    targetUrl?: string;
  } | null>(null);

  // Custom Backend URL state
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [savedUrl, setSavedUrl] = useState('');
  const [urlSaveSuccess, setUrlSaveSuccess] = useState(false);
  const [testingCustomUrl, setTestingCustomUrl] = useState(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const current = getBackendUrl();
      setSavedUrl(current);
      setCustomUrlInput(current);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleSaveBackendUrl = async () => {
    setBackendUrl(customUrlInput);
    setSavedUrl(customUrlInput.trim().replace(/\/+$/, ''));
    setUrlSaveSuccess(true);
    setTimeout(() => setUrlSaveSuccess(false), 2500);
    await onRecheck();
  };

  const handleResetBackendUrl = async () => {
    resetBackendUrl();
    setSavedUrl('');
    setCustomUrlInput('');
    setUrlSaveSuccess(true);
    setTimeout(() => setUrlSaveSuccess(false), 2500);
    await onRecheck();
  };

  const handleTestBackend = async () => {
    setTestingEndpoint(true);
    const start = performance.now();
    try {
      const chatRes = await sendChatMessage({
        message: 'Diagnostics connection verification test ping',
        model: 'gemini-2.5-flash',
      });
      const latencyMs = Math.round(performance.now() - start);

      setTestResult({
        status: chatRes.ok ? 200 : (chatRes.statusCode || 500),
        latencyMs,
        data: chatRes.data,
        error: chatRes.ok ? undefined : (chatRes.error || 'Connection failed'),
        targetUrl: chatRes.url,
      });

      if (chatRes.ok) {
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

  const currentDisplayUrl = savedUrl ? savedUrl : 'Same-Origin (/api)';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in select-none">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#11141e] border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <Activity className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
                API Diagnostics & Separate Hosting
                <span
                  className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded-full ${
                    apiStatus === 'connected'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : apiStatus === 'checking'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {apiStatus === 'connected' ? 'Connected (200 OK)' : apiStatus === 'checking' ? 'Checking...' : 'Offline / Standalone Client'}
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
          {/* Section 1: Separate Hosting / Custom Backend URL */}
          <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-800/40 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-semibold text-cyan-300">
                <Globe className="w-4 h-4 text-cyan-400" />
                <span>Backend Host URL (Separate Hosting Support)</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                Active: <span className="text-cyan-300 font-bold">{currentDisplayUrl}</span>
              </span>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed">
              If your frontend is hosted separately on <span className="text-white font-medium">Vercel, Netlify, or Cloudflare</span> and your backend is on <span className="text-white font-medium">Render, Railway, Cloud Run, or a VPS</span>, paste your backend URL below or set <code className="px-1 py-0.5 rounded bg-slate-900 text-cyan-300 font-mono font-semibold">VITE_API_BASE_URL</code> in your frontend hosting environment variables.
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="https://your-backend.onrender.com (empty for local /api)"
                value={customUrlInput}
                onChange={(e) => setCustomUrlInput(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-cyan-500 placeholder:text-slate-500"
              />
              <button
                onClick={handleSaveBackendUrl}
                className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold transition-colors flex items-center gap-1.5 shadow-sm text-xs cursor-pointer"
              >
                {urlSaveSuccess ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Save className="w-3.5 h-3.5" />}
                {urlSaveSuccess ? 'Saved!' : 'Save URL'}
              </button>
              {savedUrl && (
                <button
                  onClick={handleResetBackendUrl}
                  title="Reset to local same-origin /api"
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1 text-xs cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Section 2: Status Overview Card */}
          <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-200 flex items-center gap-2">
                <Server className="w-4 h-4 text-cyan-400" /> Backend Connectivity & Probes
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={onRecheck}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3 text-cyan-400" /> Ping /health
                </button>
                <button
                  onClick={handleTestBackend}
                  disabled={testingEndpoint}
                  className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-[11px] font-semibold transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {testingEndpoint ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
                  Test Chat Endpoint
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[11px] font-mono">
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="text-slate-500 text-[10px] uppercase">Route Target</div>
                <div className="text-slate-200 font-semibold mt-0.5 truncate" title={currentDisplayUrl}>
                  {savedUrl ? savedUrl : '/api/agent/chat'}
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="text-slate-500 text-[10px] uppercase">Gemini Service</div>
                <div className="text-emerald-400 font-semibold mt-0.5">
                  {apiInfo?.geminiConfigured ? 'Active (Ready)' : 'Fallback Resilient'}
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="text-slate-500 text-[10px] uppercase">Vector Engine</div>
                <div className="text-cyan-400 font-semibold mt-0.5">Qdrant In-Memory</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="text-slate-500 text-[10px] uppercase">Current Mode</div>
                <div className={forceClientEngine ? 'text-amber-400 font-semibold mt-0.5' : apiStatus === 'connected' ? 'text-emerald-400 font-semibold mt-0.5' : 'text-cyan-400 font-semibold mt-0.5'}>
                  {forceClientEngine ? 'Client Override' : apiStatus === 'connected' ? 'Connected API' : 'Autonomous Client'}
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
              {testResult.targetUrl && (
                <div className="text-[10px] font-mono text-slate-400">
                  Target: <span className="text-cyan-300">{testResult.targetUrl}</span>
                </div>
              )}
              <div className="bg-slate-900/90 rounded-xl p-3 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-40 border border-slate-800">
                {testResult.error ? (
                  <span className="text-rose-400">{testResult.error}</span>
                ) : (
                  <pre>{JSON.stringify(testResult.data, null, 2)}</pre>
                )}
              </div>
            </div>
          )}

          {/* Separate Hosting Architecture Quick Guide */}
          <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-slate-200 font-semibold">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>How to Host Frontend and Backend Separately</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
              {/* Frontend (Vercel) */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="font-bold text-white flex items-center justify-between">
                  <span>1. Frontend (e.g. Vercel)</span>
                  <button
                    onClick={() => handleCopy('VITE_API_BASE_URL=https://your-backend.onrender.com', 'fe-env')}
                    className="text-[10px] text-slate-400 hover:text-cyan-400 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedSection === 'fe-env' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    Copy Env
                  </button>
                </div>
                <div className="text-slate-400 space-y-1 font-mono text-[10px]">
                  <div>Build: <span className="text-cyan-300">npm run build</span></div>
                  <div>Output: <span className="text-cyan-300">dist</span></div>
                  <div>Env Var: <span className="text-emerald-400">VITE_API_BASE_URL</span></div>
                  <div className="text-slate-500">Value: Your separate backend URL</div>
                </div>
              </div>

              {/* Backend (Render / Railway / Docker) */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="font-bold text-white flex items-center justify-between">
                  <span>2. Backend (e.g. Render / Docker)</span>
                  <button
                    onClick={() => handleCopy('npm run server', 'be-cmd')}
                    className="text-[10px] text-slate-400 hover:text-cyan-400 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedSection === 'be-cmd' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    Copy Cmd
                  </button>
                </div>
                <div className="text-slate-400 space-y-1 font-mono text-[10px]">
                  <div>Start: <span className="text-cyan-300">npm run server</span></div>
                  <div>Health: <span className="text-cyan-300">/health</span> or <span className="text-cyan-300">/api/health</span></div>
                  <div>Env Vars: <span className="text-emerald-400">GEMINI_API_KEY, PORT</span></div>
                  <div className="text-slate-500">CORS: Pre-configured for all origins</div>
                </div>
              </div>
            </div>
          </div>

          {/* Explanation of 404 & 500 Prevention */}
          <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-800/30 space-y-2.5">
            <div className="flex items-center gap-2 text-amber-300 font-semibold">
              <HelpCircle className="w-4 h-4 shrink-0" />
              <span>Why 404 & 500 happened and how they are resolved</span>
            </div>
            <div className="space-y-1.5 text-slate-300 leading-relaxed text-[11px]">
              <p>
                • <strong className="text-amber-200">HTTP 404 resolved:</strong> Occurred when the frontend deployed to static hosting (like Vercel) requested <code className="px-1 py-0.5 rounded bg-slate-900 text-amber-300 font-mono">/api/*</code> on the frontend domain where no Node server was running. Now you can set your backend URL via <code className="px-1 py-0.5 rounded bg-slate-900 text-cyan-300 font-mono">VITE_API_BASE_URL</code> or the input above.
              </p>
              <p>
                • <strong className="text-amber-200">HTTP 500 resolved:</strong> Occurred on standalone backend deployments when Express tried serving <code className="px-1 py-0.5 rounded bg-slate-900 text-amber-300 font-mono">dist/index.html</code> which didn't exist. The backend now features standalone API mode with clean JSON root status, official Gemini model fallbacks, and top-level error recovery.
              </p>
              <p>
                • <strong className="text-amber-200">Zero-Downtime Autonomous Fallback:</strong> If the backend is ever offline, the app automatically switches to the built-in client engine so chat and RAG continue working without interruption!
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
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  !forceClientEngine
                    ? 'bg-cyan-600 text-white shadow-md'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Auto (Express API)
              </button>
              <button
                onClick={() => setForceClientEngine(true)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
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
            <span
              className={`w-2 h-2 rounded-full ${
                apiStatus === 'connected' ? 'bg-emerald-400' : 'bg-cyan-400'
              }`}
            />
            Target: <span className="font-mono text-slate-300">{currentDisplayUrl}</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
