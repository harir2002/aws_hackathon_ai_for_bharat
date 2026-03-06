import { useState } from "react";

const districts = [
  { state: "Punjab",          district: "Amritsar",    depth: 22,  fluoride: 2.8, extraction: 2800, recharge: 12, drought: true,  risk: "Critical" },
  { state: "Punjab",          district: "Ludhiana",    depth: 28,  fluoride: 1.8, extraction: 2400, recharge: 14, drought: true,  risk: "High Risk" },
  { state: "Rajasthan",       district: "Jaipur",      depth: 18,  fluoride: 3.2, extraction: 3000, recharge: 8,  drought: true,  risk: "Critical" },
  { state: "Rajasthan",       district: "Jodhpur",     depth: 14,  fluoride: 4.1, extraction: 2900, recharge: 6,  drought: true,  risk: "Critical" },
  { state: "Rajasthan",       district: "Barmer",      depth: 35,  fluoride: 2.2, extraction: 2200, recharge: 10, drought: true,  risk: "High Risk" },
  { state: "Maharashtra",     district: "Latur",       depth: 26,  fluoride: 2.1, extraction: 1800, recharge: 18, drought: true,  risk: "High Risk" },
  { state: "Maharashtra",     district: "Osmanabad",   depth: 38,  fluoride: 1.2, extraction: 1400, recharge: 22, drought: false, risk: "Moderate Risk" },
  { state: "Andhra Pradesh",  district: "Guntur",      depth: 32,  fluoride: 1.9, extraction: 2000, recharge: 20, drought: true,  risk: "High Risk" },
  { state: "Andhra Pradesh",  district: "Kurnool",     depth: 19,  fluoride: 3.5, extraction: 2600, recharge: 12, drought: true,  risk: "Critical" },
  { state: "Tamil Nadu",      district: "Madurai",     depth: 42,  fluoride: 1.1, extraction: 1600, recharge: 28, drought: false, risk: "Moderate Risk" },
  { state: "Tamil Nadu",      district: "Vellore",     depth: 55,  fluoride: 0.8, extraction: 1200, recharge: 35, drought: false, risk: "Low Risk" },
];

const riskConfig = {
  "Critical":      { bg: "bg-red-50",     border: "border-red-400",    badge: "bg-red-600 text-white",       dot: "bg-red-500",    icon: "🔴", text: "text-red-700" },
  "High Risk":     { bg: "bg-orange-50",  border: "border-orange-400", badge: "bg-orange-500 text-white",    dot: "bg-orange-500", icon: "🟠", text: "text-orange-700" },
  "Moderate Risk": { bg: "bg-yellow-50",  border: "border-yellow-400", badge: "bg-yellow-400 text-black",    dot: "bg-yellow-500", icon: "🟡", text: "text-yellow-700" },
  "Low Risk":      { bg: "bg-green-50",   border: "border-green-400",  badge: "bg-green-500 text-white",     dot: "bg-green-500",  icon: "🟢", text: "text-green-700" },
};

const stateColors = {
  "Punjab":         "bg-blue-100 text-blue-700",
  "Rajasthan":      "bg-orange-100 text-orange-700",
  "Maharashtra":    "bg-purple-100 text-purple-700",
  "Andhra Pradesh": "bg-teal-100 text-teal-700",
  "Tamil Nadu":     "bg-green-100 text-green-700",
};

const riskOrder = { "Critical": 0, "High Risk": 1, "Moderate Risk": 2, "Low Risk": 3 };

