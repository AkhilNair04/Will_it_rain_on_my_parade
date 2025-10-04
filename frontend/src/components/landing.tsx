import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Cloud, Sparkles } from "lucide-react";

// 🌤️ Site name idea: "SkyCast" — sleek, modern & easy to remember.

export default function SkyCastLanding() {
  const navigate = useNavigate();
  const [currentSky, setCurrentSky] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSky((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* BACKGROUND GRADIENT */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-black">
        {/* Dynamic Sky Glow */}
        <div
          className={`absolute inset-0 bg-gradient-radial transition-all duration-1000 ease-in-out opacity-40 ${
            currentSky === 0
              ? "from-blue-600/30 via-cyan-400/10 to-transparent"
              : currentSky === 1
              ? "from-purple-600/25 via-pink-400/10 to-transparent"
              : "from-yellow-600/20 via-orange-400/10 to-transparent"
          }`}
        />

        {/* ✨ Stars */}
        <div className="absolute inset-0">
          {[...Array(60)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full animate-twinkle"
              style={{
                width: `${Math.random() * 2 + 1}px`,
                height: `${Math.random() * 2 + 1}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        {/* ☁️ Moving Clouds */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-clouds blur-3xl opacity-30"
              style={{
                width: `${300 + Math.random() * 400}px`,
                height: `${150 + Math.random() * 100}px`,
                top: `${Math.random() * 80}%`,
                left: `${-500 + Math.random() * 100}px`,
                animationDuration: `${60 + Math.random() * 40}s`,
                animationDelay: `${Math.random() * 20}s`,
                background:
                  "radial-gradient(circle at 40% 40%, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 70%)",
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* 🌈 CSS ANIMATIONS */}
      <style>{`
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.3); }
        }
        .animate-twinkle {
          animation: twinkle 3s ease-in-out infinite;
        }

        /* ☁️ Smooth continuous drift */
        @keyframes clouds {
          0% { transform: translateX(-500px) scale(1); opacity: 0.3; }
          20% { opacity: 0.4; }
          50% { opacity: 0.5; transform: translateX(50vw) scale(1.05); }
          80% { opacity: 0.4; }
          100% { transform: translateX(120vw) scale(1); opacity: 0.3; }
        }
        .animate-clouds {
          animation: clouds linear infinite;
        }
      `}</style>

      {/* MAIN CONTENT */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        {/* Logo */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Cloud className="text-white w-7 h-7 sm:w-8 sm:h-8" />
          </div>
          <h1 className="text-5xl sm:text-7xl font-bold text-white tracking-wide">
            SkyCast
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-gray-300 text-lg sm:text-xl mb-10">
          Predict the Perfect Day — Powered by NASA’s Weather Intelligence.
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {["☀️ Hiking", "🏖️ Beach Day", "🌌 Stargazing"].map((act) => (
            <button
              key={act}
              className="px-6 py-3 bg-white/10 border border-white/20 rounded-full text-gray-200 hover:bg-white/20 transition-all"
            >
              {act}
            </button>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <button
            onClick={() => navigate("/compare")}
            className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold rounded-full transition-all transform hover:scale-105 shadow-lg shadow-blue-500/30"
          >
            Start Planning
            <Sparkles className="w-5 h-5" />
          </button>

          <button
            onClick={() => navigate("/compare")}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold rounded-full transition-all transform hover:scale-105 shadow-lg shadow-blue-500/30"
          >
            Compare
            <Sparkles className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
