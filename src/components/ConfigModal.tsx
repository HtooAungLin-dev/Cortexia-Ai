import React from 'react';
import {
  X,
  Sliders,
  Cpu,
  Database,
  ShieldAlert,
  Save,
  RotateCcw,
} from 'lucide-react';
import { AgentConfig } from '../types/agent';

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AgentConfig;
  setConfig: React.Dispatch<React.SetStateAction<AgentConfig>>;
}

export const ConfigModal: React.FC<ConfigModalProps> = ({
  isOpen,
  onClose,
  config,
  setConfig,
}) => {
  if (!isOpen) return null;

  const handleResetDefaults = () => {
    setConfig({
      model: 'gemini-3.8-flash',
      temperature: 0.7,
      topK: 4,
      chunkSize: 500,
      chunkOverlap: 50,
      embeddingModel: 'sentence-transformers/all-MiniLM-L6-v2',
      distanceMetric: 'Cosine',
      hitlEnabled: true,
      autoSummarize: true,
      summarizationThreshold: 6,
      activeCollection: 'knowledge_pdf_docs',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in select-none">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#11141e] border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/40">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white tracking-wide">
              Cortexia Agent & Pipeline Configuration
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          {/* Section 1: LLM Engine & Generation */}
          <div className="space-y-3">
            <div className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
              <Cpu className="w-4 h-4" />
              <span>Agent LLM Engine & Reasoning</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Active Foundation Model
                </label>
                <select
                  value={config.model}
                  onChange={(e) => setConfig({ ...config, model: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:outline-none focus:border-cyan-500"
                >
                  <option value="claude-3-7-sonnet">Claude 3.7 Sonnet (Hybrid Reasoning)</option>
                  <option value="claude-3-5-sonnet">Claude 3.5 Sonnet (Versatile)</option>
                  <option value="gemini-3.8-flash">Gemini 3.8 Flash (Agentic & Fast)</option>
                  <option value="gemini-3.1-pro-preview">Gemini 3.1 Pro (Deep Reasoner)</option>
                  <option value="chatgpt-v4.0">ChatGPT v4.0 (Compatibility Mode)</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 font-medium mb-1">
                  <span>Temperature</span>
                  <span className="font-mono text-slate-200">{config.temperature}</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="1.0"
                  step="0.05"
                  value={config.temperature}
                  onChange={(e) => setConfig({ ...config, temperature: Number(e.target.value) })}
                  className="w-full accent-cyan-500 mt-2"
                />
              </div>
            </div>
          </div>

          {/* Section 2: RAG Pipeline & Text Splitter */}
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <div className="text-[11px] font-bold uppercase tracking-wider text-sky-400 flex items-center gap-2">
              <Database className="w-4 h-4" />
              <span>RAG & Text Splitting Parameters</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Chunk Size (Tokens)
                </label>
                <input
                  type="number"
                  min="100"
                  max="2000"
                  step="50"
                  value={config.chunkSize}
                  onChange={(e) => setConfig({ ...config, chunkSize: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Chunk Overlap (Tokens)
                </label>
                <input
                  type="number"
                  min="0"
                  max="500"
                  step="10"
                  value={config.chunkOverlap}
                  onChange={(e) => setConfig({ ...config, chunkOverlap: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Top-K Retrieved Chunks
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={config.topK}
                  onChange={(e) => setConfig({ ...config, topK: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Qdrant Vector Engine */}
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <Database className="w-4 h-4" />
              <span>Qdrant Distance Metric & Embedding Model</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Distance Metric
                </label>
                <select
                  value={config.distanceMetric}
                  onChange={(e) =>
                    setConfig({ ...config, distanceMetric: e.target.value as any })
                  }
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:outline-none focus:border-cyan-500"
                >
                  <option value="Cosine">Cosine Similarity (Recommended)</option>
                  <option value="Dot">Dot Product</option>
                  <option value="Euclidean">Euclidean L2</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Embedding Model
                </label>
                <input
                  type="text"
                  disabled
                  value={config.embeddingModel}
                  className="w-full p-2.5 rounded-xl bg-black/50 border border-slate-800 text-slate-400 font-mono cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Section 4: HITL Safeguards & Summarization Middleware */}
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" />
              <span>Safety Guards & Middleware</span>
            </div>

            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer">
                <div>
                  <div className="font-semibold text-slate-100">
                    Human-in-the-Loop (HITL) for Email Actions
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Intercept outbound email dispatch and require explicit human operator approval.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={config.hitlEnabled}
                  onChange={(e) => setConfig({ ...config, hitlEnabled: e.target.checked })}
                  className="w-4 h-4 accent-cyan-500 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer">
                <div>
                  <div className="font-semibold text-slate-100">
                    Conversation Summarization Middleware
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Compress older dialogue into an executive summary context block when turns exceed threshold.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={config.autoSummarize}
                  onChange={(e) => setConfig({ ...config, autoSummarize: e.target.checked })}
                  className="w-4 h-4 accent-cyan-500 cursor-pointer"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/40 flex items-center justify-between">
          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={onClose}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white transition-all shadow-md cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Apply Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};
