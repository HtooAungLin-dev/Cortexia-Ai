import React, { useState } from 'react';
import {
  ShieldAlert,
  Send,
  XCircle,
  Edit3,
  CheckCircle2,
  Mail,
  Sparkles,
} from 'lucide-react';
import { HITLAction } from '../types/agent';

interface HITLApprovalCardProps {
  action: HITLAction;
  onApprove: (action: HITLAction, updatedBody?: string) => void;
  onReject: (action: HITLAction, reason?: string) => void;
}

export const HITLApprovalCard: React.FC<HITLApprovalCardProps> = ({
  action,
  onApprove,
  onReject,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedBody, setEditedBody] = useState(action.body || '');
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  const isPending = action.status === 'pending';
  const isApproved = action.status === 'approved';
  const isRejected = action.status === 'rejected';

  return (
    <div
      className={`my-3.5 rounded-2xl border transition-all duration-300 overflow-hidden shadow-lg backdrop-blur-xl ${
        isPending
          ? 'bg-[#151310]/95 border-amber-600/40 ring-1 ring-amber-500/20'
          : isApproved
          ? 'bg-[#0e1713]/90 border-emerald-600/40'
          : 'bg-[#181112]/90 border-rose-600/40'
      }`}
    >
      {/* Top Banner Header */}
      <div
        className={`px-4 py-2.5 flex items-center justify-between border-b ${
          isPending
            ? 'bg-amber-950/40 border-amber-600/30'
            : isApproved
            ? 'bg-emerald-950/40 border-emerald-600/30'
            : 'bg-rose-950/40 border-rose-600/30'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div
            className={`p-1.5 rounded-lg ${
              isPending
                ? 'bg-amber-500/20 text-amber-400'
                : isApproved
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-rose-500/20 text-rose-400'
            }`}
          >
            {isPending ? (
              <ShieldAlert className="w-4 h-4 animate-pulse" />
            ) : isApproved ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <XCircle className="w-4 h-4" />
            )}
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <span>Human-in-the-Loop Safeguard</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-medium bg-slate-800 border border-slate-700 text-slate-300">
                Action: {action.type}
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              {isPending && 'Autonomous execution paused. Operator confirmation required for outbound email.'}
              {isApproved && `Approved & Dispatched by Human Operator at ${action.reviewedAt || 'recently'}.`}
              {isRejected && `Action was Rejected by Human Operator: "${action.operatorNotes || 'Cancelled'}"`}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border ${
              isPending
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                : isApproved
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
            }`}
          >
            {action.status}
          </span>
        </div>
      </div>

      {/* Email Details Body */}
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900/60 border border-slate-800">
            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-400">To:</span>
            <span className="font-mono text-slate-200 truncate">{action.recipient}</span>
          </div>

          <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900/60 border border-slate-800">
            <Sparkles className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-400">Subject:</span>
            <span className="font-medium text-slate-200 truncate">{action.subject}</span>
          </div>
        </div>

        {/* Email Content Box */}
        <div className="rounded-xl bg-[#090b10] border border-slate-800 p-3">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            <span>Proposed Email Draft</span>
            {isPending && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
              >
                <Edit3 className="w-3 h-3" />
                <span>Edit text</span>
              </button>
            )}
          </div>

          {isEditing && isPending ? (
            <div className="space-y-2">
              <textarea
                value={editedBody}
                onChange={(e) => setEditedBody(e.target.value)}
                rows={5}
                className="w-full rounded-lg bg-slate-900 border border-slate-700 p-2.5 text-xs text-slate-100 font-mono focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-2.5 py-1 rounded-md text-[11px] text-slate-300 hover:bg-slate-800"
                >
                  Done Editing
                </button>
              </div>
            </div>
          ) : (
            <pre className="text-xs text-slate-300 whitespace-pre-wrap font-sans leading-relaxed">
              {editedBody}
            </pre>
          )}
        </div>

        {/* Action Buttons for Pending Status */}
        {isPending && (
          <div className="pt-2 flex flex-wrap items-center justify-end gap-2.5">
            <button
              onClick={() => setShowRejectModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800 text-xs font-semibold text-rose-300 transition-colors"
            >
              <XCircle className="w-4 h-4" />
              <span>Reject Action</span>
            </button>

            <button
              onClick={() => onApprove(action, editedBody)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white shadow-md shadow-emerald-950 transition-all hover:scale-102"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Approve & Dispatch</span>
            </button>
          </div>
        )}

        {/* Reject reason dialog */}
        {showRejectModal && (
          <div className="mt-3 p-3 rounded-xl bg-rose-950/40 border border-rose-800 space-y-2">
            <p className="text-xs text-rose-200">Please provide a reason for rejecting this email action:</p>
            <input
              type="text"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Needs additional metrics, or wrong recipient."
              className="w-full text-xs p-2 rounded-lg bg-rose-950/70 border border-rose-700 text-white focus:outline-none"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-3 py-1 text-xs text-rose-300 hover:bg-rose-900/30 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onReject(action, rejectReason || 'Operator cancelled');
                  setShowRejectModal(false);
                }}
                className="px-3 py-1 text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white rounded"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
