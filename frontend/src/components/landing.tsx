import { Cloud, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MikeButton } from "./MikeButton";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-900 to-black text-white">
      {/* Background visuals could live here (stars/clouds) */}

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        {/* Logo */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Cloud className="text-white w-7 h-7 sm:w-8 sm:h-8" />
          </div>
          <h1 className="text-5xl sm:text-7xl font-bold text-white tracking-wide">
            WeatherWise
          </h1>
        </div>

        <p className="text-gray-300 text-lg sm:text-xl mb-10">
          Predict the Perfect Day — Powered by NASA’s Weather Intelligence.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-6 mb-6">
          <button
            onClick={() => navigate("/plan")}
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

        {/* Removed the hiking/beach/stargazing preset buttons as requested. */}

        {/* MikeButton placed below the CTA buttons */}
        <div className="mt-4">
          <MikeButton />
        </div>
      </div>
    </div>
  );
}
