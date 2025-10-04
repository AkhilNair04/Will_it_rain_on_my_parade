import React from 'react';
import { Settings, FileText, Download, Code, Eye, Share2 } from 'lucide-react';

export default function ExportShare() {
  // Add dark background to body
  React.useEffect(() => {
    document.body.style.backgroundColor = '#0f172a';
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      {/* Header */}
      <header className="bg-slate-800/50 rounded-2xl p-4 mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <div className="w-6 h-6 bg-blue-400 rounded"></div>
          </div>
          <span className="text-xl font-bold">WeatherWise</span>
        </div>
        
        <nav className="flex items-center gap-8">
          <a href="#" className="text-gray-300 hover:text-white transition-colors">Dashboard</a>
          <a href="#" className="text-gray-300 hover:text-white transition-colors">Forecast</a>
          <a href="#" className="text-blue-400 font-semibold">Export & Share</a>
        </nav>

        <div className="flex items-center gap-4">
          <button className="w-10 h-10 rounded-full bg-slate-700/50 flex items-center justify-center hover:bg-slate-700 transition-colors">
            <Settings className="w-5 h-5 text-gray-300" />
          </button>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-pink-400"></div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto">
        {/* Title Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-3">Export & Share</h1>
          <p className="text-gray-400 text-lg">Download your weather insights or share them on social media.</p>
        </div>

        {/* Export Options */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Export Options</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* PDF Report */}
            <button className="bg-slate-800/50 hover:bg-slate-800 transition-all rounded-xl p-6 flex flex-col items-center gap-3 group">
              <div className="w-16 h-16 bg-slate-700/50 rounded-xl flex items-center justify-center group-hover:bg-slate-700 transition-colors">
                <FileText className="w-8 h-8 text-blue-400" />
              </div>
              <span className="font-semibold">PDF Report</span>
            </button>

            {/* Download CSV */}
            <button className="bg-slate-800/50 hover:bg-slate-800 transition-all rounded-xl p-6 flex flex-col items-center gap-3 group">
              <div className="w-16 h-16 bg-slate-700/50 rounded-xl flex items-center justify-center group-hover:bg-slate-700 transition-colors">
                <Download className="w-8 h-8 text-blue-400" />
              </div>
              <span className="font-semibold">Download CSV</span>
            </button>

            {/* Download JSON */}
            <button className="bg-slate-800/50 hover:bg-slate-800 transition-all rounded-xl p-6 flex flex-col items-center gap-3 group">
              <div className="w-16 h-16 bg-slate-700/50 rounded-xl flex items-center justify-center group-hover:bg-slate-700 transition-colors">
                <Code className="w-8 h-8 text-blue-400" />
              </div>
              <span className="font-semibold">Download JSON</span>
            </button>

            {/* View JSON */}
            <button className="bg-slate-800/50 hover:bg-slate-800 transition-all rounded-xl p-6 flex flex-col items-center gap-3 group">
              <div className="w-16 h-16 bg-slate-700/50 rounded-xl flex items-center justify-center group-hover:bg-slate-700 transition-colors">
                <Eye className="w-8 h-8 text-blue-400" />
              </div>
              <span className="font-semibold">View JSON</span>
            </button>
          </div>
        </div>

        {/* Report Preview */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Report Preview</h2>
          <div className="bg-slate-800/50 rounded-2xl overflow-hidden">
            {/* Preview Image */}
            <div className="relative h-64 bg-gradient-to-r from-teal-900 to-slate-800">
              {/* Dashboard preview mockup */}
              <div className="absolute inset-0 p-8">
                <div className="grid grid-cols-3 gap-4 h-full">
                  {/* Left side - bars */}
                  <div className="space-y-3">
                    <div className="h-3 bg-teal-600/40 rounded"></div>
                    <div className="grid grid-cols-4 gap-2">
                      {[30, 50, 40, 60].map((h, i) => (
                        <div key={i} className="bg-teal-500/40 rounded" style={{ height: `${h}px` }}></div>
                      ))}
                    </div>
                    <div className="h-3 bg-teal-600/40 rounded w-3/4"></div>
                  </div>

                  {/* Middle - stats */}
                  <div className="flex flex-col justify-center gap-3">
                    <div className="bg-slate-700/40 rounded-lg p-3 space-y-2">
                      <div className="h-2 bg-teal-500/40 rounded w-1/2"></div>
                      <div className="h-2 bg-teal-500/40 rounded w-3/4"></div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-slate-700/40 rounded-lg p-2 flex items-center justify-center">
                        <div className="w-8 h-8 bg-teal-500/40 rounded-full"></div>
                      </div>
                      <div className="bg-slate-700/40 rounded-lg p-2 flex items-center justify-center">
                        <div className="w-8 h-8 bg-teal-500/40 rounded-full"></div>
                      </div>
                    </div>
                  </div>

                  {/* Right side - hand pointing */}
                  <div className="flex items-center justify-end">
                    <div className="relative">
                      {/* Pie chart mockup */}
                      <div className="w-24 h-24 bg-gradient-to-br from-teal-400/30 to-teal-600/30 rounded-full"></div>
                      {/* Hand illustration */}
                      <div className="absolute -right-12 top-8">
                        <svg width="120" height="80" viewBox="0 0 120 80" fill="none">
                          <path d="M 20 60 Q 30 50 40 55 L 45 50 Q 50 45 55 50 L 60 45 Q 65 40 70 45 L 75 40 Q 80 35 85 40 L 90 35 Q 95 30 100 35 L 100 50 Q 95 60 85 65 L 60 70 Q 40 70 25 65 Z" fill="#d4a574" />
                          <ellipse cx="30" cy="55" rx="8" ry="6" fill="#c89a68" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Report Info */}
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">WeatherWise Report</h3>
              <p className="text-gray-400 mb-1">Detailed weather analysis for your outdoor activities.</p>
              <p className="text-sm text-gray-500">Weather Report for Central Park, NY</p>
            </div>
          </div>
        </div>

        {/* Social Share Preview */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Social Share Preview</h2>
          <div className="bg-slate-800/50 rounded-2xl overflow-hidden">
            {/* Social Card Preview */}
            <div className="relative bg-gradient-to-br from-teal-400 via-cyan-300 to-teal-400 p-8">
              <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg mx-auto">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Lioremm ipsum loiseNtir at c.amat</h3>
                  <p className="text-gray-500 text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
                </div>

                {/* Weather Icons */}
                <div className="flex justify-center gap-8">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center">
                      <Share2 className="w-8 h-8 text-white" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Share Info */}
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">Weather Forecast for Central Park, NY</h3>
              <p className="text-gray-400 mb-3">Probability of rain: 10%, Temperature: 25°C</p>
              <a href="#" className="text-blue-400 hover:text-blue-300 text-sm font-semibold">WeatherWise</a>
            </div>
          </div>
        </div>

        {/* Share Button */}
        <div className="flex justify-end">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold flex items-center gap-2 transition-colors shadow-lg">
            <Share2 className="w-5 h-5" />
            Share on Social Media
          </button>
        </div>
      </div>
    </div>
  );
}