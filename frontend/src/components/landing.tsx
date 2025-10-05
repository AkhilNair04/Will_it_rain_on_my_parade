
import { useMemo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { MikeButton } from "./MikeButton";
// WeatherWise Tree of Knowledge landing page
export default function WeatherWiseLanding() {
  const navigate = useNavigate();
  const [currentSky, setCurrentSky] = useState(0);
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  const [showNodes, setShowNodes] = useState(false);
  const [visibleLetters, setVisibleLetters] = useState(0);

  // Generate stars once for stable twinkle positions
  const stars = useMemo(
    () =>
      Array.from({ length: 80 }).map(() => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 0.8 + Math.random() * 1.8, // px
        delay: Math.random() * 3,
        duration: 2 + Math.random() * 2.5,
        opacity: 0.35 + Math.random() * 0.45,
      })),
    []
  );

  // Tree node data
  const treeNodes = [
    {
      id: 1,
      question: "Planning Ahead?",
      description: "Discover hyper-local forecasts and long-range trends for any location.",
      angle: -72, // degrees from top
      color: "from-blue-400 to-cyan-300"
    },
    {
      id: 2, 
      question: "Farmer's Friend?",
      description: "Access agricultural insights, crop advisories, and historical climate data.",
      angle: -36,
      color: "from-green-400 to-emerald-300"
    },
    {
      id: 3,
      question: "Protecting What Matters?", 
      description: "Get severe weather alerts, preparedness guides, and risk assessments.",
      angle: 0,
      color: "from-red-400 to-orange-300"
    },
    {
      id: 4,
      question: "Business Smarts?",
      description: "Leverage climate analytics for strategic planning, energy, and logistics.", 
      angle: 36,
      color: "from-purple-400 to-violet-300"
    },
    {
      id: 5,
      question: "Weather?",
      description: "Forecast the future, stay informed, and make informed decisions.",
      angle: 72,
      color: "from-yellow-400 to-amber-300"
    }
  ];

  useEffect(() => {
    const skyId = setInterval(() => setCurrentSky((p) => (p + 1) % 3), 4000);
    
    // Letter-by-letter animation for title
    const titleText = "Welcome to WeatherWise!";
    let letterIndex = 0;
    const letterTimer = setInterval(() => {
      if (letterIndex <= titleText.length) {
        setVisibleLetters(letterIndex);
        letterIndex++;
      } else {
        clearInterval(letterTimer);
      }
    }, 100); // 100ms delay between each letter
    
    // Start node animations after title completes
    const nodeTimer = setTimeout(() => setShowNodes(true), titleText.length * 100 + 500);
    
    return () => {
      clearInterval(skyId);
      clearInterval(letterTimer);
      clearTimeout(nodeTimer);
    };
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background gradient + subtle radial glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-black">
        <div
          className={`absolute inset-0 bg-gradient-radial transition-all duration-1000 ease-in-out opacity-40 ${
            currentSky === 0
              ? "from-blue-600/30 via-cyan-400/10 to-transparent"
              : currentSky === 1
              ? "from-purple-600/25 via-pink-400/10 to-transparent"
              : "from-yellow-600/20 via-orange-400/10 to-transparent"
          }`}
        />

        {/* White blinking stars */}
        <div className="absolute inset-0 pointer-events-none">
          {stars.map((s, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white animate-twinkle"
              style={{
                left: `${s.left}%`,
                top: `${s.top}%`,
                width: `${s.size}px`,
                height: `${s.size}px`,
                opacity: s.opacity,
                animationDelay: `${s.delay}s`,
                animationDuration: `${s.duration}s`,
                boxShadow: "0 0 6px rgba(255,255,255,0.6)",
              }}
            />
          ))}
        </div>
      </div>

      {/* CSS for animations and 3D effects */}
      <style>{`
        .bg-gradient-radial { background: radial-gradient(circle, var(--tw-gradient-stops)); }
        @keyframes twinkle { 0%, 100% { opacity: .35; transform: scale(1); } 50% { opacity: 1; transform: scale(1.35); } }
        .animate-twinkle { animation: twinkle ease-in-out infinite; }
        
        @keyframes pulse-line {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.5); }
          50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.8), 0 0 60px rgba(59, 130, 246, 0.3); }
        }
        
        .tree-node {
          transform-style: preserve-3d;
          transition: all 0.3s ease;
          opacity: 0;
          transform: scale(0.5) translate(-50%, -50%);
        }
        
        .tree-node.visible {
          opacity: 1;
          transform: scale(1) translate(-50%, -50%);
        }
        
        .tree-node:hover {
          transform: scale(1.1) translate(-50%, -50%) translateZ(20px);
        }
        
        .connection-line {
          animation: pulse-line 2s ease-in-out infinite;
        }
        
        .central-node {
          animation: float 3s ease-in-out infinite, glow 2s ease-in-out infinite;
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #ffffff 0%, #e0e7ff 50%, #c7d2fe 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: 0 0 30px rgba(255, 255, 255, 0.5);
        }
        
        .node-text {
          background: linear-gradient(135deg, #ffffff 0%, #f1f5f9 70%, #e2e8f0 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.3));
        }
        
        .letter {
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.3s ease;
          display: inline-block;
        }
        
        .letter.visible {
          opacity: 1;
          transform: translateY(0);
        }
        
        .weatherwise-text {
          background: linear-gradient(135deg, #8b5cf6 0%, #fbbf24 50%, #f59e0b 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 0 15px rgba(139, 92, 246, 0.6));
        }
        
        /* Custom breakpoints for better responsive control */
        @media (max-width: 475px) {
          .tree-container-mobile {
            width: 288px !important;
            height: 288px !important;
          }
        }
        
        @media (min-width: 640px) and (max-width: 767px) {
          .tree-container-sm {
            width: 450px !important;
            height: 450px !important;
          }
        }
        
        @media (min-width: 768px) and (max-width: 1023px) {
          .tree-container-md {
            width: 550px !important;
            height: 550px !important;
          }
        }
        
        @media (min-width: 1024px) {
          .tree-container-lg {
            width: 650px !important;
            height: 650px !important;
          }
        }
        
        /* Celsius temperature animations */
        @keyframes temp-float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.7; }
          25% { transform: translateY(-20px) rotate(90deg); opacity: 1; }
          50% { transform: translateY(-40px) rotate(180deg); opacity: 0.8; }
          75% { transform: translateY(-20px) rotate(270deg); opacity: 1; }
        }
        
        .temp-animation {
          animation: temp-float 6s ease-in-out infinite;
          font-family: 'Courier New', monospace;
          text-shadow: 0 0 10px rgba(59, 130, 246, 0.6);
        }
      `}</style>

      {/* WeatherWise Tree of Knowledge */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8 sm:py-12 lg:py-16">
        {/* Welcome Text */}
        <div className="text-center mb-4 sm:mb-6 mt-4 sm:mt-6">
          <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light mb-2 px-2">
            {"Welcome to ".split("").map((letter, index) => (
              <span
                key={index}
                className={`letter gradient-text ${index < visibleLetters ? 'visible' : ''}`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                {letter === " " ? "\u00A0" : letter}
              </span>
            ))}
            {"WeatherWise!".split("").map((letter, index) => {
              const adjustedIndex = index + "Welcome to ".length;
              return (
                <span
                  key={adjustedIndex}
                  className={`letter weatherwise-text ${adjustedIndex < visibleLetters ? 'visible' : ''}`}
                  style={{ transitionDelay: `${adjustedIndex * 50}ms` }}
                >
                  {letter === " " ? "\u00A0" : letter}
                </span>
              );
            })}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/70 max-w-2xl mx-auto px-4">
            Explore the branches to discover how we empower your decisions.
          </p>
        </div>


        {/* 3D Tree Visualization */}
        <div className="relative w-72 h-72 sm:w-[450px] sm:h-[450px] md:w-[550px] md:h-[550px] lg:w-[650px] lg:h-[650px] mx-auto">
          {/* Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {treeNodes.map((node) => {
              // Responsive center and radius calculations using CSS viewport units
              const isMobile = window.innerWidth < 640;
              const isTablet = window.innerWidth >= 640 && window.innerWidth < 1024;
              const isDesktop = window.innerWidth >= 1024;
              
              const centerX = isMobile ? 144 : isTablet ? 225 : isDesktop ? 325 : 275;
              const centerY = isMobile ? 144 : isTablet ? 225 : isDesktop ? 325 : 275;
              const radius = isMobile ? 110 : isTablet ? 170 : isDesktop ? 210 : 190;
              const radian = (node.angle * Math.PI) / 180;
              const x = centerX + radius * Math.cos(radian);
              const y = centerY + radius * Math.sin(radian);
              
              return (
                <line
                  key={node.id}
                  x1={centerX}
                  y1={centerY}
                  x2={x}
                  y2={y}
                  stroke="url(#lineGradient)"
                  strokeWidth="2"
                  className="connection-line"
                  style={{
                    animationDelay: `${node.id * 0.3}s`,
                    opacity: hoveredNode === node.id ? 1 : 0.4
                  }}
                />
              );
            })}
            <defs>
              <linearGradient id="lineGradient">
                <stop offset="0%" stopColor="rgba(59, 130, 246, 0.8)" />
                <stop offset="100%" stopColor="rgba(147, 197, 253, 0.3)" />
              </linearGradient>
            </defs>
          </svg>

          {/* Central WeatherWise Node */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="central-node relative w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center cursor-pointer group">
              <div className="node-text font-bold text-xs sm:text-base md:text-lg lg:text-xl text-center leading-tight">
                Weather
                <br />
                Wise
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full"></div>
            </div>
          </div>

          {/* Branch Nodes */}
          {treeNodes.map((node) => {
            // Responsive center and radius calculations
            const isMobile = window.innerWidth < 640;
            const isTablet = window.innerWidth >= 640 && window.innerWidth < 1024;
            const isDesktop = window.innerWidth >= 1024;
            
            const centerX = isMobile ? 144 : isTablet ? 225 : isDesktop ? 325 : 275;
            const centerY = isMobile ? 144 : isTablet ? 225 : isDesktop ? 325 : 275;
            const radius = isMobile ? 110 : isTablet ? 170 : isDesktop ? 210 : 190;
            const radian = (node.angle * Math.PI) / 180;
            const x = centerX + radius * Math.cos(radian);
            const y = centerY + radius * Math.sin(radian);
            
            return (
              <div
                key={node.id}
                className={`absolute tree-node ${showNodes ? 'visible' : ''}`}
                style={{
                  left: `${x}px`,
                  top: `${y}px`,
                  transitionDelay: `${node.id * 300}ms`
                }}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <div className={`relative w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-gradient-to-br ${node.color} rounded-full flex items-center justify-center cursor-pointer shadow-lg group`}>
                  <div className="node-text font-semibold text-[10px] sm:text-xs md:text-sm lg:text-base text-center leading-tight px-1">
                    {node.question.split(' ')[0]}
                    <br />
                    {node.question.split(' ')[1]}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-full group-hover:from-white/40"></div>
                </div>
                
                {/* Hover Tooltip */}
                {hoveredNode === node.id && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 sm:mb-4 w-48 xs:w-56 sm:w-64 md:w-72 p-3 sm:p-4 bg-black/80 backdrop-blur-md border border-white/20 rounded-xl text-white text-xs sm:text-sm z-50">
                    <h3 className="font-bold mb-1 sm:mb-2 text-sm sm:text-base">{node.question}</h3>
                    <p className="text-white/80 leading-relaxed">{node.description}</p>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/80"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Call to Action - All 3 buttons aligned properly */}
        <div className="mt-2 sm:mt-3 text-center px-4">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4">
            <button
              onClick={() => navigate("/plan")}
              className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold rounded-full transition-all transform hover:scale-105 shadow-lg shadow-blue-500/30 text-sm min-w-[140px] justify-center"
            >
              Start Your Journey
              <Sparkles className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => navigate("/compare")}
              className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-purple-600 to-violet-700 text-white font-semibold rounded-full transition-all transform hover:scale-105 shadow-lg shadow-purple-500/30 text-sm min-w-[140px] justify-center"
            >
              Compare
              <Sparkles className="w-4 h-4" />
            </button>
            
            <div className="inline-flex min-w-[140px] justify-center">
              <MikeButton />
            </div>
          </div>
        </div>

        {/* Removed the hiking/beach/stargazing preset buttons as requested. */}

        {/* Floating Celsius Temperature Animations */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {["18°C", "22°C", "15°C", "25°C", "20°C", "12°C"].map((temp, index) => (
            <div
              key={index}
              className="absolute temp-animation text-blue-300 font-bold text-sm opacity-60"
              style={{
                left: `${15 + (index * 15)}%`,
                top: `${20 + (index * 12)}%`,
                animationDelay: `${index * 1.2}s`,
                animationDuration: `${5 + (index * 0.5)}s`
              }}
            >
              {temp}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}