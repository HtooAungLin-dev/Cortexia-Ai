import React, { useState } from 'react';
import {
  MessageSquare,
  Network,
  Database,
  UserCheck,
  BookmarkCheck,
  FolderOpen,
  Plus,
  Sparkles,
  Layers,
  FileText,
  Search,
  PanelLeftClose,
  PanelLeftOpen,
  History,
  Trash2,
  Pin,
  PinOff,
  Cpu,
} from 'lucide-react';
import { ActiveView, ChatSession } from '../types/agent';

interface SidebarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  onNewChat: () => void;
  pendingHitlCount: number;
  totalDocumentsCount: number;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
  onTogglePinSession: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  setActiveView,
  onNewChat,
  pendingHitlCount,
  totalDocumentsCount,
  isCollapsed,
  setIsCollapsed,
  sessions,
  activeSessionId,
  onSelectSession,
  onDeleteSession,
  onTogglePinSession,
}) => {
  const [historySearch, setHistorySearch] = useState('');

  const filteredSessions = sessions.filter((s) =>
    s.title.toLowerCase().includes(historySearch.toLowerCase())
  );

  return (
    <aside
      className={`relative h-full flex flex-col justify-between bg-[#0e1118]/95 backdrop-blur-2xl border-r border-slate-800/60 transition-all duration-300 z-30 select-none ${
        isCollapsed ? 'w-18' : 'w-68'
      }`}
    >
      {/* Top Header */}
      <div className="p-4 border-b border-slate-800/60">
        <div className="flex items-center justify-between">
          <div
            className="flex items-center gap-2.5 cursor-pointer group"
            onClick={() => setActiveView('chat')}
          >
            <div className="relative w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 via-sky-500 to-indigo-500 p-[1.5px] shadow-md shadow-cyan-950/40 group-hover:scale-105 transition-transform">
              <div className="w-full h-full rounded-lg bg-[#0b0e14] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-cyan-300" />
              </div>
            </div>
            {!isCollapsed && (
              <span className="font-bold text-base tracking-tight text-slate-100">
                Cortexia <span className="text-cyan-400 font-mono text-xs font-semibold">AI</span>
              </span>
            )}
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>
        </div>

        {/* New Chat Button */}
        <button
          onClick={onNewChat}
          className={`mt-4 w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/60 hover:border-cyan-500/40 text-slate-100 font-medium text-xs transition-all duration-200 shadow-sm group ${
            isCollapsed ? 'px-0' : ''
          }`}
        >
          <Plus className="w-4 h-4 text-cyan-400 group-hover:rotate-90 transition-transform duration-300" />
          {!isCollapsed && <span>New Chat</span>}
        </button>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-5 scrollbar-thin scrollbar-thumb-slate-800">
        {/* Features Category */}
        <div>
          {!isCollapsed && (
            <p className="px-2 mb-1.5 text-[10px] font-bold tracking-wider uppercase text-slate-500">
              Workbench Views
            </p>
          )}
          <nav className="space-y-1">
            <button
              onClick={() => setActiveView('chat')}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium transition-all ${
                activeView === 'chat'
                  ? 'bg-slate-800/80 text-cyan-300 border border-slate-700/70 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
              title="Studio Chat"
            >
              <MessageSquare className="w-4 h-4 text-cyan-400 shrink-0" />
              {!isCollapsed && <span className="truncate">Active Chat</span>}
            </button>

            <button
              onClick={() => setActiveView('pipeline')}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium transition-all ${
                activeView === 'pipeline'
                  ? 'bg-slate-800/80 text-cyan-300 border border-slate-700/70 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
              title="Interactive RAG Pipeline"
            >
              <div className="flex items-center gap-2.5 truncate">
                <Network className="w-4 h-4 text-sky-400 shrink-0" />
                {!isCollapsed && <span className="truncate">RAG Pipeline</span>}
              </div>
              {!isCollapsed && (
                <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-sky-950/60 text-sky-300 border border-sky-800/50">
                  Visual
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveView('qdrant')}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium transition-all ${
                activeView === 'qdrant'
                  ? 'bg-slate-800/80 text-cyan-300 border border-slate-700/70 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
              title="Qdrant Vector DB"
            >
              <div className="flex items-center gap-2.5 truncate">
                <Database className="w-4 h-4 text-emerald-400 shrink-0" />
                {!isCollapsed && <span className="truncate">Qdrant Vector DB</span>}
              </div>
              {!isCollapsed && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              )}
            </button>

            <button
              onClick={() => setActiveView('hitl')}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium transition-all ${
                activeView === 'hitl'
                  ? 'bg-slate-800/80 text-cyan-300 border border-slate-700/70 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
              title="Human-in-the-Loop (HITL) Queue"
            >
              <div className="flex items-center gap-2.5 truncate">
                <UserCheck className="w-4 h-4 text-amber-400 shrink-0" />
                {!isCollapsed && <span className="truncate">HITL Approvals</span>}
              </div>
              {pendingHitlCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                  {pendingHitlCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveView('checkpoints')}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium transition-all ${
                activeView === 'checkpoints'
                  ? 'bg-slate-800/80 text-cyan-300 border border-slate-700/70 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
              title="Memory & Checkpoints"
            >
              <BookmarkCheck className="w-4 h-4 text-indigo-400 shrink-0" />
              {!isCollapsed && <span className="truncate">Checkpoints</span>}
            </button>

            <button
              onClick={() => setActiveView('library')}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium transition-all ${
                activeView === 'library'
                  ? 'bg-slate-800/80 text-cyan-300 border border-slate-700/70 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
              title="PDF Document Library"
            >
              <div className="flex items-center gap-2.5 truncate">
                <FolderOpen className="w-4 h-4 text-teal-400 shrink-0" />
                {!isCollapsed && <span className="truncate">PDF Library</span>}
              </div>
              {!isCollapsed && (
                <span className="text-[11px] text-slate-500 font-mono">
                  {totalDocumentsCount}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Chat History Section */}
        <div>
          {!isCollapsed ? (
            <div>
              <div className="flex items-center justify-between px-2 mb-2">
                <p className="text-[10px] font-bold tracking-wider uppercase text-slate-500 flex items-center gap-1.5">
                  <History className="w-3 h-3 text-slate-400" />
                  <span>Chat History</span>
                </p>
                <span className="text-[10px] font-mono text-slate-500">
                  {sessions.length}
                </span>
              </div>

              {/* Chat search */}
              {sessions.length > 3 && (
                <div className="px-1 mb-2">
                  <input
                    type="text"
                    value={historySearch}
                    onChange={(e) => setHistorySearch(e.target.value)}
                    placeholder="Search history..."
                    className="w-full px-2.5 py-1 text-[11px] rounded-lg bg-slate-900/60 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-slate-700"
                  />
                </div>
              )}

              {/* Sessions List */}
              <div className="space-y-1 max-h-56 overflow-y-auto pr-0.5 scrollbar-thin scrollbar-thumb-slate-800">
                {filteredSessions.length === 0 ? (
                  <div className="px-2 py-3 text-center text-[11px] text-slate-500">
                    No matching chats
                  </div>
                ) : (
                  filteredSessions.map((session) => {
                    const isSelected = activeSessionId === session.id && activeView === 'chat';
                    return (
                      <div
                        key={session.id}
                        onClick={() => {
                          onSelectSession(session.id);
                          setActiveView('chat');
                        }}
                        className={`group relative flex items-center justify-between px-2.5 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-slate-800 text-white font-medium border border-slate-700 shadow-sm'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1 pr-2">
                          <MessageSquare className="w-3.5 h-3.5 text-slate-400 shrink-0 group-hover:text-cyan-400" />
                          <div className="truncate">
                            <div className="truncate text-[11px] font-medium leading-tight">
                              {session.title}
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                              {session.updatedAt}
                            </div>
                          </div>
                        </div>

                        {/* Actions on hover */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onTogglePinSession(session.id);
                            }}
                            className="p-1 text-slate-500 hover:text-cyan-400 transition-colors"
                            title={session.pinned ? 'Unpin' : 'Pin'}
                          >
                            {session.pinned ? (
                              <Pin className="w-3 h-3 text-cyan-400 fill-cyan-400" />
                            ) : (
                              <PinOff className="w-3 h-3" />
                            )}
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteSession(session.id);
                            }}
                            className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                            title="Delete Chat"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          ) : (
            <div className="flex justify-center pt-2">
              <button
                onClick={() => setActiveView('chat')}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
                title="Chat History"
              >
                <History className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom System Status Card (Calm, sleek, no eye-strain) */}
      {!isCollapsed ? (
        <div className="p-3 m-3 rounded-2xl bg-[#121620] border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>Cortexia Core</span>
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <p className="text-[11px] leading-relaxed text-slate-400">
            Hybrid Agent with Qdrant vector store and LangGraph checkpoints active.
          </p>
        </div>
      ) : (
        <div className="p-3 flex justify-center">
          <div
            className="w-9 h-9 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-cyan-400"
            title="System Active"
          >
            <Cpu className="w-4 h-4" />
          </div>
        </div>
      )}
    </aside>
  );
};
