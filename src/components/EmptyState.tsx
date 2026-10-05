import React from 'react';
import {
  Sparkles,
  Paperclip,
  SlidersHorizontal,
  LayoutGrid,
  Mic,
  ArrowUp,
  Image as ImageIcon,
  FileText,
  Code2,
  Lightbulb,
  FileCheck2,
  ShieldAlert,
  Search,
} from 'lucide-react';
import { OrbVisual } from './OrbVisual';

interface EmptyStateProps {
  inputPrompt: string;
  setInputPrompt: (val: string) => void;
  onSend: (text?: string) => void;
  onAttachClick: () => void;
  onOpenConfig: () => void;
  isLoading: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  inputPrompt,
  setInputPrompt,
  onSend,
  onAttachClick,
  onOpenConfig,
  isLoading,
}) => {
  const quickChips = [
    { label: 'Create Image', icon: ImageIcon, prompt: 'Generate an artistic blueprint of an Autonomous AI Agent connected to Qdrant vector database.' },
    { label: 'Brainstorm', icon: Lightbulb, prompt: 'Brainstorm architectural strategies to scale a multi-agent RAG system to 10M documents.' },
    { label: 'Make a plan', icon: FileCheck2, prompt: 'Draft a step-by-step implementation plan for LangGraph checkpointing and Human-in-the-Loop email safeguards.' },
    { label: 'Inspect RAG Pipeline', icon: Search, prompt: 'Explain the end-to-end RAG pipeline from PDF splitting to Qdrant cosine similarity search.' },
    { label: 'Simulate Email (HITL)', icon: ShieldAlert, prompt: 'Send an email to team-lead@enterprise-ai.internal summarizing our latest RAG evaluation and checkpoint metrics.' },
  ];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (inputPrompt.trim() && !isLoading) {
        onSend();
      }
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-8 flex flex-col items-center justify-center max-w-4xl mx-auto w-full select-none">
      {/* 3D Orb (Sapphire/Cyan calm pearl) */}
      <div className="mb-6 flex justify-center">
        <OrbVisual size={92} />
      </div>

      {/* Main Title */}
      <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-100 text-center mb-6">
        Ready to Create Something New?
      </h1>

      {/* Quick Action Chips */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
        {quickChips.map((chip, idx) => {
          const Icon = chip.icon;
          return (
            <button
              key={idx}
              onClick={() => onSend(chip.prompt)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#121620] hover:bg-[#181d2a] border border-slate-800 hover:border-slate-700 text-xs font-medium text-slate-300 transition-all hover:scale-102 active:scale-98 shadow-sm backdrop-blur-md cursor-pointer"
            >
              <span>{chip.label}</span>
              <Icon className="w-3.5 h-3.5 text-cyan-400" />
            </button>
          );
        })}
      </div>

      {/* Main Glassmorphic Input Box */}
      <div className="w-full rounded-2xl bg-[#11141d]/90 border border-slate-800 p-4 shadow-xl backdrop-blur-2xl transition-all focus-within:border-cyan-500/50 focus-within:ring-2 focus-within:ring-cyan-500/10">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-cyan-400 mt-1 shrink-0" />
          <textarea
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Anything... (e.g. 'Query Qdrant for RAG chunking techniques' or 'Send an email to client for HITL review')"
            rows={2}
            className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none resize-none scrollbar-none font-normal leading-relaxed"
          />
        </div>

        {/* Bottom bar inside input */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
          {/* Left tools: Attach, Settings, Options */}
          <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
            <button
              onClick={onAttachClick}
              className="flex items-center gap-1.5 hover:text-slate-200 transition-colors cursor-pointer"
            >
              <Paperclip className="w-3.5 h-3.5 text-slate-400" />
              <span>Attach</span>
            </button>

            <button
              onClick={onOpenConfig}
              className="flex items-center gap-1.5 hover:text-slate-200 transition-colors cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              <span>Settings</span>
            </button>

            <button
              onClick={onOpenConfig}
              className="flex items-center gap-1.5 hover:text-slate-200 transition-colors cursor-pointer"
            >
              <LayoutGrid className="w-3.5 h-3.5 text-slate-400" />
              <span>Options</span>
            </button>
          </div>

          {/* Right: Mic & Submit Button */}
          <div className="flex items-center gap-3">
            <button
              className="p-2 rounded-full text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
              title="Voice Input"
            >
              <Mic className="w-4 h-4" />
            </button>

            <button
              onClick={() => onSend()}
              disabled={!inputPrompt.trim() || isLoading}
              className={`p-2 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-950 transition-all ${
                inputPrompt.trim() && !isLoading
                  ? 'hover:scale-105 active:scale-95 cursor-pointer opacity-100'
                  : 'opacity-30 cursor-not-allowed'
              }`}
            >
              <ArrowUp className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom 3 Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 w-full mt-6">
        {/* Card 1: Image Generator */}
        <div
          onClick={() => onSend('Generate high quality visual schematics for the LangGraph agent state machine.')}
          className="p-4 rounded-2xl bg-[#11141d]/80 border border-slate-800/80 hover:border-slate-700 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer group backdrop-blur-md"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300">
              <ImageIcon className="w-4 h-4 text-cyan-400" />
            </div>
            <span className="text-[10px] font-semibold text-slate-400 px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700">
              Create Image
            </span>
          </div>
          <h3 className="text-sm font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors">
            Image Generator
          </h3>
          <p className="mt-1 text-xs text-slate-400 leading-relaxed">
            Create high-quality images instantly from text.
          </p>
        </div>

        {/* Card 2: AI Presentation */}
        <div
          onClick={() => onSend('Summarize the Enterprise RAG and Qdrant Vector Search Handbook into presentation bullet points.')}
          className="p-4 rounded-2xl bg-[#11141d]/80 border border-slate-800/80 hover:border-slate-700 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer group backdrop-blur-md"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300">
              <FileText className="w-4 h-4 text-sky-400" />
            </div>
            <span className="text-[10px] font-semibold text-slate-400 px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700">
              Make Slides
            </span>
          </div>
          <h3 className="text-sm font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors">
            AI Presentation
          </h3>
          <p className="mt-1 text-xs text-slate-400 leading-relaxed">
            Turn ideas into engaging, professional presentations.
          </p>
        </div>

        {/* Card 3: Dev Assistant */}
        <div
          onClick={() => onSend('Show me Python code using Qdrant client, HuggingFace embeddings, and Pydantic structured schemas.')}
          className="p-4 rounded-2xl bg-[#11141d]/80 border border-slate-800/80 hover:border-slate-700 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer group backdrop-blur-md"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300">
              <Code2 className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-[10px] font-semibold text-slate-400 px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700">
              Generate Code
            </span>
          </div>
          <h3 className="text-sm font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors">
            Dev Assistant
          </h3>
          <p className="mt-1 text-xs text-slate-400 leading-relaxed">
            Generate clean, production ready code in seconds.
          </p>
        </div>
      </div>
    </div>
  );
};
