import React, { useState } from 'react';
import {
  ChevronDown,
  Settings2,
  Download,
  CheckCircle2,
  Cpu,
  Sparkles,
} from 'lucide-react';
import { AgentConfig } from '../types/agent';

interface HeaderProps {
  config: AgentConfig;
  setConfig: React.Dispatch<React.SetStateAction<AgentConfig>>;
  onOpenConfig: () => void;
  onExport: (format: 'markdown' | 'json') => void;
  totalIndexedPoints: number;
}

export const Header: React.FC<HeaderProps> = ({
  config,
  setConfig,
  onOpenConfig,
  onExport,
  totalIndexedPoints,
}) => {
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);

  const availableModels = [
    { id: 'claude-3-7-sonnet', label: 'Claude 3.7 Sonnet (Hybrid Reasoning)', tag: 'General & Coding' },
    { id: 'claude-3-5-sonnet', label: 'Claude 3.5 Sonnet', tag: 'Fast & Versatile' },
    { id: 'gemini-3.8-flash', label: 'Gemini 3.8 Flash (Agentic)', tag: 'Recommended' },
    { id: 'gemini-3.1-pro-preview', label: 'Gemini 3.1 Pro (Deep Reasoner)', tag: 'STEM & Logic' },
    { id: 'chatgpt-v4.0', label: 'ChatGPT v4.0', tag: 'Legacy' },
  ];

  const currentModelLabel =
    availableModels.find((m) => m.id === config.model)?.label || 'Gemini 3.8 Flash (Agentic)';

  return (
    <header className="h-16 px-6 border-b border-slate-800/60 bg-[#0c0e14]/90 backdrop-blur-xl flex items-center justify-between z-20 select-none">
      {/* Left: Model Selector */}
      <div className="relative">
        <button
          onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-200 transition-all shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>{currentModelLabel}</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </button>

        {modelDropdownOpen && (
          <div className="absolute top-10 left-0 w-72 rounded-2xl bg-[#121620] border border-slate-700 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
            <div className="px-3 py-2 text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Select Inference Engine
            </div>
            {availableModels.map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  setConfig((prev) => ({ ...prev, model: m.id }));
                  setModelDropdownOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-colors text-left ${
                  config.model === m.id
                    ? 'bg-slate-800 text-white font-medium border border-slate-600'
                    : 'text-slate-300 hover:bg-slate-850 hover:text-white'
                }`}
              >
                <div>
                  <div className="font-medium">{m.label}</div>
                  <div className="text-[10px] text-slate-400">{m.tag}</div>
                </div>
                {config.model === m.id && (
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Center: System Status Badges */}
      <div className="hidden md:flex items-center gap-2.5">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/30 border border-emerald-800/30 text-[11px] text-emerald-300 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Qdrant: {totalIndexedPoints} Vectors Ready</span>
        </div>

        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-300 font-mono">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span>MiniLM-L6-v2 (384-dim)</span>
        </div>

        {config.hitlEnabled && (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/30 border border-amber-800/30 text-[11px] text-amber-300 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>HITL Guard Active</span>
          </div>
        )}
      </div>

      {/* Right: Configuration & Export buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenConfig}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-200 transition-all shadow-sm"
        >
          <span>Configuration</span>
          <Settings2 className="w-3.5 h-3.5 text-slate-400" />
        </button>

        <div className="relative">
          <button
            onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-200 transition-all shadow-sm"
          >
            <span>Export</span>
            <Download className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {exportDropdownOpen && (
            <div className="absolute top-10 right-0 w-48 rounded-2xl bg-[#121620] border border-slate-700 shadow-2xl p-1.5 z-50 animate-in fade-in">
              <button
                onClick={() => {
                  onExport('markdown');
                  setExportDropdownOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
              >
                Export as Markdown (.md)
              </button>
              <button
                onClick={() => {
                  onExport('json');
                  setExportDropdownOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
              >
                Export Checkpoints JSON
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
