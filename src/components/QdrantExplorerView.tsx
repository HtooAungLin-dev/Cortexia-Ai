import React, { useState } from 'react';
import {
  Database,
  Search,
  Layers,
  Cpu,
} from 'lucide-react';
import { qdrantStore, QdrantSearchResult } from '../services/qdrantStore';
import { QdrantCollection, DocumentChunk } from '../types/agent';

export const QdrantExplorerView: React.FC = () => {
  const [collections] = useState<QdrantCollection[]>(() => qdrantStore.getCollections());
  const [selectedCollection, setSelectedCollection] = useState<string>('knowledge_pdf_docs');
  const [points, setPoints] = useState<DocumentChunk[]>(() => qdrantStore.getPoints('knowledge_pdf_docs'));
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<QdrantSearchResult[]>([]);
  const [minScore, setMinScore] = useState(0.40);
  const [topK, setTopK] = useState(5);
  const [selectedPoint, setSelectedPoint] = useState<DocumentChunk | null>(null);

  const handleSelectCollection = (name: string) => {
    setSelectedCollection(name);
    setPoints(qdrantStore.getPoints(name));
    setSearchResults([]);
    setSelectedPoint(null);
  };

  const handleRunSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const results = qdrantStore.search(searchQuery, selectedCollection, topK, minScore);
    setSearchResults(results);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 select-none max-w-6xl mx-auto">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800 text-emerald-400">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Qdrant Vector Database Inspector
            </h1>
            <p className="text-xs text-slate-400">
              High-dimensional vector storage, HNSW approximate nearest neighbor search, and payload indexing
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-800/40 text-xs text-emerald-300 font-mono flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Qdrant Cluster: Green</span>
          </span>
        </div>
      </div>

      {/* Collection Switcher Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {collections.map((col) => (
          <div
            key={col.name}
            onClick={() => handleSelectCollection(col.name)}
            className={`p-4 rounded-2xl border transition-all cursor-pointer backdrop-blur-md ${
              selectedCollection === col.name
                ? 'bg-[#121622] border-cyan-500/50 ring-1 ring-cyan-500/20 shadow-md'
                : 'bg-[#10131d]/70 border-slate-800 hover:border-slate-700 hover:bg-[#141824]'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold font-mono text-slate-200 truncate">
                {col.name}
              </span>
              <span className="text-[10px] uppercase font-bold text-emerald-300 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
                {col.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 font-mono mt-3">
              <div>
                <span className="text-slate-500">Vectors:</span> {col.pointsCount}
              </div>
              <div>
                <span className="text-slate-500">Dim:</span> {col.vectorSize}d
              </div>
              <div>
                <span className="text-slate-500">Distance:</span> {col.distance}
              </div>
              <div>
                <span className="text-slate-500">Updated:</span> {col.lastIndexed}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Semantic Search Simulator on Qdrant */}
      <div className="p-5 rounded-2xl bg-[#11141e]/90 border border-slate-800 backdrop-blur-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-100 tracking-wide">
              Semantic Vector Similarity Playground
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            Collection: {selectedCollection}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleRunSearch()}
              placeholder="Query Qdrant vectors (e.g. 'Hugging Face embeddings', 'Email safety approvals', 'Chunk overlap')..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#090b10] border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleRunSearch}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-md shadow-emerald-950 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Query Vectors</span>
            </button>
          </div>
        </div>

        {/* Filter Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800 text-xs">
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-400">Min Similarity Threshold:</span>
            <div className="flex items-center gap-2 flex-1 max-w-[200px]">
              <input
                type="range"
                min="0.2"
                max="0.9"
                step="0.05"
                value={minScore}
                onChange={(e) => setMinScore(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
              <span className="font-mono text-emerald-400 w-10 text-right">
                {(minScore * 100).toFixed(0)}%
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-400">Top-K Neighbors:</span>
            <div className="flex items-center gap-2 flex-1 max-w-[200px]">
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={topK}
                onChange={(e) => setTopK(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
              <span className="font-mono text-emerald-400 w-6 text-right">
                {topK}
              </span>
            </div>
          </div>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
              Matched Nearest Neighbors ({searchResults.length} points)
            </div>
            <div className="space-y-2">
              {searchResults.map((result, idx) => (
                <div
                  key={result.id}
                  className="p-3.5 rounded-xl bg-[#0c141e] border border-emerald-900/40 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">
                      Rank #{idx + 1} — {result.payload.documentTitle} (Page {result.payload.page})
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full font-mono text-[11px] bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                      Cosine: {(result.score * 100).toFixed(1)}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {result.payload.text}
                  </p>
                  <div className="flex items-center gap-3 text-[10px] font-mono text-slate-500 pt-1">
                    <span>Point ID: {result.id}</span>
                    <span>•</span>
                    <span>Vector: [{result.vectorPreview.slice(0, 4).join(', ')}...]</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Indexed Points Browser */}
      <div className="p-5 rounded-2xl bg-[#11141e]/90 border border-slate-800 backdrop-blur-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-100 tracking-wide">
              Indexed Points in Collection ({points.length} vectors)
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            Metric: Cosine Distance
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] font-mono">
                <th className="py-2.5 px-3">Point ID</th>
                <th className="py-2.5 px-3">Document</th>
                <th className="py-2.5 px-3">Page</th>
                <th className="py-2.5 px-3">Tokens</th>
                <th className="py-2.5 px-3">Payload Text Preview</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {points.map((pt) => (
                <tr
                  key={pt.id}
                  className="hover:bg-slate-800/30 transition-colors cursor-pointer"
                  onClick={() => setSelectedPoint(pt)}
                >
                  <td className="py-2.5 px-3 text-cyan-400 font-bold truncate max-w-[120px]">
                    {pt.id}
                  </td>
                  <td className="py-2.5 px-3 text-slate-200 truncate max-w-[160px] font-sans">
                    {pt.documentTitle}
                  </td>
                  <td className="py-2.5 px-3 text-slate-400">{pt.page}</td>
                  <td className="py-2.5 px-3 text-slate-400">{pt.tokenCount}</td>
                  <td className="py-2.5 px-3 text-slate-400 truncate max-w-[280px] font-sans">
                    {pt.text}
                  </td>
                  <td className="py-2.5 px-3 text-right font-sans">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPoint(pt);
                      }}
                      className="px-2.5 py-1 rounded bg-slate-850 hover:bg-slate-800 border border-slate-700 text-slate-200 text-[10px]"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Selected Point Inspector */}
        {selectedPoint && (
          <div className="mt-4 p-4 rounded-xl bg-slate-900 border border-slate-700 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-100">
              <span>Point Inspector: {selectedPoint.id}</span>
              <button
                onClick={() => setSelectedPoint(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕ Close
              </button>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              "{selectedPoint.text}"
            </p>
            <div className="p-2 rounded bg-black/60 text-[10px] font-mono text-slate-400 overflow-x-auto">
              <div>Dense Embedding (384-dim, showing first 16 values):</div>
              <div className="text-emerald-400 mt-1">
                [{selectedPoint.vector?.slice(0, 16).join(', ')}...]
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
