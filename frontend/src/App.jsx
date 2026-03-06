import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import FarmerPage from './pages/FarmerPage';
import OfficerPage from './pages/OfficerPage';
import PolicymakerPage from './pages/PolicymakerPage';
import './App.css';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-sky-50">
        {/* Top Navigation Bar */}
        <nav className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 h-16">
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-full">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl">💧</span>
              <span className="text-xl font-bold text-blue-800">Wise Drop</span>
            </Link>
            <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full border border-blue-200">
              AWS AI for Bharat 2026
            </span>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/farmer" element={<FarmerPage />} />
            <Route path="/officer" element={<OfficerPage />} />
            <Route path="/policymaker" element={<PolicymakerPage />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-slate-900 text-white py-8">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Col 1 */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">💧</span>
                  <span className="font-bold text-lg">Wise Drop</span>
                </div>
                <p className="text-slate-400 text-sm">AI-Powered Groundwater Intelligence</p>
              </div>
              
              {/* Col 2 */}
              <div>
                <p className="text-slate-400 text-xs mb-2">Built with</p>
                <div className="flex flex-wrap gap-2">
                  {['Amazon Bedrock', 'AWS Lambda', 'Amazon S3', 'API Gateway'].map((service) => (
                    <span key={service} className="bg-slate-800 text-slate-300 text-xs px-2 py-1 rounded">
                      {service}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Col 3 */}
              <div>
                <span className="bg-green-900/30 text-green-400 text-xs font-semibold px-3 py-1 rounded-full border border-green-700 inline-block mb-2">
                  🌐 SDG 6 Aligned
                </span>
                <p className="text-slate-400 text-sm">AI for Bharat Hackathon 2026</p>
              </div>
            </div>
            
            <div className="border-t border-slate-800 pt-4 text-center">
              <p className="text-slate-500 text-xs">Made with ❤️ for India's water future</p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}
