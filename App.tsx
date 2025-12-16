import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  BrainCircuit, 
  Bot, 
  User, 
  ChevronRight, 
  Layers,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { INITIAL_KNOWLEDGE_BASE } from './constants';
import { DocumentChunk, Message, RetrievedChunk, ViewMode } from './types';
import { generateRAGResponse, retrieveContext } from './services/geminiService';
import RagVisualizer from './components/RagVisualizer';
import KnowledgeBase from './components/KnowledgeBase';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'agent',
      content: "Hello! I am EduAgent. I have access to your course materials on Vygotsky, ITS, and AI Agent architecture. How can I help you learn today?",
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [documents, setDocuments] = useState<DocumentChunk[]>(INITIAL_KNOWLEDGE_BASE);
  const [currentRetrievedContext, setCurrentRetrievedContext] = useState<RetrievedChunk[]>([]);
  const [activeTab, setActiveTab] = useState<ViewMode>('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isThinking) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsThinking(true);
    setActiveTab('chat'); // Switch back to chat on send

    const startTime = Date.now();

    try {
      // 1. Retrieval Step (Simulated Vector Search)
      const retrieved = retrieveContext(userMessage.content, documents);
      setCurrentRetrievedContext(retrieved);

      // 2. Generation Step (Gemini)
      const responseText = await generateRAGResponse(userMessage.content, retrieved);
      
      const endTime = Date.now();

      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'agent',
        content: responseText,
        timestamp: Date.now(),
        retrievedContext: retrieved,
        thinkingTime: endTime - startTime
      };

      setMessages(prev => [...prev, agentMessage]);
    } catch (error) {
      console.error("RAG Pipeline Error", error);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="h-screen w-full bg-slate-50 flex flex-col md:flex-row overflow-hidden">
      {/* Sidebar / Navigation */}
      <div className="w-full md:w-20 bg-indigo-900 flex flex-row md:flex-col items-center py-4 gap-4 px-4 md:px-0 z-10 shrink-0">
        <div className="p-2 bg-indigo-500 rounded-xl shadow-lg shadow-indigo-500/50 mb-0 md:mb-6">
          <BrainCircuit className="w-6 h-6 text-white" />
        </div>
        
        <button 
          onClick={() => setActiveTab('chat')}
          className={`p-3 rounded-xl transition-all ${activeTab === 'chat' ? 'bg-white/10 text-white' : 'text-indigo-300 hover:text-white'}`}
          title="Chat & Reasoning"
        >
          <Sparkles className="w-5 h-5" />
        </button>

        <button 
          onClick={() => setActiveTab('knowledge')}
          className={`p-3 rounded-xl transition-all ${activeTab === 'knowledge' ? 'bg-white/10 text-white' : 'text-indigo-300 hover:text-white'}`}
          title="Knowledge Base"
        >
          <Layers className="w-5 h-5" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:flex-row h-full relative">
        
        {/* Left Panel: Chat Interface */}
        <div className={`flex-1 flex flex-col h-full transition-opacity duration-300 ${activeTab === 'knowledge' && window.innerWidth < 768 ? 'hidden' : 'block'}`}>
          {/* Header */}
          <div className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6 shrink-0">
            <div>
              <h1 className="text-lg font-bold text-slate-800">EduAgent Interface</h1>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Gemini-2.5-Flash Active
              </p>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50/50">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-4 max-w-3xl mx-auto ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-slate-200' : 'bg-indigo-100'}`}>
                  {msg.role === 'user' ? <User className="w-5 h-5 text-slate-600" /> : <Bot className="w-5 h-5 text-indigo-600" />}
                </div>
                
                <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} max-w-[85%]`}>
                  <div className={`p-4 rounded-2xl shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-tr-sm' 
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm'
                  }`}>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                  </div>

                  {/* Metadata / Context Tags */}
                  <div className="mt-2 flex flex-wrap gap-2 items-center">
                    <span className="text-[10px] text-slate-400">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {msg.thinkingTime && (
                      <span className="text-[10px] text-indigo-400 font-medium bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                         {msg.thinkingTime}ms processing
                      </span>
                    )}
                  </div>
                  
                  {/* Inline Retrieval Proof */}
                  {msg.role === 'agent' && msg.retrievedContext && msg.retrievedContext.length > 0 && (
                     <div className="mt-2 text-xs bg-emerald-50 border border-emerald-100 text-emerald-700 p-2 rounded-lg flex items-start gap-2 w-full">
                       <BookOpen className="w-3 h-3 mt-0.5 shrink-0" />
                       <div>
                         <span className="font-semibold">Sources Used: </span>
                         {msg.retrievedContext.map(c => c.title).join(', ')}
                       </div>
                     </div>
                  )}
                </div>
              </div>
            ))}
            {isThinking && (
              <div className="flex gap-4 max-w-3xl mx-auto">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center animate-pulse">
                  <Bot className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">Retrieving context & reasoning...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-slate-200 shrink-0">
            <div className="max-w-3xl mx-auto relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about the course material..."
                className="w-full pl-4 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
              />
              <button 
                onClick={handleSendMessage}
                disabled={!input.trim() || isThinking}
                className="absolute right-2 top-2 p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-center text-[10px] text-slate-400 mt-2">
              EduAgent searches the Knowledge Base before answering.
            </p>
          </div>
        </div>

        {/* Right Panel: RAG Internals & Knowledge */}
        <div className={`w-full md:w-[400px] border-l border-slate-200 bg-white md:bg-slate-50/80 p-6 flex flex-col gap-6 overflow-y-auto ${activeTab === 'chat' && window.innerWidth < 768 ? 'hidden' : 'block'}`}>
          
          {activeTab === 'knowledge' ? (
             <KnowledgeBase 
               documents={documents} 
               onAddDocument={(doc) => setDocuments([...documents, doc])} 
             />
          ) : (
            <>
              {/* RAG Context Visualization */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <BrainCircuit className="w-5 h-5 text-indigo-600" />
                  <h2 className="font-semibold text-slate-800">Retrieval Reasoning</h2>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  This panel visualizes the "Retrieval" in RAG. When you ask a question, the system finds the most relevant chunks from the database to augment the LLM's knowledge.
                </p>
                
                <RagVisualizer chunks={currentRetrievedContext} />
              </div>

              {/* Detailed Context Viewer */}
              {currentRetrievedContext.length > 0 && (
                <div className="flex-1 min-h-0 flex flex-col">
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <ChevronRight className="w-3 h-3" />
                    Relevant Chunks Passed to LLM
                  </h3>
                  <div className="space-y-3 overflow-y-auto pr-2 pb-4">
                    {currentRetrievedContext.map((chunk, idx) => (
                      <div key={idx} className="bg-white p-3 rounded-lg border border-indigo-100 shadow-sm relative group">
                        <div className="absolute top-3 right-3 text-[10px] font-bold text-indigo-300">
                          #{(chunk.score * 100).toFixed(0)}%
                        </div>
                        <h4 className="font-medium text-sm text-indigo-900 mb-1 pr-8">{chunk.title}</h4>
                        <p className="text-xs text-slate-600 leading-relaxed line-clamp-4 group-hover:line-clamp-none transition-all">
                          {chunk.content}
                        </p>
                        <div className="mt-2 pt-2 border-t border-slate-50 flex justify-between items-center">
                          <span className="text-[10px] text-slate-400 italic">{chunk.source}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;