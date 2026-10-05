import React, { useState } from 'react';
import {
  FolderOpen,
  FileText,
  Upload,
  Trash2,
  Search,
} from 'lucide-react';
import { RAGDocument } from '../types/agent';

interface DocumentLibraryViewProps {
  documents: RAGDocument[];
  onUploadClick: () => void;
  onDeleteDocument: (id: string) => void;
  onSelectDocumentChunks: (doc: RAGDocument) => void;
}

export const DocumentLibraryView: React.FC<DocumentLibraryViewProps> = ({
  documents,
  onUploadClick,
  onDeleteDocument,
  onSelectDocumentChunks,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDocs = documents.filter(
    (d) =>
      d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 select-none max-w-6xl mx-auto">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-teal-950/40 border border-teal-800 text-teal-400">
            <FolderOpen className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              PDF Knowledge Vault & Chunks
            </h1>
            <p className="text-xs text-slate-400">
              Manage indexed technical documentation, vector chunks, and HuggingFace miniLM embeddings
            </p>
          </div>
        </div>

        <button
          onClick={onUploadClick}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white transition-all shadow-md shadow-cyan-950 cursor-pointer"
        >
          <Upload className="w-4 h-4" />
          <span>Upload PDF Document</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter documents by title, tags (e.g. 'Qdrant', 'HITL', 'Agents')..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#11141e] border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
        />
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="p-5 rounded-2xl bg-[#11141e]/90 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between backdrop-blur-md space-y-4 group"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
                  <FileText className="w-5 h-5 text-cyan-400" />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-bold uppercase">
                  {doc.status}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-100 group-hover:text-cyan-300 transition-colors line-clamp-1">
                  {doc.title}
                </h3>
                <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                  {doc.filename} • {doc.fileSize}
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                {doc.summary}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {doc.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-400"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <div className="text-[11px] font-mono text-slate-400">
                {doc.chunksCount} Chunks • {doc.pageCount} Pgs
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onSelectDocumentChunks(doc)}
                  className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
                >
                  View Chunks
                </button>

                <button
                  onClick={() => onDeleteDocument(doc.id)}
                  className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                  title="Delete Document"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
