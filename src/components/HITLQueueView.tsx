import React, { useState } from 'react';
import {
  UserCheck,
  CheckCircle2,
  Plus,
} from 'lucide-react';
import { HITLAction } from '../types/agent';
import { HITLApprovalCard } from './HITLApprovalCard';

interface HITLQueueViewProps {
  actions: HITLAction[];
  onApprove: (action: HITLAction, updatedBody?: string) => void;
  onReject: (action: HITLAction, reason?: string) => void;
  onCreateSampleAction: () => void;
}

export const HITLQueueView: React.FC<HITLQueueViewProps> = ({
  actions,
  onApprove,
  onReject,
  onCreateSampleAction,
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const pendingActions = actions.filter((a) => a.status === 'pending');
  const approvedActions = actions.filter((a) => a.status === 'approved');
  const rejectedActions = actions.filter((a) => a.status === 'rejected');

  const filteredActions =
    filter === 'all'
      ? actions
      : actions.filter((a) => a.status === filter);

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 select-none max-w-6xl mx-auto">
      {/* Title & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-800 text-amber-400">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Human-in-the-Loop (HITL) Safety Gate
            </h1>
            <p className="text-xs text-slate-400">
              Enterprise approval workflow for irreversible actions: outbound emails, API mutations, and vector modifications
            </p>
          </div>
        </div>

        <button
          onClick={onCreateSampleAction}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-all shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4 text-cyan-400" />
          <span>Trigger New Email Review</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-[#11141e]/90 border border-slate-800 backdrop-blur-md">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">
            Total Invocations
          </div>
          <div className="text-2xl font-bold text-white mt-1 font-mono">
            {actions.length}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#151310]/90 border border-amber-900/40 backdrop-blur-md">
          <div className="text-[11px] font-semibold text-amber-400 uppercase flex items-center justify-between">
            <span>Awaiting Review</span>
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          </div>
          <div className="text-2xl font-bold text-amber-300 mt-1 font-mono">
            {pendingActions.length}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0e1713]/90 border border-emerald-900/40 backdrop-blur-md">
          <div className="text-[11px] font-semibold text-emerald-400 uppercase">
            Approved & Dispatched
          </div>
          <div className="text-2xl font-bold text-emerald-300 mt-1 font-mono">
            {approvedActions.length}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#181112]/90 border border-rose-900/40 backdrop-blur-md">
          <div className="text-[11px] font-semibold text-rose-400 uppercase">
            Rejected Actions
          </div>
          <div className="text-2xl font-bold text-rose-300 mt-1 font-mono">
            {rejectedActions.length}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        {(['all', 'pending', 'approved', 'rejected'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              filter === tab
                ? 'bg-slate-800 text-cyan-300 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
            }`}
          >
            {tab} ({tab === 'all' ? actions.length : actions.filter((a) => a.status === tab).length})
          </button>
        ))}
      </div>

      {/* Actions List */}
      <div className="space-y-4">
        {filteredActions.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#11141e]/50 border border-slate-800/80 space-y-3">
            <CheckCircle2 className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-sm font-semibold text-slate-300">No actions found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              There are no {filter !== 'all' ? filter : ''} action requests currently in the queue.
            </p>
          </div>
        ) : (
          filteredActions.map((action) => (
            <HITLApprovalCard
              key={action.id}
              action={action}
              onApprove={onApprove}
              onReject={onReject}
            />
          ))
        )}
      </div>
    </div>
  );
};
