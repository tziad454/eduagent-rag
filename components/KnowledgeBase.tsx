import React, { useState } from 'react';
import { DocumentChunk } from '../types';
import { Database, FileText, Search, Plus } from 'lucide-react';

interface KnowledgeBaseProps {
  documents: DocumentChunk[];
  onAddDocument: (doc: DocumentChunk) => void;
}

const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({ documents, onAddDocument }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  const filteredDocs = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    if (!newTitle || !newContent) return;
    onAddDocument({
      id: Date.now().toString(),
      title: newTitle,
      source: 'User Upload',
      content: newContent
    });
    setNewTitle('');
    setNewContent('');
    setIsAdding(false);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
        <div className="flex items-center gap-2 text-slate-700">
          <Database className="w-5 h-5 text-indigo-600" />
          <h2 className="font-semibold">Vector Database Content</h2>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="p-1.5 hover:bg-white rounded-md transition-colors text-indigo-600"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {isAdding && (
        <div className="p-4 border-b border-indigo-100 bg-indigo-50 animate-in slide-in-from-top-2">
          <input 
            className="w-full mb-2 p-2 rounded border border-indigo-200 text-sm focus:outline-none focus:border-indigo-500"
            placeholder="Document Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <textarea 
            className="w-full mb-2 p-2 rounded border border-indigo-200 text-sm focus:outline-none focus:border-indigo-500 min-h-[80px]"
            placeholder="Content payload..."
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <button onClick={() => setIsAdding(false)} className="text-xs text-slate-500 px-3 py-1">Cancel</button>
            <button onClick={handleAdd} className="text-xs bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700">Embed & Save</button>
          </div>
        </div>
      )}

      <div className="p-3">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input 
            type="text"
            placeholder="Search chunks..."
            className="w-full pl-9 pr-4 py-2 bg-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {filteredDocs.map(doc => (
          <div key={doc.id} className="p-3 border border-slate-100 rounded-lg hover:border-indigo-200 transition-colors group bg-white">
            <div className="flex items-start justify-between mb-1">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" />
                <span className="font-medium text-sm text-slate-700">{doc.title}</span>
              </div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">{doc.source}</span>
            </div>
            <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed pl-6">
              {doc.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KnowledgeBase;