/**
 * FarmerPage Component - Complete UI Overhaul
 * Beautiful farmer agent interface with world-class design
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import RiskBadge from '../components/RiskBadge';
import AlertBanner from '../components/AlertBanner';
import AgentThinking from '../components/AgentThinking';
import ExplainabilityPanel from '../components/ExplainabilityPanel';

const STATES_DISTRICTS = {
  Punjab: ["Ludhiana", "Amritsar", "Patiala", "Bathinda"],
  Rajasthan: ["Jaipur", "Jodhpur", "Bikaner", "Barmer"],
  "Tamil Nadu": ["Madurai", "Chennai", "Coimbatore", "Trichy"],
  "Andhra Pradesh": ["Guntur", "Kurnool", "Anantapur", "Nellore"],
  Maharashtra: ["Latur", "Aurangabad", "Nashik", "Pune"],
  "Uttar Pradesh": ["Agra", "Varanasi", "Meerut", "Allahabad"],
};

export default function FarmerPage() {
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponseData(null);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'https://yld21dvaua.execute-api.us-east-1.amazonaws.com/advice';
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'farmer', state, district }),
      });

      if (!res.ok) throw new Error('API request failed');

      const data = await res.json();
      const parsed = data.body ? JSON.parse(data.body) : data;
      
      if (parsed.error) throw new Error(parsed.error);
      
      setResponseData(parsed);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setState("");
    setDistrict("");
    setResponseData(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-sky-50">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-900 to-cyan-700 py-12 px-6 text-white">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="text-cyan-300 text-sm hover:text-cyan-200 mb-3 inline-block">
            ← Wise Drop
          </Link>
          <h1 className="text-4xl font-black mb-2">🧑‍🌾 Farmer Agent</h1>
          <p className="text-cyan-200 text-base">
            Get irrigation advice, crop recommendations & subsidy alerts
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Input Form */}
        {!responseData && !loading && (
          <div className="bg-white rounded-2xl shadow-xl p-8 -mt-6 relative z-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* State Select */}
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 block">
                  State
                </label>
                <div className="relative">
                  <select
                    value={state}
                    onChange={(e) => { setState(e.target.value); setDistrict(""); }}
                    required
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:border-blue-500 focus:outline-none bg-white appearance-none cursor-pointer text-base"
                  >
                    <option value="">-- Select State --</option>
                    {Object.keys(STATES_DISTRICTS).map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none">
                    ▼
                  </div>
                </div>
              </div>

              {/* District Select */}
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 block">
                  District
                </label>
                <div className="relative">
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    disabled={!state}
                    required
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:border-blue-500 focus:outline-none bg-white appearance-none cursor-pointer text-base disabled:bg-slate-50 disabled:cursor-not-allowed"
                  >
                    <option value="">-- Select District --</option>
                    {(STATES_DISTRICTS[state] || []).map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none">
                    ▼
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!state || !district}
                className="w-full bg-gradient-to-r from-blue-700 to-cyan-600 text-white font-bold py-4 rounded-xl text-base hover:from-blue-800 hover:to-cyan-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                🌾 Get Farmer Advice
              </button>
            </form>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="-mt-6 relative z-10">
            <AgentThinking role="farmer" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 -mt-6 relative z-10">
            <p className="text-red-800 font-semibold mb-2">❌ Error</p>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={reset}
              className="text-red-600 hover:text-red-800 font-medium text-sm"
            >
              ← Try Again
            </button>
          </div>
        )}

        {/* Results */}
        {responseData && (
          <div className="space-y-6 -mt-6 relative z-10">
            {/* Results Header Card */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 text-white">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl font-bold">🧑‍🌾 Farmer Agent Report</h2>
                {responseData.risk && (
                  <div className="bg-white rounded-lg px-3 py-1">
                    <RiskBadge
                      risk_score={responseData.risk.risk_score}
                      risk_category={responseData.risk.risk_category}
                    />
                  </div>
                )}
              </div>
              <p className="text-green-100 text-sm">
                📍 {responseData.district}, {responseData.state}
              </p>
            </div>

            {/* Alert Banner */}
            {responseData.alerts && responseData.alerts.length > 0 && (
              <AlertBanner alerts={responseData.alerts} />
            )}

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* LEFT COLUMN */}
              <div className="space-y-6">
                {/* Agent Answer */}
                {responseData.response?.agent_answer && (
                  <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-green-500">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">
                      💡 AI Recommendation
                    </h3>
                    <p className="text-slate-800 text-base leading-relaxed font-medium">
                      {responseData.response.agent_answer}
                    </p>
                  </div>
                )}

                {/* Crop Recommendation */}
                {responseData.response?.crop_recommendation && (
                  <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-emerald-400">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">
                      🌾 Crop Recommendation
                    </h3>
                    <p className="text-slate-800 text-base leading-relaxed">
                      {responseData.response.crop_recommendation}
                    </p>
                  </div>
                )}

                {/* Recharge Tip */}
                {responseData.response?.recharge_tip && (
                  <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-teal-400">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">
                      💧 Groundwater Recharge Tip
                    </h3>
                    <p className="text-slate-800 text-base leading-relaxed">
                      {responseData.response.recharge_tip}
                    </p>
                  </div>
                )}
              </div>

              {/* RIGHT COLUMN */}
              <div className="space-y-6">
                {/* Subsidy Alert */}
                {responseData.response?.subsidy_alert && (
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl shadow-md p-6 border border-blue-200">
                    <h3 className="text-sm font-bold text-blue-700 uppercase tracking-wider mb-3">
                      💰 Subsidy Opportunity
                    </h3>
                    <p className="text-slate-800 text-base leading-relaxed">
                      {responseData.response.subsidy_alert}
                    </p>
                  </div>
                )}

                {/* Contamination Alert */}
                {responseData.response?.contamination_alert && (
                  <div className="bg-red-50 rounded-2xl shadow-md p-6 border border-red-200 relative">
                    <div className="absolute top-4 right-4 text-2xl">⚠️</div>
                    <h3 className="text-sm font-bold text-red-700 uppercase tracking-wider mb-3">
                      ⚠️ Water Quality Alert
                    </h3>
                    <p className="text-slate-800 text-base leading-relaxed">
                      {responseData.response.contamination_alert}
                    </p>
                  </div>
                )}

                {/* Quick Stats */}
                {responseData.response?.working_calculations && (
                  <div className="bg-white rounded-2xl shadow-md p-6">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">
                      📊 Key Metrics
                    </h3>
                    <div className="space-y-3 divide-y divide-slate-100">
                      {responseData.response.working_calculations.safe_extraction_lpd && (
                        <div className="pt-3 first:pt-0">
                          <p className="text-xs text-slate-400 mb-1">🔵 Safe Extraction</p>
                          <p className="text-sm font-semibold text-slate-700">
                            {responseData.response.working_calculations.safe_extraction_lpd}
                          </p>
                        </div>
                      )}
                      {responseData.response.working_calculations.pump_cost_per_hour && (
                        <div className="pt-3">
                          <p className="text-xs text-slate-400 mb-1">💸 Pump Cost</p>
                          <p className="text-sm font-semibold text-slate-700">
                            {responseData.response.working_calculations.pump_cost_per_hour}
                          </p>
                        </div>
                      )}
                      {responseData.response.working_calculations.contamination_status && (
                        <div className="pt-3">
                          <p className="text-xs text-slate-400 mb-1">🧪 Contamination</p>
                          <p className="text-sm font-semibold text-slate-700">
                            {responseData.response.working_calculations.contamination_status}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Explainability Panel */}
            <ExplainabilityPanel
              calculations={responseData.response?.working_calculations}
              reasoning={responseData.response?.reasoning_logic}
              sources={responseData.response?.data_sources}
              tools={responseData.response?.tools_used}
            />

            {/* Reset Button */}
            <button
              onClick={reset}
              className="w-full bg-white hover:bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 font-semibold text-slate-700 transition-colors"
            >
              🔄 New Query
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
