/**
 * HomePage Component - Complete UI Overhaul
 * World-class design with proper styling and layout
 */

import { useNavigate } from 'react-router-dom';
import GroundwaterRiskDashboard from '../components/GroundwaterRiskDashboard';

export default function HomePage() {
  const navigate = useNavigate();

  const scrollToAgents = () => {
    document.getElementById('agents-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToDashboard = () => {
    document.getElementById('dashboard-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="bg-gradient-to-br from-blue-950 via-blue-900 to-cyan-800 min-h-[480px] flex items-center justify-center relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0c1445 0%, #1e3a8a 50%, #0e7490 100%)"
        }}
      >
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          {/* Badge */}
          <div className="mb-4 inline-block">
            <span className="bg-cyan-500/20 text-cyan-200 text-xs font-semibold px-4 py-1.5 rounded-full border border-cyan-400/40">
              🌐 SDG 6 Aligned · ⚡ AWS Serverless
            </span>
          </div>
          
          {/* Main Title */}
          <h1 className="text-6xl font-black text-white mb-3 drop-shadow-lg">💧 Wise Drop</h1>
          
          {/* Subtitle */}
          <h2 className="text-2xl font-semibold text-cyan-300 mb-4">
            AI-Powered Groundwater Intelligence for India
          </h2>
          
          {/* Tagline */}
          <p className="text-blue-200 text-base mb-8 max-w-xl mx-auto">
            Turning groundwater chaos into orchestrated intelligence
          </p>
          
          {/* CTA Buttons */}
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={scrollToAgents}
              className="bg-white text-blue-900 font-bold px-8 py-3 rounded-full hover:bg-blue-50 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
            >
              Explore Agents ↓
            </button>
            <button
              onClick={scrollToDashboard}
              className="bg-transparent text-white font-bold px-8 py-3 rounded-full border-2 border-white/60 hover:bg-white/10 transition-all duration-300"
            >
              View Risk Dashboard ↓
            </button>
          </div>
        </div>
      </section>

      {/* KPI Stats Bar */}
      <section className="bg-sky-50 py-8 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white shadow-xl rounded-2xl px-8 py-6 -mt-16 relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 divide-x divide-slate-100">
              <StatItem icon="💧" value="42B+" label="Litres Saveable/Year" />
              <StatItem icon="🌾" value="40%" label="Less Water via Crop Switch" />
              <StatItem icon="🏘️" value="150+" label="Villages Analyzed" />
              <StatItem icon="🎯" value="SDG 6" label="Targets 6.3, 6.4, 6.5" />
              <StatItem icon="⚡" value="Live" label="Risk Scoring Engine" />
            </div>
          </div>
        </div>
      </section>

      {/* Choose Your Agent Section */}
      <section id="agents-section" className="bg-sky-50 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-widest text-cyan-600 uppercase mb-2">
              MULTI-AGENT AI PLATFORM
            </p>
            <h2 className="text-4xl font-black text-slate-900">Choose Your Agent</h2>
            <p className="text-slate-500 mt-2">Same aquifer data, three intelligent perspectives</p>
          </div>

          {/* Role Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <AgentCard
              color="green"
              icon="🧑‍🌾"
              title="Farmer Agent"
              subtitle="Irrigation advice, crop recommendations & subsidy alerts"
              features={[
                '✓ Safe extraction limits',
                '✓ Crop recommendations',
                '✓ Subsidy eligibility',
                '✓ Contamination alerts'
              ]}
              badge="🌾 Simple Language"
              cta="Get Farmer Advice →"
              onClick={() => navigate('/farmer')}
            />
            
            <AgentCard
              color="blue"
              icon="🏛️"
              title="Village Officer Agent"
              subtitle="SDG 6 compliance reports & contamination monitoring"
              features={[
                '✓ Aquifer health reports',
                '✓ Contamination hotspots',
                '✓ SDG 6 compliance score',
                '✓ Budget recommendations'
              ]}
              badge="🏛️ Governance Report"
              cta="Generate Report →"
              onClick={() => navigate('/officer')}
            />
            
            <AgentCard
              color="purple"
              icon="📊"
              title="Policy Maker Agent"
              subtitle="State-level simulations & economic impact projections"
              features={[
                '✓ Policy simulation engine',
                '✓ Aquifer recovery projections',
                '✓ Economic impact analysis',
                '✓ SDG 6 gap analysis'
              ]}
              badge="📊 Policy Simulation"
              cta="Run Simulation →"
              onClick={() => navigate('/policymaker')}
            />
          </div>
        </div>
      </section>

      {/* Groundwater Risk Dashboard Section */}
      <div id="dashboard-section">
        <GroundwaterRiskDashboard />
      </div>
    </div>
  );
}

// Stat Item Component
function StatItem({ icon, value, label }) {
  return (
    <div className="text-center px-2">
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-3xl font-black text-blue-800">{value}</div>
      <div className="text-xs text-slate-500 font-medium">{label}</div>
    </div>
  );
}

// Agent Card Component
function AgentCard({ color, icon, title, subtitle, features, badge, cta, onClick }) {
  const colorClasses = {
    green: {
      band: 'bg-gradient-to-r from-green-400 to-emerald-600',
      iconBg: 'bg-green-100',
      badgeBg: 'bg-green-50 text-green-700',
      ctaText: 'text-green-600 group-hover:text-green-700'
    },
    blue: {
      band: 'bg-gradient-to-r from-blue-400 to-cyan-600',
      iconBg: 'bg-blue-100',
      badgeBg: 'bg-blue-50 text-blue-700',
      ctaText: 'text-blue-600 group-hover:text-blue-700'
    },
    purple: {
      band: 'bg-gradient-to-r from-purple-400 to-violet-600',
      iconBg: 'bg-purple-100',
      badgeBg: 'bg-purple-50 text-purple-700',
      ctaText: 'text-purple-600 group-hover:text-purple-700'
    }
  };

  const colors = colorClasses[color];

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden group hover:-translate-y-2"
    >
      {/* Colored Top Band */}
      <div className={`h-2 ${colors.band}`}></div>
      
      {/* Card Body */}
      <div className="p-8">
        {/* Icon */}
        <div className={`w-16 h-16 ${colors.iconBg} rounded-2xl flex items-center justify-center text-4xl mb-4 group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        
        {/* Title */}
        <h3 className="text-xl font-bold text-slate-900 mb-1">{title}</h3>
        
        {/* Subtitle */}
        <p className="text-slate-500 text-sm mb-4">{subtitle}</p>
        
        {/* Features */}
        <div className="space-y-1 mb-4">
          {features.map((feature, i) => (
            <p key={i} className="text-xs text-slate-500">{feature}</p>
          ))}
        </div>
        
        {/* Badge */}
        <div className="mb-4">
          <span className={`${colors.badgeBg} text-xs font-semibold px-3 py-1 rounded-full inline-block`}>
            {badge}
          </span>
        </div>
        
        {/* CTA */}
        <p className={`${colors.ctaText} font-semibold text-sm transition-colors`}>
          {cta}
        </p>
      </div>
    </div>
  );
}
