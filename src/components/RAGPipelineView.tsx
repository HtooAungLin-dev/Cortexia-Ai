import React, { useState } from 'react';
import {
  FileText,
  FileInput,
  Scissors,
  Cpu,
  Database,
  Search,
  Filter,
  Sparkles,
  Play,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { runFullRAGPipeline, PipelineExecutionLog } from '../services/ragPipeline';
import { QdrantSearchResult } from '../services/qdrantStore';

export const RAGPipelineView: React.FC = () => {
  const [testQuery, setTestQuery] = useState('How does Qdrant use HNSW for cosine similarity search?');
  const [pipelineLogs, setPipelineLogs] = useState<PipelineExecutionLog[]>([]);
  const [retrievedResults, setRetrievedResults] = useState<QdrantSearchResult[]>([]);
  const [totalLatency, setTotalLatency] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  // Chunking parameters sandbox
  const [sampleChunkSize, setSampleChunkSize] = useState(450);
  const [sampleOverlap, setSampleOverlap] = useState(50);

  const pipelineNodes = [
    {
      id: 'pdf',
      name: '1. PDF Document',
      icon: FileText,
      color: 'text-sky-400',
      bgColor: 'bg-sky-950/30',
      borderColor: 'border-sky-800/40',
      summary: 'Raw technical documents, architecture whitepapers & enterprise policies.',
      specs: 'Input: PDF, Markdown, TXT. Preserves metadata & section hierarchy.',
    },
    {
      id: 'loader',
      name: '2. Document Loader',
      icon: FileInput,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-950/30',
      borderColor: 'border-cyan-800/40',
      summary: 'Extracts raw text streams and normalizes whitespace & table markers.',
      specs: 'Engine: PyPDF / Unstructured Document Loader with page indexing.',
    },
    {
      id: 'splitting',
      name: '3. Text Splitting',
      icon: Scissors,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-950/30',
      borderColor: 'border-indigo-800/40',
      summary: 'RecursiveCharacterTextSplitter slices text with sliding overlap.',
      specs: `Chunk Size: ${sampleChunkSize} tokens | Overlap: ${sampleOverlap} tokens (11%).`,
    },
    {
      id: 'embeddings',
      name: '4. HF Embeddings',
      icon: Cpu,
      color: 'text-teal-400',
      bgColor: 'bg-teal-950/30',
      borderColor: 'border-teal-800/40',
      summary: 'Projects chunks into 384-dimensional continuous latent space.',
      specs: 'Model: sentence-transformers/all-MiniLM-L6-v2 (Latency: ~12ms).',
    },
    {
      id: 'qdrant',
      name: '5. Qdrant Vector DB',
      icon: Database,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-950/30',
      borderColor: 'border-emerald-800/40',
      summary: 'Stores dense vectors with payload metadata inside HNSW graphs.',
      specs: 'Index: HNSW (m=16, ef_construct=100) | Distance: Cosine Similarity.',
    },
    {
      id: 'search',
      name: '6. Similarity Search',
      icon: Search,
      color: 'text-amber-400',
      bgColor: 'bg-amber-950/30',
      borderColor: 'border-amber-800/40',
      summary: 'Performs ANN nearest neighbor search for query vector matches.',
      specs: 'Formula: cos(θ) = (A · B) / (||A|| ||B||) | Confidence threshold: 0.40.',
    },
    {
      id: 'chunks',
      name: '7. Relevant Chunks',
      icon: Filter,
      color: 'text-rose-400',
      bgColor: 'bg-rose-950/30',
      borderColor: 'border-rose-800/40',
      summary: 'Selects top-k candidates, strips duplicates, and formats citations.',
      specs: 'Top-K: 4 chunks | Injects page number & document source metadata.',
    },
    {
      id: 'llm',
      name: '8. LLM Synthesis',
      icon: Sparkles,
      color: 'text-blue-300',
      bgColor: 'bg-blue-950/40',
      borderColor: 'border-blue-800/50',
      summary: 'Gemini 3.8 Flash synthesizes grounded response with ReAct reasoning.',
      specs: 'System prompt augmented with citations & conversation summary context.',
    },
  ];

  const handleRunPipeline = () => {
    if (!testQuery.trim() || isRunning) return;
    setIsRunning(true);
    setTotalLatency(null);

    setTimeout(() => {
      const outcome = runFullRAGPipeline(testQuery, 'knowledge_pdf_docs', 4);
      setPipelineLogs(outcome.logs);
      setRetrievedResults(outcome.results);
      setTotalLatency(outcome.totalLatencyMs);
      setIsRunning(false);
    }, 450);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-7 select-none max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700 text-cyan-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Interactive RAG Pipeline Architecture
            </h1>
            <p className="text-xs text-slate-400">
              Visualizing the end-to-end flow: PDF → Loader → Splitting → Embeddings → Qdrant → Similarity → Chunks → LLM
            </p>
          </div>
        </div>
      </div>

      {/* Visual Pipeline Flow Nodes */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Pipeline Topology (Click any node to inspect parameters)
          </span>
          <span className="text-[11px] font-mono text-slate-500">
            Status: Fully Operational
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {pipelineNodes.map((node, index) => {
            const Icon = node.icon;
            const isSelected = activeStepIndex === index;
            return (
              <div
                key={node.id}
                onClick={() => setActiveStepIndex(index)}
                className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer backdrop-blur-md relative ${
                  isSelected
                    ? `${node.bgColor} ${node.borderColor} ring-1 ring-cyan-500/40 shadow-lg -translate-y-0.5`
                    : 'bg-[#11141e]/80 border-slate-800 hover:border-slate-700 hover:bg-[#151926]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-xl bg-slate-900 border border-slate-800 ${node.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-500">
                    STEP {index + 1}
                  </span>
                </div>
                <h3 className="text-xs font-bold text-slate-100 tracking-wide mb-1">
                  {node.name}
                </h3>
                <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                  {node.summary}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Step Detailed Inspector */}
      <div className="p-5 rounded-2xl bg-[#11141e]/90 border border-slate-800 backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl bg-slate-900 border border-slate-800 ${pipelineNodes[activeStepIndex].color}`}>
              {React.createElement(pipelineNodes[activeStepIndex].icon, { className: 'w-5 h-5' })}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">
                {pipelineNodes[activeStepIndex].name} - Specification
              </h2>
              <p className="text-xs text-slate-400">
                {pipelineNodes[activeStepIndex].specs}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800">
              Node: {pipelineNodes[activeStepIndex].id}
            </span>
          </div>
        </div>

        {/* Text Splitting Sandbox Controls */}
        {activeStepIndex === 2 && (
          <div className="mt-4 pt-2 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <div className="flex justify-between text-slate-300">
                <span>Target Chunk Size</span>
                <span className="font-mono text-slate-200">{sampleChunkSize} tokens</span>
              </div>
              <input
                type="range"
                min="200"
                max="1000"
                step="50"
                value={sampleChunkSize}
                onChange={(e) => setSampleChunkSize(Number(e.target.value))}
                className="w-full accent-cyan-500"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-slate-300">
                <span>Chunk Overlap (Sliding Window)</span>
                <span className="font-mono text-slate-200">{sampleOverlap} tokens</span>
              </div>
              <input
                type="range"
                min="10"
                max="200"
                step="10"
                value={sampleOverlap}
                onChange={(e) => setSampleOverlap(Number(e.target.value))}
                className="w-full accent-cyan-500"
              />
            </div>
          </div>
        )}

        <div className="mt-4 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] font-mono text-slate-300 leading-relaxed">
          {pipelineNodes[activeStepIndex].summary}
        </div>
      </div>

      {/* Live Pipeline Execution Simulator */}
      <div className="p-6 rounded-2xl bg-[#11141e]/90 border border-slate-800 backdrop-blur-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Play className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-100 tracking-wide">
              Live Pipeline Execution Sandbox
            </h3>
          </div>
          {totalLatency !== null && (
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              Completed in {totalLatency}ms
            </span>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            value={testQuery}
            onChange={(e) => setTestQuery(e.target.value)}
            placeholder="Enter a test query to trace the vector pipeline..."
            className="flex-1 w-full px-4 py-2.5 rounded-xl bg-[#090b10] border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
          <button
            onClick={handleRunPipeline}
            disabled={isRunning || !testQuery.trim()}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white shadow-md shadow-cyan-950 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isRunning ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Tracing...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Execute RAG Pipeline</span>
              </>
            )}
          </button>
        </div>

        {/* Execution Logs Trace */}
        {pipelineLogs.length > 0 && (
          <div className="mt-4 space-y-2 border-t border-slate-800 pt-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Step Execution Trace & Diagnostics
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {pipelineLogs.map((log) => (
                <div
                  key={log.step}
                  className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 flex items-start gap-2.5 text-xs font-mono"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-slate-200 truncate">
                        Step {log.step}: {log.name}
                      </span>
                      <span className="text-[10px] text-slate-500 shrink-0">
                        {log.durationMs}ms
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">{log.details}</p>
                    {log.outputSummary && (
                      <p className="text-[10px] text-cyan-400 truncate">
                        ↳ {log.outputSummary}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Retrieved Chunks Display */}
        {retrievedResults.length > 0 && (
          <div className="mt-4 border-t border-slate-800 pt-4 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold uppercase tracking-wider text-cyan-300">
                Qdrant Matched Chunks (Filtered via Cosine Distance)
              </span>
              <span className="font-mono text-cyan-400 text-[11px]">
                {retrievedResults.length} vectors returned
              </span>
            </div>

            <div className="space-y-2">
              {retrievedResults.map((res, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl bg-[#0d141e] border border-cyan-900/40 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-slate-200">
                      📄 {res.payload.documentTitle} (Page {res.payload.page})
                    </span>
                    <span className="px-2 py-0.5 rounded-full font-mono text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800 font-semibold">
                      Similarity Score: {(res.score * 100).toFixed(1)}%
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                    {res.payload.text}
                  </p>
                  <div className="text-[10px] font-mono text-slate-500 flex items-center gap-2">
                    <span>Vector Head:</span>
                    <span>[{res.vectorPreview.slice(0, 4).join(', ')}...]</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
