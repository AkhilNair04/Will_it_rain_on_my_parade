import { Search, MapPin, CloudSun } from 'lucide-react';

export default function WeatherWiseLanding() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-slate-800 to-gray-900 -z-10"></div>
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <CloudSun className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-semibold text-lg">WeatherWise</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Plan with NASA Data.
          </h1>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Know Your Weather Odds.
          </h2>

          {/* Action Buttons with Glassmorphism */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            <button className="flex items-center gap-2 bg-blue-600/20 backdrop-blur-md border border-blue-400/30 hover:bg-blue-600/30 hover:border-blue-400/50 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-lg">
              <Search className="w-4 h-4" />
              Search for Place
            </button>
            <button className="flex items-center gap-2 bg-blue-600/20 backdrop-blur-md border border-blue-400/30 hover:bg-blue-600/30 hover:border-blue-400/50 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-lg">
              <MapPin className="w-4 h-4" />
              Use My Location
            </button>
            <button className="bg-blue-600/20 backdrop-blur-md border border-blue-400/30 hover:bg-blue-600/30 hover:border-blue-400/50 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-lg">
              Explore on Map
            </button>
          </div>
        </div>

        {/* Hero Image Card */}
        <div className="relative bg-gradient-to-br from-orange-200 via-amber-100 to-orange-100 rounded-2xl overflow-hidden shadow-2xl mb-8">
          <svg viewBox="0 0 400 400" className="w-full h-auto">
            {/* Sky Background */}
            <rect width="400" height="400" fill="url(#skyGradient)" />
            <defs>
              <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f4dcc4" />
                <stop offset="100%" stopColor="#e8c4a0" />
              </linearGradient>
            </defs>

            {/* Mountains - Back Layer */}
            <path d="M 0 250 Q 100 180 200 250 Q 300 180 400 250 L 400 400 L 0 400 Z" fill="#7a9b8e" opacity="0.5" />
            
            {/* Mountains - Front Layer */}
            <path d="M 0 280 Q 80 220 160 280 Q 240 200 320 280 Q 360 240 400 280 L 400 400 L 0 400 Z" fill="#5a7d70" />

            {/* Lake/Water */}
            <ellipse cx="250" cy="320" rx="120" ry="40" fill="#8da89f" opacity="0.6" />
            
            {/* Trees - Right Side */}
            {[340, 360, 375].map((x, i) => (
              <g key={`tree-right-${i}`}>
                <path d={`M ${x} 280 L ${x - 8} 300 L ${x + 8} 300 Z`} fill="#2d5a4a" />
                <path d={`M ${x} 290 L ${x - 10} 315 L ${x + 10} 315 Z`} fill="#2d5a4a" />
                <rect x={x - 2} y="300" width="4" height="15" fill="#4a3f35" />
              </g>
            ))}

            {/* Trees - Left Side */}
            {[40, 55, 70].map((x, i) => (
              <g key={`tree-left-${i}`}>
                <path d={`M ${x} 290 L ${x - 8} 310 L ${x + 8} 310 Z`} fill="#2d5a4a" />
                <path d={`M ${x} 300 L ${x - 10} 325 L ${x + 10} 325 Z`} fill="#2d5a4a" />
                <rect x={x - 2} y="310" width="4" height="15" fill="#4a3f35" />
              </g>
            ))}

            {/* Deer */}
            <g transform="translate(320, 310)">
              <ellipse cx="0" cy="8" rx="12" ry="8" fill="#8b6f47" />
              <ellipse cx="-6" cy="2" rx="6" ry="5" fill="#8b6f47" />
              <line x1="-8" y1="0" x2="-10" y2="-6" stroke="#8b6f47" strokeWidth="1.5" />
              <line x1="-4" y1="0" x2="-4" y2="-8" stroke="#8b6f47" strokeWidth="1.5" />
              <line x1="-8" y1="12" x2="-10" y2="20" stroke="#8b6f47" strokeWidth="2" />
              <line x1="-4" y1="12" x2="-6" y2="20" stroke="#8b6f47" strokeWidth="2" />
              <line x1="4" y1="12" x2="2" y2="20" stroke="#8b6f47" strokeWidth="2" />
              <line x1="8" y1="12" x2="10" y2="20" stroke="#8b6f47" strokeWidth="2" />
            </g>

            {/* Person with Backpack */}
            <g transform="translate(150, 200)">
              {/* Backpack */}
              <rect x="-15" y="10" width="30" height="40" rx="5" fill="#2d6a5f" />
              <rect x="-12" y="15" width="10" height="8" rx="2" fill="#1f4d44" />
              <rect x="2" y="15" width="10" height="8" rx="2" fill="#1f4d44" />
              <line x1="-15" y1="25" x2="15" y2="25" stroke="#1f4d44" strokeWidth="2" />
              <line x1="-15" y1="35" x2="15" y2="35" stroke="#1f4d44" strokeWidth="2" />
              
              {/* Body */}
              <ellipse cx="5" cy="55" rx="18" ry="25" fill="#2d6a5f" />
              
              {/* Legs */}
              <rect x="0" y="75" width="12" height="35" rx="6" fill="#a0674a" />
              <rect x="0" y="105" width="12" height="20" fill="#5a4a3a" />
              
              {/* Arms */}
              <rect x="-5" y="50" width="8" height="30" rx="4" fill="#2d6a5f" transform="rotate(45 -1 65)" />
              
              {/* Head/Face */}
              <circle cx="8" cy="35" r="12" fill="#d4a574" />
              
              {/* Cap */}
              <ellipse cx="8" cy="28" rx="13" ry="5" fill="#c17854" />
              <path d="M -2 28 Q 8 20 18 28" fill="#c17854" />
              <ellipse cx="15" cy="28" rx="8" ry="4" fill="#a0674a" />
              
              {/* Fishing Rod */}
              <line x1="5" y1="75" x2="100" y2="20" stroke="#8b7355" strokeWidth="2" />
              <line x1="100" y1="20" x2="130" y2="90" stroke="#e0e0e0" strokeWidth="1" strokeDasharray="2,2" />
              
              {/* Fish on Line */}
              <g transform="translate(130, 90)">
                <ellipse cx="0" cy="0" rx="8" ry="5" fill="#7a9b8e" />
                <path d="M 8 0 L 14 -3 L 14 3 Z" fill="#7a9b8e" />
              </g>
            </g>

            {/* Clouds */}
            <g opacity="0.7">
              <ellipse cx="280" cy="80" rx="30" ry="15" fill="#f5e6d3" />
              <ellipse cx="300" cy="75" rx="25" ry="12" fill="#f5e6d3" />
              <ellipse cx="320" cy="80" rx="28" ry="14" fill="#f5e6d3" />
            </g>
            <g opacity="0.6">
              <ellipse cx="100" cy="100" rx="25" ry="12" fill="#f5e6d3" />
              <ellipse cx="115" cy="95" rx="20" ry="10" fill="#f5e6d3" />
            </g>
          </svg>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors shadow-lg hover:shadow-xl inline-flex items-center gap-2">
            Start Planning
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}