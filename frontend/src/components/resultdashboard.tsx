import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

interface WeatherData {
  prediction_output?: {
    predicted_rainfall_mm?: number;
    confidence_score?: number;
  };
  nasa_data?: any;
  openweather_data?: any;
  live_forecast_values?: {
    wind_speed_mps?: number;
    temperature_max_celsius?: number;
    humidity_percent?: number;
  };
}

interface LocationData {
  city: string;
  latitude: number;
  longitude: number;
}

export default function WeatherDashboard() {
  const [activeView, setActiveView] = useState("graph");
  const [searchParams] = useSearchParams();
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

  // Add dark background to body
  React.useEffect(() => {
    document.body.style.backgroundColor = "#0f172a";
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);

  // Sample data for charts
  const tempData = [18, 17, 19, 22, 25, 26, 25, 24, 23, 21, 20, 19];
  const humidityData = [85, 82, 88, 92, 90, 87, 85, 80, 75, 78, 83, 88];
  const windData = [12, 14, 15, 18, 22, 20, 18, 16, 14];
  const precipData = [0, 0, 0, 5, 9, 2, 1, 0, 8];

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

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
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Detailed Climate View: New York
          </h1>
          <p className="text-gray-400">
            Comprehensive climate data for your selected location.
          </p>
        </div>

        {/* Top Charts Grid - Temperature & Humidity */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Temperature Chart */}
          <div className="bg-slate-800/50 rounded-2xl p-6">
            <div className="mb-4">
              <div className="flex gap-4 mb-4">
                <button className="text-blue-400 font-semibold border-b-2 border-blue-400 pb-1">
                  Daily
                </button>
                <button className="text-gray-400 hover:text-gray-300">
                  Weekly
                </button>
                <button className="text-gray-400 hover:text-gray-300">
                  Monthly
                </button>
              </div>
              <h3 className="text-lg font-semibold text-gray-300">
                Temperature (°C)
              </h3>
            </div>

            <svg viewBox="0 0 400 180" className="w-full">
              <defs>
                <linearGradient
                  id="tempGradient2"
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Grid */}
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <line
                  key={i}
                  x1="30"
                  y1={30 + i * 25}
                  x2="380"
                  y2={30 + i * 25}
                  stroke="#334155"
                  strokeWidth="0.5"
                />
              ))}

              {/* Y-axis labels */}
              <text x="15" y="35" fill="#94a3b8" fontSize="10">
                26
              </text>
              <text x="15" y="60" fill="#94a3b8" fontSize="10">
                24
              </text>
              <text x="15" y="85" fill="#94a3b8" fontSize="10">
                22
              </text>
              <text x="15" y="110" fill="#94a3b8" fontSize="10">
                20
              </text>
              <text x="15" y="135" fill="#94a3b8" fontSize="10">
                18
              </text>
              <text x="15" y="160" fill="#94a3b8" fontSize="10">
                16
              </text>

              {/* Area fill */}
              <path
                d={`M 30,${150 - (tempData[0] - 16) * 5} ${tempData
                  .map((t, i) => `L ${30 + i * 30},${150 - (t - 16) * 5}`)
                  .join(" ")} L ${
                  30 + (tempData.length - 1) * 30
                },150 L 30,150 Z`}
                fill="url(#tempGradient2)"
              />

              {/* Line */}
              <path
                d={`M 30,${150 - (tempData[0] - 16) * 5} ${tempData
                  .map((t, i) => `L ${30 + i * 30},${150 - (t - 16) * 5}`)
                  .join(" ")}`}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
              />

              {/* X-axis labels */}
              {["12am", "3am", "6am", "9am", "12pm", "3pm", "6pm", "9pm"].map(
                (label, i) => (
                  <text
                    key={i}
                    x={30 + i * 45}
                    y="175"
                    fill="#94a3b8"
                    fontSize="10"
                    textAnchor="middle"
                  >
                    {label}
                  </text>
                )
              )}
            </svg>
          </div>

          {/* Humidity Chart */}
          <div className="bg-slate-800/50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-300 mb-4">
              Humidity (%)
            </h3>

            <svg viewBox="0 0 400 180" className="w-full">
              <defs>
                <linearGradient
                  id="humidityGradient"
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Grid */}
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <line
                  key={i}
                  x1="30"
                  y1={30 + i * 25}
                  x2="380"
                  y2={30 + i * 25}
                  stroke="#334155"
                  strokeWidth="0.5"
                />
              ))}

              {/* Y-axis labels */}
              <text x="10" y="35" fill="#94a3b8" fontSize="10">
                100
              </text>
              <text x="15" y="60" fill="#94a3b8" fontSize="10">
                95
              </text>
              <text x="15" y="85" fill="#94a3b8" fontSize="10">
                90
              </text>
              <text x="15" y="110" fill="#94a3b8" fontSize="10">
                85
              </text>
              <text x="15" y="135" fill="#94a3b8" fontSize="10">
                80
              </text>
              <text x="15" y="160" fill="#94a3b8" fontSize="10">
                75
              </text>

              {/* Area fill */}
              <path
                d={`M 30,${180 - (humidityData[0] - 70) * 5} ${humidityData
                  .map((h, i) => `L ${30 + i * 30},${180 - (h - 70) * 5}`)
                  .join(" ")} L ${
                  30 + (humidityData.length - 1) * 30
                },150 L 30,150 Z`}
                fill="url(#humidityGradient)"
              />

              {/* Line */}
              <path
                d={`M 30,${180 - (humidityData[0] - 70) * 5} ${humidityData
                  .map((h, i) => `L ${30 + i * 30},${180 - (h - 70) * 5}`)
                  .join(" ")}`}
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="2"
              />

              {/* X-axis labels */}
              {["12am", "3am", "6am", "9am", "12pm", "3pm", "6pm", "9pm"].map(
                (label, i) => (
                  <text
                    key={i}
                    x={30 + i * 45}
                    y="175"
                    fill="#94a3b8"
                    fontSize="10"
                    textAnchor="middle"
                  >
                    {label}
                  </text>
                )
              )}
            </svg>
          </div>
        </div>

        {/* Bottom Charts Grid - Wind Speed & Precipitation */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Wind Speed Chart */}
          <div className="bg-slate-800/50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-300 mb-4">
              Wind Speed (km/h)
            </h3>

            <svg viewBox="0 0 400 180" className="w-full">
              {/* Grid */}
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <line
                  key={i}
                  x1="30"
                  y1={30 + i * 25}
                  x2="380"
                  y2={30 + i * 25}
                  stroke="#334155"
                  strokeWidth="0.5"
                />
              ))}

              {/* Y-axis labels */}
              <text x="15" y="35" fill="#94a3b8" fontSize="10">
                24
              </text>
              <text x="15" y="60" fill="#94a3b8" fontSize="10">
                20
              </text>
              <text x="15" y="85" fill="#94a3b8" fontSize="10">
                16
              </text>
              <text x="15" y="110" fill="#94a3b8" fontSize="10">
                12
              </text>
              <text x="15" y="135" fill="#94a3b8" fontSize="10">
                8
              </text>
              <text x="15" y="160" fill="#94a3b8" fontSize="10">
                4
              </text>

              {/* Bars */}
              {windData.map((speed, i) => (
                <rect
                  key={i}
                  x={50 + i * 35}
                  y={150 - speed * 5}
                  width="25"
                  height={speed * 5}
                  fill="#10b981"
                  rx="2"
                />
              ))}

              {/* X-axis labels */}
              {[
                "12am",
                "3am",
                "6am",
                "9am",
                "12pm",
                "3pm",
                "6pm",
                "9pm",
                "12am",
              ].map((label, i) => (
                <text
                  key={i}
                  x={55 + i * 35}
                  y="175"
                  fill="#94a3b8"
                  fontSize="10"
                  textAnchor="middle"
                >
                  {label}
                </text>
              ))}
            </svg>
          </div>

          {/* Precipitation Chart */}
          <div className="bg-slate-800/50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-300 mb-4">
              Precipitation (mm)
            </h3>

            <svg viewBox="0 0 400 180" className="w-full">
              {/* Grid */}
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <line
                  key={i}
                  x1="30"
                  y1={30 + i * 25}
                  x2="380"
                  y2={30 + i * 25}
                  stroke="#334155"
                  strokeWidth="0.5"
                />
              ))}

              {/* Y-axis labels */}
              <text x="15" y="35" fill="#94a3b8" fontSize="10">
                10
              </text>
              <text x="20" y="60" fill="#94a3b8" fontSize="10">
                9
              </text>
              <text x="20" y="85" fill="#94a3b8" fontSize="10">
                7
              </text>
              <text x="20" y="110" fill="#94a3b8" fontSize="10">
                5
              </text>
              <text x="20" y="135" fill="#94a3b8" fontSize="10">
                3
              </text>
              <text x="20" y="160" fill="#94a3b8" fontSize="10">
                1
              </text>

              {/* Bars */}
              {precipData.map((precip, i) => (
                <rect
                  key={i}
                  x={50 + i * 35}
                  y={150 - precip * 12}
                  width="25"
                  height={precip * 12}
                  fill="#3b82f6"
                  rx="2"
                />
              ))}

              {/* X-axis labels */}
              {[
                "12am",
                "3am",
                "6am",
                "9am",
                "12pm",
                "3pm",
                "6pm",
                "9pm",
                "12am",
              ].map((label, i) => (
                <text
                  key={i}
                  x={55 + i * 35}
                  y="175"
                  fill="#94a3b8"
                  fontSize="10"
                  textAnchor="middle"
                >
                  {label}
                </text>
              ))}
            </svg>
          </div>
        </div>

        {/* Compare Locations Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Compare Locations</h2>
          <p className="text-gray-400 mb-6">
            Visually compare climate data between two locations.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Temperature Comparison */}
            <div className="bg-slate-800/50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-300 mb-4">
                Temperature Comparison
              </h3>

              <div className="flex gap-4 mb-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span>New York</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded"></div>
                  <span>Japan</span>
                </div>
              </div>

              <svg viewBox="0 0 200 150" className="w-full">
                {/* Grid */}
                {[0, 1, 2, 3, 4].map((i) => (
                  <line
                    key={i}
                    x1="25"
                    y1={20 + i * 25}
                    x2="180"
                    y2={20 + i * 25}
                    stroke="#334155"
                    strokeWidth="0.5"
                  />
                ))}

                {/* Y-axis labels */}
                <text x="10" y="25" fill="#94a3b8" fontSize="9">
                  26
                </text>
                <text x="10" y="50" fill="#94a3b8" fontSize="9">
                  20
                </text>
                <text x="10" y="75" fill="#94a3b8" fontSize="9">
                  14
                </text>
                <text x="10" y="100" fill="#94a3b8" fontSize="9">
                  8
                </text>
                <text x="10" y="125" fill="#94a3b8" fontSize="9">
                  2
                </text>

                {/* New York line */}
                <path
                  d="M 30,110 Q 60,80 90,50 Q 120,30 150,40 Q 165,45 170,35"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                />

                {/* Japan line */}
                <path
                  d="M 30,120 Q 60,100 90,70 Q 120,45 150,55 Q 165,60 170,50"
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="2"
                />

                {/* X-axis labels */}
                {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((label, i) => (
                  <text
                    key={i}
                    x={30 + i * 28}
                    y="145"
                    fill="#94a3b8"
                    fontSize="9"
                    textAnchor="middle"
                  >
                    {label}
                  </text>
                ))}
              </svg>
            </div>

            {/* Rainfall Comparison */}
            <div className="bg-slate-800/50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-300 mb-4">
                Rainfall Comparison
              </h3>

              <div className="flex gap-4 mb-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span>New York</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded"></div>
                  <span>Japan</span>
                </div>
              </div>

              <svg viewBox="0 0 200 150" className="w-full">
                {/* Grid */}
                {[0, 1, 2, 3, 4].map((i) => (
                  <line
                    key={i}
                    x1="25"
                    y1={20 + i * 25}
                    x2="180"
                    y2={20 + i * 25}
                    stroke="#334155"
                    strokeWidth="0.5"
                  />
                ))}

                {/* Y-axis labels */}
                <text x="5" y="25" fill="#94a3b8" fontSize="9">
                  100
                </text>
                <text x="10" y="50" fill="#94a3b8" fontSize="9">
                  80
                </text>
                <text x="10" y="75" fill="#94a3b8" fontSize="9">
                  60
                </text>
                <text x="10" y="100" fill="#94a3b8" fontSize="9">
                  40
                </text>
                <text x="10" y="125" fill="#94a3b8" fontSize="9">
                  20
                </text>

                {/* Bars */}
                {[40, 50, 70, 90, 100, 85].map((val, i) => (
                  <g key={i}>
                    <rect
                      x={30 + i * 24}
                      y={120 - val * 0.9}
                      width="8"
                      height={val * 0.9}
                      fill="#f97316"
                      rx="1"
                    />
                    <rect
                      x={38 + i * 24}
                      y={120 - val * 0.7}
                      width="8"
                      height={val * 0.7}
                      fill="#3b82f6"
                      rx="1"
                    />
                  </g>
                ))}

                {/* X-axis labels */}
                {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((label, i) => (
                  <text
                    key={i}
                    x={34 + i * 24}
                    y="145"
                    fill="#94a3b8"
                    fontSize="9"
                    textAnchor="middle"
                  >
                    {label}
                  </text>
                ))}
              </svg>
            </div>

            {/* Comfort Index */}
            <div className="bg-slate-800/50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-300 mb-4">
                Comfort Index
              </h3>

              <div className="flex gap-4 mb-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span>New York</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded"></div>
                  <span>Japan</span>
                </div>
              </div>

              <svg viewBox="0 0 200 150" className="w-full">
                {/* Grid circles */}
                {[1, 0.8, 0.6, 0.4, 0.2].map((r, i) => (
                  <circle
                    key={i}
                    cx="100"
                    cy="75"
                    r={50 * r}
                    fill="none"
                    stroke="#334155"
                    strokeWidth="0.5"
                  />
                ))}

                {/* Radar chart - New York (blue) */}
                <path
                  d="M 100,30 L 135,50 L 140,85 L 120,110 L 75,110 L 60,75 Z"
                  fill="#3b82f6"
                  fillOpacity="0.3"
                  stroke="#3b82f6"
                  strokeWidth="2"
                />

                {/* Radar chart - Japan (orange) */}
                <path
                  d="M 100,45 L 125,60 L 130,80 L 115,100 L 85,100 L 70,80 Z"
                  fill="#f97316"
                  fillOpacity="0.3"
                  stroke="#f97316"
                  strokeWidth="2"
                />

                {/* Labels */}
                <text
                  x="100"
                  y="20"
                  fill="#94a3b8"
                  fontSize="9"
                  textAnchor="middle"
                >
                  Temp
                </text>
                <text x="145" y="50" fill="#94a3b8" fontSize="9">
                  Humidity
                </text>
                <text x="145" y="90" fill="#94a3b8" fontSize="9">
                  Wind
                </text>
                <text x="120" y="120" fill="#94a3b8" fontSize="9">
                  Sun
                </text>
                <text x="65" y="120" fill="#94a3b8" fontSize="9">
                  Precip
                </text>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
