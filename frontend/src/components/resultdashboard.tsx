import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Share2 } from "lucide-react";

interface WeatherData {
  input_location?: {
    name?: string;
    latitude?: number;
    longitude?: number;
    forecast_date?: string;
  };
  model_details?: {
    training_data_source?: string;
    historical_data_range_years?: number;
    model_type?: string;
    coefficients?: Record<string, number>;
    intercept?: number;
    description?: string;
  };
  live_forecast_values?: {
    temperature_max_celsius?: number;
    humidity_percent?: number;
    wind_speed_mps?: number;
    api_pop_percent?: number;
  };
  prediction_output?: {
    predicted_rainfall_mm?: number;
    temperature_outlook?: string;
    wind_outlook?: string;
    rain_outlook?: string;
    erosion_risk?: string;
    final_summary?: string;
  };
}

interface LocationData {
  city: string;
  latitude: number;
  longitude: number;
}

export default function WeatherDashboard() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [forecastDate, setForecastDate] = useState<string>("");

  useEffect(() => {
    // Extract data from URL parameters
    const weatherDataParam = searchParams.get("weatherData");
    const locationDataParam = searchParams.get("location");
    const dateParam = searchParams.get("date");

    console.log("📊 [DASHBOARD] Loading data from URL parameters");

    if (weatherDataParam) {
      try {
        const parsedWeatherData = JSON.parse(weatherDataParam);
        setWeatherData(parsedWeatherData);
        console.log("✅ [DASHBOARD] Weather data loaded:", parsedWeatherData);
      } catch (error) {
        console.error("❌ [DASHBOARD] Error parsing weather data:", error);
      }
    }

    if (locationDataParam) {
      try {
        const parsedLocationData = JSON.parse(locationDataParam);
        setLocationData(parsedLocationData);
        console.log("✅ [DASHBOARD] Location data loaded:", parsedLocationData);
      } catch (error) {
        console.error("❌ [DASHBOARD] Error parsing location data:", error);
      }
    }

    if (dateParam) {
      setForecastDate(dateParam);
      console.log("✅ [DASHBOARD] Forecast date loaded:", dateParam);
    }
  }, [searchParams]);

  // Function to handle export and share navigation
  const handleExportShare = () => {
    // Pass current weather data to export page via URL parameters
    const queryParams = new URLSearchParams({
      weatherData: JSON.stringify(weatherData),
      location: JSON.stringify(locationData),
      date: forecastDate,
    });

    navigate(`/export?${queryParams.toString()}`);
    console.log("🔗 [NAVIGATION] Redirecting to export page with weather data");
  };

  // Add dark background to body
  React.useEffect(() => {
    document.body.style.backgroundColor = "#0f172a";
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto ">
        {/* Dashboard Summary */}
        <div className="bg-slate-800/50 rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-2">Weather Forecast Results</h2>
          <p className="text-gray-400 mb-6">
            {locationData
              ? `Forecast for ${locationData.city} on ${forecastDate}`
              : "Weather prediction data"}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 justify-items-center">
            {/* Predicted Rainfall */}
            <div className="bg-slate-700/30 rounded-xl p-4 w-full">
              <p className="text-sm text-gray-400 mb-2">Rainfall</p>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-3xl font-bold text-blue-400">
                  {weatherData?.prediction_output?.predicted_rainfall_mm?.toFixed(
                    1
                  ) || "N/A"}
                </span>
                <span className="text-sm text-gray-400">mm</span>
              </div>
              <svg viewBox="0 0 100 30" className="w-full">
                <path
                  d="M 0,28 L 20,20 L 40,22 L 60,12 L 80,14 L 100,5"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="2"
                />
              </svg>
            </div>

            {/* Wind Speed */}
            <div className="bg-slate-700/30 rounded-xl p-4 w-full">
              <p className="text-sm text-gray-400 mb-2">Wind Speed</p>
              <div className="flex items-baseline gap-2 mb-3 font-semibold text-3xl">
                {weatherData?.live_forecast_values?.wind_speed_mps
                  ? (
                      weatherData.live_forecast_values.wind_speed_mps * 3.6
                    ).toFixed(1)
                  : "N/A"}
                <span className="text-lg text-gray-400">km/h</span>
              </div>
              <svg viewBox="0 0 100 30" className="w-full">
                <path
                  d="M 0,20 Q 20,15 40,18 Q 60,22 80,12 L 100,15"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2"
                />
              </svg>
            </div>

            {/* Temperature */}
            <div className="bg-slate-700/30 rounded-xl p-4 w-full">
              <p className="text-sm text-gray-400 mb-2">Avg.Temperature</p>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-3xl font-bold">
                  {weatherData?.live_forecast_values?.temperature_max_celsius}
                </span>
                <span className="text-lg text-gray-400">&deg;C</span>
              </div>
              <svg viewBox="0 0 100 30" className="w-full">
                <path
                  d="M 0,25 Q 20,20 40,15 Q 60,10 80,12 L 100,8"
                  fill="none"
                  stroke="#eab308"
                  strokeWidth="2"
                />
              </svg>
            </div>

            {/* Humidity */}
            <div className="bg-slate-700/30 rounded-xl p-4 w-full">
              <p className="text-sm text-gray-400 mb-2">Humidity</p>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-3xl font-bold">
                  {weatherData?.live_forecast_values?.humidity_percent}
                </span>
                <span className="text-lg text-gray-400">%</span>
              </div>
              <svg viewBox="0 0 100 30" className="w-full">
                <path
                  d="M 0,15 C 25,5 40,25 65,15 S 85,5 100,10"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>
        </div>
        {/* Weather Data Description */}
        <div className="mb-8 mt-8">
          <h1 className="text-3xl font-bold mb-2">Weather Analysis Report</h1>
          <p className="text-gray-400">
            Detailed breakdown of the weather prediction data and model
            analysis.
          </p>
        </div>

        {/* Prediction Output */}
        <div className="bg-slate-800/50 rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-4 text-yellow-400">
            Weather Prediction
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-300">
                Forecast Details
              </h3>
              <div className="space-y-3">
                <div className="bg-slate-700/30 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Predicted Rainfall:</span>
                    <span className="text-xl font-bold text-blue-400">
                      {weatherData?.prediction_output?.predicted_rainfall_mm?.toFixed(
                        1
                      ) || "N/A"}{" "}
                      mm
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-700/30 rounded-lg p-3 text-center">
                    <div className="text-orange-400 font-semibold">
                      {weatherData?.prediction_output?.temperature_outlook ||
                        "N/A"}
                    </div>
                    <div className="text-gray-400 text-xs">Temperature</div>
                  </div>

                  <div className="bg-slate-700/30 rounded-lg p-3 text-center">
                    <div className="text-cyan-400 font-semibold">
                      {weatherData?.prediction_output?.wind_outlook || "N/A"}
                    </div>
                    <div className="text-gray-400 text-xs">Wind</div>
                  </div>
                </div>

                <div className="bg-slate-700/30 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Rain Outlook:</span>
                    <span className="text-blue-400 font-semibold">
                      {weatherData?.prediction_output?.rain_outlook || "N/A"}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-700/30 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Erosion Risk:</span>
                    <span
                      className={`font-semibold ${
                        weatherData?.prediction_output?.erosion_risk?.toLowerCase() ===
                        "low"
                          ? "text-green-400"
                          : weatherData?.prediction_output?.erosion_risk?.toLowerCase() ===
                            "medium"
                          ? "text-yellow-400"
                          : "text-red-400"
                      }`}
                    >
                      {weatherData?.prediction_output?.erosion_risk || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-300">
                Summary
              </h3>
              <div className="bg-gradient-to-r from-slate-700/40 to-slate-600/40 rounded-lg p-4">
                <p className="text-gray-200 leading-relaxed">
                  {weatherData?.prediction_output?.final_summary ||
                    "Weather prediction analysis is being processed..."}
                </p>
              </div>

              <div className="mt-4 p-3 bg-slate-700/20 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-300 mb-2">
                  Location Information
                </h4>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Location:</span>
                    <span className="text-white">
                      {weatherData?.input_location?.name ||
                        locationData?.city ||
                        "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Coordinates:</span>
                    <span className="text-white">
                      {weatherData?.input_location?.latitude?.toFixed(4) ||
                        locationData?.latitude?.toFixed(4) ||
                        "N/A"}
                      ,{" "}
                      {weatherData?.input_location?.longitude?.toFixed(4) ||
                        locationData?.longitude?.toFixed(4) ||
                        "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Forecast Date:</span>
                    <span className="text-white">
                      {weatherData?.input_location?.forecast_date ||
                        forecastDate ||
                        "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Weather Data Sections */}
        <div className="space-y-6 mt-10">
          {/* Model Details */}
          <div className="bg-slate-800/50 rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-4 text-blue-400">
              Model Information
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-300">
                  Training Details
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Data Source:</span>
                    <span className="text-white">
                      {weatherData?.model_details?.training_data_source ||
                        "NASA POWER Project"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Historical Range:</span>
                    <span className="text-white">
                      {weatherData?.model_details
                        ?.historical_data_range_years || 20}{" "}
                      years
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Model Type:</span>
                    <span className="text-white">
                      {weatherData?.model_details?.model_type ||
                        "Statistical Ridge Regression"}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-300">
                  Model Coefficients
                </h3>
                <div className="space-y-2 text-sm">
                  {weatherData?.model_details?.coefficients ? (
                    Object.entries(weatherData.model_details.coefficients).map(
                      ([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-gray-400">{key}:</span>
                          <span className="text-white">
                            {typeof value === "number"
                              ? value.toFixed(3)
                              : String(value)}
                          </span>
                        </div>
                      )
                    )
                  ) : (
                    <div className="text-gray-400">
                      No coefficient data available
                    </div>
                  )}
                  <div className="flex justify-between border-t border-gray-600 pt-2">
                    <span className="text-gray-400">Intercept:</span>
                    <span className="text-white">
                      {weatherData?.model_details?.intercept?.toFixed(3) ||
                        "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-slate-700/30 rounded-lg">
              <p className="text-gray-300 text-sm">
                <strong>Model Description:</strong>{" "}
                {weatherData?.model_details?.description ||
                  "Uses historical weather patterns and statistical relationships for rainfall prediction"}
              </p>
            </div>
          </div>
        </div>

        {/* Export Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleExportShare}
            className="flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-green-600/30 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            <Share2 className="w-5 h-5" />
            Export & Share
          </button>
        </div>
      </div>
    </div>
  );
}
