import React, { useState } from 'react';
import {
  Sparkles,
  User,
  ChevronDown,
  ChevronUp,
  Database,
  Cpu,
  Clock,
  Code2,
  Copy,
  Check,
} from 'lucide-react';
import { ChatMessage as ChatMessageType, HITLAction } from '../types/agent';
import { HITLApprovalCard } from './HITLApprovalCard';

interface ChatMessageProps {
  message: ChatMessageType;
  onApproveHITL: (action: HITLAction, updatedBody?: string) => void;
  onRejectHITL: (action: HITLAction, reason?: string) => void;
}

const CodeBlock: React.FC<{ code: string; language?: string }> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-3 rounded-xl overflow-hidden border border-slate-800 bg-[#080a0f] shadow-md font-mono text-xs">
      <div className="px-4 py-2 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
        <span className="uppercase font-semibold tracking-wider text-cyan-400 font-mono">
          {language || 'code'}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-0.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-slate-200 leading-relaxed scrollbar-thin scrollbar-thumb-slate-800">
        <code>{code}</code>
      </pre>
    </div>
  );
};

function formatCleanContent(rawText: string) {
  if (!rawText) return null;

  // Split by code blocks ```...```
  const parts = rawText.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-2 text-sm leading-relaxed text-slate-200 font-sans">
      {parts.map((part, partIdx) => {
        // If code block
        if (part.startsWith('```') && part.endsWith('```')) {
          const firstLineEnd = part.indexOf('\n');
          const language = part.slice(3, firstLineEnd).trim();
          const code = part.slice(firstLineEnd + 1, -3);
          return <CodeBlock key={partIdx} code={code} language={language} />;
        }

        // Process standard text lines
        const lines = part.split('\n');

        return (
          <div key={partIdx} className="space-y-1.5">
            {lines.map((line, idx) => {
              const trimmed = line.trim();

              // Convert asterisk dividers like ******* into subtle horizontal rules
              if (/^\*{3,}$/.test(trimmed)) {
                return <hr key={idx} className="border-slate-800 my-2" />;
              }

              // Empty line
              if (!trimmed) {
                return <div key={idx} className="h-1" />;
              }

              // Clean any markdown heading hashtag (####, ###, ##, #)
              const headerMatch = trimmed.match(/^#{1,6}\s+(.*)/);
              if (headerMatch) {
                const title = headerMatch[1].replace(/\*\*/g, '');
                return (
                  <div key={idx} className="font-bold text-slate-100 text-sm pt-1 tracking-wide">
                    {title}
                  </div>
                );
              }

              // Bullet points (*, -, •)
              const bulletMatch = trimmed.match(/^[-*•]\s+(.*)/);
              if (bulletMatch) {
                const body = bulletMatch[1].replace(/\*\*/g, '');
                return (
                  <div key={idx} className="flex items-start gap-2 pl-2 text-slate-300">
                    <span className="text-cyan-400 font-bold mt-1 text-[8px]">●</span>
                    <span>{body}</span>
                  </div>
                );
              }

              // Numbered lists (1. or 2.)
              const numberedMatch = trimmed.match(/^(\d+[\.\)])\s+(.*)/);
              if (numberedMatch) {
                const num = numberedMatch[1];
                const body = numberedMatch[2].replace(/\*\*/g, '');
                return (
                  <div key={idx} className="flex items-start gap-2 pl-2 text-slate-300">
                    <span className="font-mono text-cyan-400 font-semibold text-xs shrink-0">{num}</span>
                    <span>{body}</span>
                  </div>
                );
              }

              // Standard text line: clean any stray asterisk chains
              const cleanParagraph = trimmed.replace(/\*{2,}/g, '');
              return (
                <p key={idx} className="text-slate-300">
                  {cleanParagraph}
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  onApproveHITL,
  onRejectHITL,
}) => {
  const [reasoningExpanded, setReasoningExpanded] = useState(true);
  const [chunksExpanded, setChunksExpanded] = useState(true);
  const [copied, setCopied] = useState(false);

  const isUser = message.role === 'user';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`py-5 px-4 md:px-8 border-b border-slate-800/60 transition-colors ${
        isUser ? 'bg-[#0e1118]/40' : 'bg-[#12151f]/50'
      }`}
    >
      <div className="max-w-4xl mx-auto flex items-start gap-4">
        {/* Avatar */}
        <div className="shrink-0 mt-1">
          {isUser ? (
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
              <User className="w-4 h-4" />
            </div>
          ) : (
            <div className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-indigo-600 p-[1.5px] shadow-md shadow-cyan-950/40">
              <div className="w-full h-full rounded-full bg-[#0b0e14] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-cyan-300" />
              </div>
            </div>
          )}
        </div>

        {/* Message Content Body */}
        <div className="flex-1 min-w-0 space-y-3">
          {/* Header row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-200">
                {isUser ? 'You' : 'Cortexia Agent'}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                {message.timestamp}
              </span>
            </div>

            {!isUser && (
              <div className="flex items-center gap-2">
                {message.latencyMs && (
                  <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {message.latencyMs}ms
                  </span>
                )}
                <button
                  onClick={copyToClipboard}
                  className="p-1 rounded text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                  title="Copy message"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}
          </div>

          {/* Agent ReAct Reasoning Steps */}
          {!isUser && message.agentReasoning && message.agentReasoning.length > 0 && (
            <div className="rounded-xl bg-[#0d1017] border border-slate-800 overflow-hidden text-xs">
              <button
                onClick={() => setReasoningExpanded(!reasoningExpanded)}
                className="w-full px-3 py-2 flex items-center justify-between text-slate-300 hover:text-white bg-slate-900/60 transition-colors font-medium cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Agent ReAct Reasoning & Execution Graph ({message.agentReasoning.length} steps)</span>
                </div>
                {reasoningExpanded ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
              </button>

              {reasoningExpanded && (
                <div className="p-3 space-y-1.5 border-t border-slate-800/80 font-mono text-[11px] text-slate-400 bg-[#090b10]">
                  {message.agentReasoning.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="text-cyan-400 shrink-0">›</span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Retrieved Qdrant Vector Chunks Section */}
          {!isUser && message.retrievedChunks && message.retrievedChunks.length > 0 && (
            <div className="rounded-xl bg-[#0c141e] border border-cyan-900/40 overflow-hidden text-xs">
              <button
                onClick={() => setChunksExpanded(!chunksExpanded)}
                className="w-full px-3 py-2 flex items-center justify-between text-cyan-300 hover:text-white bg-cyan-950/40 transition-colors font-medium cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Database className="w-3.5 h-3.5 text-cyan-400" />
                  <span>
                    Qdrant Semantic Chunks Retrieved ({message.retrievedChunks.length} vectors matched)
                  </span>
                </div>
                {chunksExpanded ? <ChevronUp className="w-3.5 h-3.5 text-cyan-400" /> : <ChevronDown className="w-3.5 h-3.5 text-cyan-400" />}
              </button>

              {chunksExpanded && (
                <div className="p-3 space-y-2 border-t border-cyan-900/40 bg-[#080d14]">
                  {message.retrievedChunks.map((chunk, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-slate-200 truncate">
                          📄 {chunk.metadata?.documentTitle || 'Indexed Document'} (Pg {chunk.metadata?.page || 1})
                        </span>
                        <span className="px-2 py-0.5 rounded-full font-mono text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-semibold">
                          Cosine: {(chunk.score * 100).toFixed(1)}% match
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300/80 leading-relaxed font-sans">
                        "{chunk.text}"
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Human-in-the-Loop Action Card */}
          {message.hitlAction && (
            <HITLApprovalCard
              action={message.hitlAction}
              onApprove={onApproveHITL}
              onReject={onRejectHITL}
            />
          )}

          {/* Clean Formatted Message Text (with Claude-style code blocks and no #### or *******) */}
          {formatCleanContent(message.content)}

          {/* Structured Pydantic Output Box */}
          {message.structuredOutput && (
            <div className="mt-3 p-3.5 rounded-xl bg-[#0c131a] border border-slate-800 text-xs font-mono">
              <div className="flex items-center justify-between text-[11px] text-cyan-300 font-bold mb-2 pb-1.5 border-b border-slate-800">
                <div className="flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Pydantic Schema: {message.structuredOutput.schema}</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-200 border border-cyan-800 text-[10px]">
                  Validated (Conf: {(message.structuredOutput.confidenceScore * 100).toFixed(1)}%)
                </span>
              </div>
              <pre className="text-[11px] text-slate-300 overflow-x-auto p-2 rounded bg-black/50">
                {JSON.stringify(message.structuredOutput.attributes, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
