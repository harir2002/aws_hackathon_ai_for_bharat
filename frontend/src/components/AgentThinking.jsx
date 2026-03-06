/**
 * AgentThinking Component
 * Beautiful loading animation with role-specific cycling messages
 */

import { useState, useEffect } from 'react';

const MESSAGES = {
  farmer: [
    "📡 Reading district aquifer data...",
    "🧮 Calculating safe extraction limits...",
    "🌾 Matching water-efficient crops...",
    "💰 Checking subsidy eligibility..."
  ],
  officer: [
    "📊 Aggregating village data...",
    "🔬 Checking contamination thresholds...",
    "📋 Generating SDG 6 report...",
    "📌 Prioritizing recommendations..."
  ],
  policymaker: [
    "🗺️ Loading state-level data...",
    "📈 Running policy simulation...",
    "💹 Calculating economic impact...",
    "📝 Drafting policy brief..."
  ]
};

export default function AgentThinking({ role }) {
  const [messageIndex, setMessageIndex] = useState(0);
  const messages = MESSAGES[role] || MESSAGES.farmer;

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 900);

    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
      {/* Water Ripple Animation */}
      <div className="relative w-24 h-24 mx-auto mb-6">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full animate-ping absolute"></div>
          <div className="w-16 h-16 bg-blue-200 rounded-full animate-pulse absolute"></div>
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl relative z-10">
            💧
          </div>
        </div>
      </div>
      
      {/* Cycling Message */}
      <p className="text-blue-700 font-medium text-base mb-2 animate-pulse min-h-[24px]">
        {messages[messageIndex]}
      </p>
      
      {/* Static Message */}
      <p className="text-slate-400 text-sm">
        Amazon Bedrock Nova Pro is analyzing your district...
      </p>
    </div>
  );
}