export default function GroundwaterRiskDashboard() {
  const [filter, setFilter] = useState("All");
  const [hoveredDistrict, setHoveredDistrict] = useState(null);

  const filters = ["All", "Critical", "High Risk", "Moderate Risk", "Low Risk"];

  const filtered = districts
    .filter(d => filter === "All" || d.risk === filter)
    .sort((a, b) => riskOrder[a.risk] - riskOrder[b.risk]);

  const counts = {
    Critical:      districts.filter(d => d.risk === "Critical").length,
    "High Risk":   districts.filter(d => d.risk === "High Risk").length,
    "Moderate Risk": districts.filter(d => d.risk === "Moderate Risk").length,
    "Low Risk":    districts.filter(d => d.risk === "Low Risk").length,
  };

  return (
    <section className="py-20 px-6 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-xs font-bold tracking-widest text-cyan-600 uppercase mb-2">PAN-INDIA COVERAGE</p>
          <h2 className="text-4xl font-black text-slate-900">Groundwater Risk Intelligence</h2>
          <p className="text-slate-500 mt-2">Real-time risk assessment across 11 monitored districts in 5 states</p>
        </div>

        {/* Summary Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Critical Zones",  value: counts["Critical"],       color: "from-red-500 to-red-600",     icon: "🚨" },
            { label: "High Risk Zones", value: counts["High Risk"],      color: "from-orange-500 to-orange-600", icon: "⚠️" },
            { label: "Moderate Zones",  value: counts["Moderate Risk"],  color: "from-yellow-500 to-yellow-600", icon: "📊" },
            { label: "Safe Zones",      value: counts["Low Risk"],       color: "from-green-500 to-green-600",   icon: "✅" },
          ].map(stat => (
            <div key={stat.label} className={`bg-gradient-to-br ${stat.color} rounded-2xl p-5 text-white text-center shadow-lg`}>
              <div className="text-3xl mb-1">{stat.icon}</div>
              <div className="text-4xl font-black">{stat.value}</div>
              <div className="text-sm opacity-90 font-medium mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border ${
                filter === f
                  ? "bg-blue-800 text-white border-blue-800 shadow-md"
                  : "bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600"
              }`}
            >
              {f === "All" ? `🗺️ All Districts (${districts.length})` : `${riskConfig[f].icon} ${f} (${counts[f] || 0})`}
            </button>
          ))}
        </div>

        {/* District Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(d => {
            const cfg = riskConfig[d.risk];
            const isHovered = hoveredDistrict === d.district;
            const extractionRatio = (d.extraction / (d.recharge * 1000 / 30)).toFixed(1);

            return (
              <div
                key={d.district}
                onMouseEnter={() => setHoveredDistrict(d.district)}
                onMouseLeave={() => setHoveredDistrict(null)}
                className={`
                  ${cfg.bg} border-2 ${cfg.border} rounded-2xl p-5
                  transition-all duration-300 cursor-pointer
                  ${isHovered ? "shadow-2xl -translate-y-1 scale-[1.02]" : "shadow-md"}
                `}
              >
                {/* Card Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-black text-slate-900">{d.district}</h3>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${stateColors[d.state]}`}>
                      {d.state}
                    </span>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${cfg.badge} shadow-sm`}>
                    {d.risk}
                  </span>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-white/70 rounded-xl p-3">
                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-0.5">Aquifer Depth</p>
                    <p className="text-xl font-black text-slate-800">{d.depth}m</p>
                    <p className={`text-xs font-medium ${d.depth < 25 ? "text-red-600" : d.depth < 40 ? "text-orange-600" : "text-green-600"}`}>
                      {d.depth < 25 ? "⚠ Critical" : d.depth < 40 ? "↓ Low" : "✓ Safe"}
                    </p>
                  </div>
                  <div className="bg-white/70 rounded-xl p-3">
                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-0.5">Fluoride</p>
                    <p className="text-xl font-black text-slate-800">{d.fluoride}<span className="text-sm font-normal text-slate-500"> ppm</span></p>
                    <p className={`text-xs font-medium ${d.fluoride > 1.5 ? "text-red-600" : "text-green-600"}`}>
                      {d.fluoride > 1.5 ? "⚠ Above WHO" : "✓ WHO Safe"}
                    </p>
                  </div>
                  <div className="bg-white/70 rounded-xl p-3">
                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-0.5">Extraction</p>
                    <p className="text-xl font-black text-slate-800">{(d.extraction/1000).toFixed(1)}<span className="text-sm font-normal text-slate-500"> kL/d</span></p>
                    <p className="text-xs text-slate-500">vs {d.recharge}mm recharge</p>
                  </div>
                  <div className="bg-white/70 rounded-xl p-3">
                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-0.5">Stress Ratio</p>
                    <p className={`text-xl font-black ${parseFloat(extractionRatio) > 2 ? "text-red-700" : parseFloat(extractionRatio) > 1.3 ? "text-orange-700" : "text-green-700"}`}>
                      {extractionRatio}x
                    </p>
                    <p className="text-xs text-slate-500">Extraction/Recharge</p>
                  </div>
                </div>

                {/* Bottom Row */}
                <div className="flex items-center justify-between pt-3 border-t border-white/50">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                    <span className={`text-xs font-semibold ${cfg.text}`}>{d.risk}</span>
                  </div>
                  {d.drought && (
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-semibold">
                      ☀️ Drought Prone
                    </span>
                  )}
                </div>

                {/* Hover expand: action hint */}
                {isHovered && (
                  <div className="mt-3 pt-3 border-t border-white/50">
                    <p className="text-xs text-slate-500 font-medium">
                      💡 Select <strong>{d.state} → {d.district}</strong> in agent above for AI analysis
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Note */}
        <p className="text-center text-xs text-slate-400 mt-8">
          📊 Data from 150+ villages across 5 states · Updated via S3 dataset · Powered by Amazon Bedrock Nova Pro
        </p>
      </div>
    </section>
  );
}
