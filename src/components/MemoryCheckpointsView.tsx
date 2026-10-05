import React from 'react';
import {
  BookmarkCheck,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { MemoryCheckpoint } from '../types/agent';

interface MemoryCheckpointsViewProps {
  checkpoints: MemoryCheckpoint[];
  activeSummary: string;
  onRestoreCheckpoint: (checkpoint: MemoryCheckpoint) => void;
  summarizationThreshold: number;
}

export const MemoryCheckpointsView: React.FC<MemoryCheckpointsViewProps> = ({
  checkpoints,
  activeSummary,
  onRestoreCheckpoint,
  summarizationThreshold,
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 select-none max-w-6xl mx-auto">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-950/40 border border-indigo-800 text-indigo-400">
            <BookmarkCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Conversation Memory & Checkpointing
            </h1>
            <p className="text-xs text-slate-400">
              LangGraph-style state persistence, checkpoint rollbacks, and conversation summarization middleware
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono">
            {checkpoints.length} Checkpoints Saved
          </span>
        </div>
      </div>

      {/* Conversation Summarization Middleware Status Card */}
      <div className="p-5 rounded-2xl bg-[#11141e]/90 border border-slate-800 backdrop-blur-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-200">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Active Summarization Middleware State</span>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
            Trigger Threshold: {summarizationThreshold} turns
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#090b10] border border-slate-800 font-sans text-xs text-slate-300 leading-relaxed">
          <span className="text-cyan-400 font-semibold">Compressed Executive Memory: </span>
          {activeSummary}
        </div>

        <div className="flex items-center gap-4 text-[11px] text-slate-400 font-mono pt-1">
          <span>Token Reduction: ~64%</span>
          <span>•</span>
          <span>Window Retention: 4 Recent Turns</span>
          <span>•</span>
          <span>Middleware Status: Running</span>
        </div>
      </div>

      {/* Checkpoints Timeline */}
      <div className="space-y-3">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
          State Checkpoint Graph & Timeline
        </div>

        <div className="relative border-l-2 border-slate-800 ml-4 pl-6 space-y-6">
          {checkpoints.map((chk) => (
            <div key={chk.id} className="relative group">
              {/* Dot */}
              <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-cyan-600 border-2 border-[#090b10] group-hover:scale-125 transition-transform" />

              <div className="p-4 rounded-2xl bg-[#11141e]/90 border border-slate-800 hover:border-slate-700 transition-all backdrop-blur-md space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-bold font-mono text-slate-200">
                      Checkpoint #{chk.turnNumber} ({chk.id})
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {chk.timestamp}
                    </span>
                  </div>

                  <button
                    onClick={() => onRestoreCheckpoint(chk)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors self-start sm:self-auto cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3 text-cyan-400" />
                    <span>Rollback / Restore</span>
                  </button>
                </div>

                <div className="text-xs font-medium text-slate-200">
                  <span className="text-slate-400">User Prompt:</span> "{chk.userPrompt}"
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {chk.summary}
                </p>

                {/* State Snapshot Attributes */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-400">
                  <div>
                    <span className="text-slate-500">Messages:</span> {chk.stateSnapshot.messageCount}
                  </div>
                  <div>
                    <span className="text-slate-500">Collection:</span> {chk.stateSnapshot.activeCollection}
                  </div>
                  <div>
                    <span className="text-slate-500">Tokens:</span> {chk.totalTokens}
                  </div>
                  <div>
                    <span className="text-slate-500">Retrieved Chunks:</span> {chk.stateSnapshot.ragChunksRetrieved}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
