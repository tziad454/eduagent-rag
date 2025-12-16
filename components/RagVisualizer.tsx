import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { RetrievedChunk } from '../types';

interface RagVisualizerProps {
  chunks: RetrievedChunk[];
}

const RagVisualizer: React.FC<RagVisualizerProps> = ({ chunks }) => {
  if (chunks.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-lg">
        No context retrieved yet.
      </div>
    );
  }

  const data = chunks.map(chunk => ({
    name: chunk.title.length > 15 ? chunk.title.substring(0, 15) + '...' : chunk.title,
    fullTitle: chunk.title,
    score: (chunk.score * 100).toFixed(1),
    source: chunk.source
  }));

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mt-4">
      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
        Retrieval Confidence Scores
      </h3>
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 10, right: 30 }}>
            <XAxis type="number" domain={[0, 100]} hide />
            <YAxis 
              dataKey="name" 
              type="category" 
              width={100} 
              tick={{ fontSize: 11, fill: '#64748b' }} 
              interval={0}
            />
            <Tooltip 
              cursor={{ fill: 'transparent' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const d = payload[0].payload;
                  return (
                    <div className="bg-slate-800 text-white text-xs p-2 rounded shadow-lg">
                      <p className="font-bold">{d.fullTitle}</p>
                      <p>Source: {d.source}</p>
                      <p className="text-emerald-300">Relevance: {d.score}%</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={20}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={Number(entry.score) > 50 ? '#4f46e5' : '#94a3b8'} />
              ))}
            </Bar>
            <ReferenceLine x={50} stroke="#cbd5e1" strokeDasharray="3 3" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RagVisualizer;