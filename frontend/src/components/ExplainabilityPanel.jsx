/**
 * ExplainabilityPanel Component
 * Collapsible section showing AI calculations, reasoning, data sources, and tools
 */

import { useState } from 'react';

export default function ExplainabilityPanel({ calculations, reasoning, sources, tools }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-slate-600 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-slate-700 hover:bg-slate-600 px-5 py-4 flex justify-between items-center transition-colors"
      >
        <span className="font-semibold text-white text-sm">
          🧠 How did AI calculate this?
        </span>
        <span className="text-slate-300 text-sm">
          {isOpen ? '▼' : '▶'}
        </span>
      </button>
      
      {isOpen && (
        <div className="bg-slate-800 p-5 space-y-5">
          {/* Calculations */}
          {calculations && Object.keys(calculations).length > 0 && (
            <div>
              <h4 className="font-semibold text-slate-200 mb-3 text-sm">📐 Calculations</h4>
              <div className="bg-slate-900 p-4 rounded-lg font-mono text-xs space-y-2">
                {Object.entries(calculations).map(([key, value]) => (
                  <div key={key} className="text-slate-300">
                    <span className="text-cyan-400">{key}:</span> {value}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reasoning */}
          {reasoning && (
            <div>
              <h4 className="font-semibold text-slate-200 mb-3 text-sm">💡 Reasoning</h4>
              <p className="text-slate-300 leading-relaxed text-sm">{reasoning}</p>
            </div>
          )}

          {/* Data Sources */}
          {sources && sources.length > 0 && (
            <div>
              <h4 className="font-semibold text-slate-200 mb-3 text-sm">📂 Data Sources</h4>
              <p className="text-slate-300 text-sm">{sources.join(', ')}</p>
            </div>
          )}

          {/* Tools Used */}
          {tools && tools.length > 0 && (
            <div>
              <h4 className="font-semibold text-slate-200 mb-3 text-sm">🛠️ Tools Used</h4>
              <p className="text-slate-300 text-sm">{tools.join(', ')}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
