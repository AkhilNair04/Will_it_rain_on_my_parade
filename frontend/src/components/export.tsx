import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Settings,
  FileText,
  Download,
  Code,
  MessageCircle,
  Copy,
} from "lucide-react";

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

export default function ExportShare() {
  const [searchParams] = useSearchParams();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [forecastDate, setForecastDate] = useState<string>("");

  useEffect(() => {
    // Extract data from URL parameters
    const weatherDataParam = searchParams.get("weatherData");
    const locationDataParam = searchParams.get("location");
    const dateParam = searchParams.get("date");

    if (weatherDataParam) {
      try {
        const parsedWeatherData = JSON.parse(weatherDataParam);
        setWeatherData(parsedWeatherData);
      } catch (error) {
        console.error("Error parsing weather data:", error);
      }
    }

    if (locationDataParam) {
      try {
        const parsedLocationData = JSON.parse(locationDataParam);
        setLocationData(parsedLocationData);
      } catch (error) {
        console.error("Error parsing location data:", error);
      }
    }

    if (dateParam) {
      setForecastDate(dateParam);
    }
  }, [searchParams]);

  // Export functions
  const exportToPDF = () => {
    const location =
      weatherData?.input_location?.name || locationData?.city || "N/A";
    const coordinates = `${(
      weatherData?.input_location?.latitude ||
      locationData?.latitude ||
      0
    ).toFixed(4)}, ${(
      weatherData?.input_location?.longitude ||
      locationData?.longitude ||
      0
    ).toFixed(4)}`;
    const forecastDateDisplay =
      weatherData?.input_location?.forecast_date || forecastDate || "N/A";
    const currentDate = new Date().toLocaleDateString();

    const professionalReport = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Weather Analysis Report</title>
        <style>
          @media print {
            body { 
              margin: 0; 
              padding: 0; 
              font-size: 12px;
              line-height: 1.3;
            }
            .no-print { display: none !important; }
            .page-break { page-break-after: always; }
            .report-container {
              max-width: none;
              width: 100%;
              box-shadow: none;
              border-radius: 0;
            }
            .header {
              padding: 15px !important;
            }
            .info-card {
              padding: 12px !important;
            }
            .highlight-card, .prediction-summary {
              margin: 8px !important;
              padding: 12px !important;
            }
          }
          
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.4;
            color: #333;
            margin: 0;
            padding: 15px;
            background: #f8f9fa;
            font-size: 13px;
          }
          
          .report-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
            border-radius: 8px;
            overflow: hidden;
          }
          
          .header {
            background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
            color: white;
            padding: 20px;
            text-align: center;
            position: relative;
          }
          
          .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)" /></svg>');
          }
          
          .header-content {
            position: relative;
            z-index: 1;
          }
          
          .header h1 {
            margin: 0 0 5px 0;
            font-size: 1.8em;
            font-weight: 300;
            letter-spacing: -1px;
          }
          
          .header .subtitle {
            opacity: 0.9;
            font-size: 0.95em;
            margin-bottom: 10px;
          }
          
          .header .meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 10px;
            padding-top: 10px;
            border-top: 1px solid rgba(255,255,255,0.2);
            font-size: 0.9em;
          }
          
          .content {
            padding: 0;
          }
          
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0;
          }
          
          .info-card {
            padding: 15px;
            border-bottom: 1px solid #e5e7eb;
            position: relative;
          }
          
          .info-card:nth-child(odd) {
            border-right: 1px solid #e5e7eb;
            background: #f8fafc;
          }
          
          .info-card h3 {
            margin: 0 0 8px 0;
            color: #1e40af;
            font-size: 1em;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 6px;
          }
          
          .info-card .icon {
            width: 16px;
            height: 16px;
            background: #3b82f6;
            border-radius: 3px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 10px;
          }
          
          .data-row {
            display: flex;
            justify-content: space-between;
            padding: 4px 0;
            border-bottom: 1px solid #f1f5f9;
            font-size: 0.9em;
          }
          
          .data-row:last-child {
            border-bottom: none;
          }
          
          .data-label {
            font-weight: 500;
            color: #64748b;
          }
          
          .data-value {
            font-weight: 600;
            color: #0f172a;
          }
          
          .highlight-card {
            grid-column: 1 / -1;
            background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
            border: 2px solid #0369a1;
            border-radius: 6px;
            margin: 10px;
            padding: 15px;
          }
          
          .highlight-card h3 {
            color: #0369a1;
            margin-top: 0;
            margin-bottom: 8px;
            font-size: 1em;
          }
          
          .prediction-summary {
            background: #fefce8;
            border: 2px solid #eab308;
            border-radius: 6px;
            padding: 12px;
            margin: 10px;
            grid-column: 1 / -1;
          }
          
          .prediction-summary h3 {
            color: #a16207;
            margin-top: 0;
            margin-bottom: 6px;
            font-size: 1em;
          }
          
          .coefficients-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 5px;
            font-size: 0.85em;
          }
          
          .coefficients-table th,
          .coefficients-table td {
            padding: 4px 8px;
            text-align: left;
            border-bottom: 1px solid #e5e7eb;
          }
          
          .coefficients-table th {
            background: #f8fafc;
            font-weight: 600;
            color: #374151;
          }
          
          .footer {
            background: #1f2937;
            color: white;
            padding: 12px;
            text-align: center;
            font-size: 0.8em;
          }
          
          .footer .branding {
            opacity: 0.8;
          }
          
          @media (max-width: 600px) {
            .info-grid {
              grid-template-columns: 1fr;
            }
            .info-card:nth-child(odd) {
              border-right: none;
            }
            .header .meta {
              flex-direction: column;
              gap: 10px;
            }
          }
        </style>
      </head>
      <body>
        <div class="report-container">
          <div class="header">
            <div class="header-content">
              <h1>Weather Analysis Report</h1>
              <div class="subtitle">NASA-Powered Weather Prediction & Analysis</div>
              <div class="meta">
                <div>📍 ${location}</div>
                <div>📅 Generated: ${currentDate}</div>
              </div>
            </div>
          </div>
          
          <div class="content">
            <div class="info-grid">
              <div class="info-card">
                <h3><span class="icon">📍</span>Location Details</h3>
                <div class="data-row">
                  <span class="data-label">Location</span>
                  <span class="data-value">${location}</span>
                </div>
                <div class="data-row">
                  <span class="data-label">Coordinates</span>
                  <span class="data-value">${coordinates}</span>
                </div>
                <div class="data-row">
                  <span class="data-label">Forecast Date</span>
                  <span class="data-value">${forecastDateDisplay}</span>
                </div>
              </div>
              
              <div class="info-card">
                <h3><span class="icon">🌡️</span>Current Conditions</h3>
                <div class="data-row">
                  <span class="data-label">Max Temperature</span>
                  <span class="data-value">${
                    weatherData?.live_forecast_values?.temperature_max_celsius?.toFixed(
                      1
                    ) || "N/A"
                  }°C</span>
                </div>
                <div class="data-row">
                  <span class="data-label">Humidity</span>
                  <span class="data-value">${
                    weatherData?.live_forecast_values?.humidity_percent || "N/A"
                  }%</span>
                </div>
                <div class="data-row">
                  <span class="data-label">Wind Speed</span>
                  <span class="data-value">${
                    weatherData?.live_forecast_values?.wind_speed_mps?.toFixed(
                      1
                    ) || "N/A"
                  } m/s</span>
                </div>
                <div class="data-row">
                  <span class="data-label">Precipitation Probability</span>
                  <span class="data-value">${
                    weatherData?.live_forecast_values?.api_pop_percent || "N/A"
                  }%</span>
                </div>
              </div>
              
              <div class="highlight-card">
                <h3>🌧️ Weather Prediction Results</h3>
                <div class="info-grid" style="gap: 15px; margin-top: 15px;">
                  <div class="data-row">
                    <span class="data-label">Predicted Rainfall</span>
                    <span class="data-value" style="color: #0369a1; font-size: 1.2em;">${
                      weatherData?.prediction_output?.predicted_rainfall_mm?.toFixed(
                        2
                      ) || "N/A"
                    } mm</span>
                  </div>
                  <div class="data-row">
                    <span class="data-label">Temperature Outlook</span>
                    <span class="data-value">${
                      weatherData?.prediction_output?.temperature_outlook ||
                      "N/A"
                    }</span>
                  </div>
                  <div class="data-row">
                    <span class="data-label">Wind Outlook</span>
                    <span class="data-value">${
                      weatherData?.prediction_output?.wind_outlook || "N/A"
                    }</span>
                  </div>
                  <div class="data-row">
                    <span class="data-label">Rain Outlook</span>
                    <span class="data-value">${
                      weatherData?.prediction_output?.rain_outlook || "N/A"
                    }</span>
                  </div>
                  <div class="data-row">
                    <span class="data-label">Erosion Risk</span>
                    <span class="data-value">${
                      weatherData?.prediction_output?.erosion_risk || "N/A"
                    }</span>
                  </div>
                </div>
              </div>
              
              <div class="info-card">
                <h3><span class="icon">🔬</span>Model Information</h3>
                <div class="data-row">
                  <span class="data-label">Data Source</span>
                  <span class="data-value">${
                    weatherData?.model_details?.training_data_source ||
                    "NASA POWER"
                  }</span>
                </div>
                <div class="data-row">
                  <span class="data-label">Historical Range</span>
                  <span class="data-value">${
                    weatherData?.model_details?.historical_data_range_years || 5
                  } years</span>
                </div>
                <div class="data-row">
                  <span class="data-label">Model Type</span>
                  <span class="data-value">${
                    weatherData?.model_details?.model_type || "Ridge Regression"
                  }</span>
                </div>
                <div class="data-row">
                  <span class="data-label">Intercept</span>
                  <span class="data-value">${
                    weatherData?.model_details?.intercept?.toFixed(3) || "N/A"
                  }</span>
                </div>
              </div>
              
              <div class="info-card">
                <h3><span class="icon">📊</span>Model Coefficients</h3>
                ${
                  weatherData?.model_details?.coefficients
                    ? `
                  <table class="coefficients-table">
                    <thead>
                      <tr>
                        <th>Parameter</th>
                        <th>Coefficient</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${Object.entries(weatherData.model_details.coefficients)
                        .map(
                          ([key, value]) => `
                          <tr>
                            <td>${key}</td>
                            <td>${
                              typeof value === "number"
                                ? value.toFixed(3)
                                : value
                            }</td>
                          </tr>
                        `
                        )
                        .join("")}
                    </tbody>
                  </table>
                `
                    : `
                  <div class="data-row">
                    <span class="data-value">No coefficient data available</span>
                  </div>
                `
                }
              </div>
              
              <div class="prediction-summary">
                <h3>📝 Analysis Summary</h3>
                <p style="margin: 0; line-height: 1.3; color: #92400e; font-size: 0.9em;">
                  ${
                    weatherData?.prediction_output?.final_summary ||
                    "Weather prediction analysis is being processed..."
                  }
                </p>
              </div>
            </div>
          </div>
          
          <div class="footer">
            <div class="branding">
              <strong>WeatherWise</strong> - Powered by NASA POWER Project Data<br>
              Advanced Weather Prediction & Risk Assessment System
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(professionalReport);
      printWindow.document.close();
      printWindow.print();
    }
    console.log("📄 [PDF] Professional weather report sent to print");
  };

  const exportToCSV = () => {
    const csvData = [
      ["Field", "Value"],
      [
        "Location",
        weatherData?.input_location?.name || locationData?.city || "N/A",
      ],
      [
        "Latitude",
        (
          weatherData?.input_location?.latitude ||
          locationData?.latitude ||
          0
        ).toString(),
      ],
      [
        "Longitude",
        (
          weatherData?.input_location?.longitude ||
          locationData?.longitude ||
          0
        ).toString(),
      ],
      [
        "Forecast Date",
        weatherData?.input_location?.forecast_date || forecastDate || "N/A",
      ],
      [
        "Predicted Rainfall (mm)",
        (weatherData?.prediction_output?.predicted_rainfall_mm || 0).toString(),
      ],
      [
        "Max Temperature (°C)",
        (
          weatherData?.live_forecast_values?.temperature_max_celsius || 0
        ).toString(),
      ],
      [
        "Humidity (%)",
        (weatherData?.live_forecast_values?.humidity_percent || 0).toString(),
      ],
      [
        "Wind Speed (m/s)",
        (weatherData?.live_forecast_values?.wind_speed_mps || 0).toString(),
      ],
      [
        "Precipitation Probability (%)",
        (weatherData?.live_forecast_values?.api_pop_percent || 0).toString(),
      ],
      [
        "Temperature Outlook",
        weatherData?.prediction_output?.temperature_outlook || "N/A",
      ],
      ["Wind Outlook", weatherData?.prediction_output?.wind_outlook || "N/A"],
      ["Rain Outlook", weatherData?.prediction_output?.rain_outlook || "N/A"],
      ["Erosion Risk", weatherData?.prediction_output?.erosion_risk || "N/A"],
      ["Model Type", weatherData?.model_details?.model_type || "N/A"],
      [
        "Data Source",
        weatherData?.model_details?.training_data_source || "N/A",
      ],
      [
        "Historical Range (years)",
        (
          weatherData?.model_details?.historical_data_range_years || 0
        ).toString(),
      ],
      ["Summary", weatherData?.prediction_output?.final_summary || "N/A"],
    ];

    const csvContent = csvData
      .map((row) =>
        row.map((field) => `"${field.replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    downloadFile(csvContent, "text/csv", "weather-report.csv");
    console.log("📊 [CSV] Weather data exported to CSV");
  };

  const exportToText = () => {
    const reportContent = generateReportContent();
    downloadFile(reportContent, "text/plain", "weather-report.txt");
    console.log("📄 [TEXT] Weather report exported to text file");
  };

  const generateReportContent = () => {
    return `WEATHER ANALYSIS REPORT
======================

Generated: ${new Date().toLocaleString()}

LOCATION INFORMATION
-------------------
Location: ${weatherData?.input_location?.name || locationData?.city || "N/A"}
Coordinates: ${(
      weatherData?.input_location?.latitude ||
      locationData?.latitude ||
      0
    ).toFixed(4)}, ${(
      weatherData?.input_location?.longitude ||
      locationData?.longitude ||
      0
    ).toFixed(4)}
Forecast Date: ${
      weatherData?.input_location?.forecast_date || forecastDate || "N/A"
    }

MODEL DETAILS
-------------
Data Source: ${
      weatherData?.model_details?.training_data_source || "NASA POWER Project"
    }
Historical Range: ${
      weatherData?.model_details?.historical_data_range_years || 5
    } years
Model Type: ${
      weatherData?.model_details?.model_type || "Statistical Ridge Regression"
    }
Intercept: ${weatherData?.model_details?.intercept?.toFixed(3) || "N/A"}

Model Coefficients:
${
  weatherData?.model_details?.coefficients
    ? Object.entries(weatherData.model_details.coefficients)
        .map(
          ([key, value]) =>
            `  ${key}: ${typeof value === "number" ? value.toFixed(3) : value}`
        )
        .join("\n")
    : "No coefficient data available"
}

Description: ${
      weatherData?.model_details?.description ||
      "Uses historical weather patterns and statistical relationships for rainfall prediction"
    }

CURRENT WEATHER CONDITIONS
-------------------------
Max Temperature: ${
      weatherData?.live_forecast_values?.temperature_max_celsius?.toFixed(1) ||
      "N/A"
    }°C
Humidity: ${weatherData?.live_forecast_values?.humidity_percent || "N/A"}%
Wind Speed: ${
      weatherData?.live_forecast_values?.wind_speed_mps?.toFixed(1) || "N/A"
    } m/s
Precipitation Probability: ${
      weatherData?.live_forecast_values?.api_pop_percent || "N/A"
    }%

WEATHER PREDICTION
-----------------
Predicted Rainfall: ${
      weatherData?.prediction_output?.predicted_rainfall_mm?.toFixed(2) || "N/A"
    } mm
Temperature Outlook: ${
      weatherData?.prediction_output?.temperature_outlook || "N/A"
    }
Wind Outlook: ${weatherData?.prediction_output?.wind_outlook || "N/A"}
Rain Outlook: ${weatherData?.prediction_output?.rain_outlook || "N/A"}
Erosion Risk: ${weatherData?.prediction_output?.erosion_risk || "N/A"}

SUMMARY
-------
${
  weatherData?.prediction_output?.final_summary ||
  "Weather prediction analysis is being processed..."
}

---
Report generated by WeatherWise - NASA-powered weather prediction`;
  };

  const downloadFile = (
    content: string,
    mimeType: string,
    filename: string
  ) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // WhatsApp weather card sharing function
  const generateWeatherCard = () => {
    const location =
      weatherData?.input_location?.name ||
      locationData?.city ||
      "Unknown Location";
    const date =
      weatherData?.input_location?.forecast_date || forecastDate || "Today";
    const temperature =
      weatherData?.live_forecast_values?.temperature_max_celsius?.toFixed(1) ||
      "N/A";
    const rainfall =
      weatherData?.prediction_output?.predicted_rainfall_mm?.toFixed(1) ||
      "N/A";
    const humidity =
      weatherData?.live_forecast_values?.humidity_percent || "N/A";
    const windSpeed =
      weatherData?.live_forecast_values?.wind_speed_mps?.toFixed(1) || "N/A";
    const rainChance =
      weatherData?.live_forecast_values?.api_pop_percent || "N/A";
    const tempOutlook =
      weatherData?.prediction_output?.temperature_outlook || "N/A";
    const windOutlook = weatherData?.prediction_output?.wind_outlook || "N/A";
    const rainOutlook = weatherData?.prediction_output?.rain_outlook || "N/A";
    const erosionRisk = weatherData?.prediction_output?.erosion_risk || "N/A";
    const summary =
      weatherData?.prediction_output?.final_summary ||
      "Weather prediction powered by NASA data";

    return (
      `🌤️ *WEATHER FORECAST CARD* 🌤️\n` +
      `═══════════════════════════════\n\n` +
      `📍 *Location:* ${location}\n` +
      `📅 *Date:* ${date}\n\n` +
      `🌡️ *CURRENT CONDITIONS*\n` +
      `├─ Temperature: ${temperature}°C\n` +
      `├─ Humidity: ${humidity}%\n` +
      `├─ Wind Speed: ${windSpeed} m/s\n` +
      `└─ Rain Chance: ${rainChance}%\n\n` +
      `💧 *RAINFALL PREDICTION*\n` +
      `└─ Expected: ${rainfall}mm\n\n` +
      `🔮 *WEATHER OUTLOOK*\n` +
      `├─ Temperature: ${tempOutlook}\n` +
      `├─ Wind: ${windOutlook}\n` +
      `├─ Rain: ${rainOutlook}\n` +
      `└─ Erosion Risk: ${erosionRisk}\n\n` +
      `📋 *SUMMARY*\n` +
      `${summary}\n\n` +
      `═══════════════════════════════\n` +
      `🚀 *Powered by WeatherWise*\n` +
      `�️ NASA-grade weather predictions\n` +
      `#WeatherWise #WeatherForecast #NASA`
    );
  };

  const shareToWhatsApp = () => {
    const weatherCard = generateWeatherCard();
    const url = `https://wa.me/?text=${encodeURIComponent(weatherCard)}`;
    window.open(url, "_blank");
    console.log("� [WHATSAPP] Opening WhatsApp share with weather card");
  };

  const copyWeatherCard = async () => {
    const weatherCard = generateWeatherCard();
    try {
      await navigator.clipboard.writeText(weatherCard);
      alert("Weather forecast card copied to clipboard!");
      console.log("📋 [CLIPBOARD] Weather forecast card copied to clipboard");
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = weatherCard;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      alert("Weather forecast card copied to clipboard!");
    }
  };

  // Add dark background to body
  React.useEffect(() => {
    document.body.style.backgroundColor = "#0f172a";
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 text-center">
      {/* Header */}
      <header className=" rounded-2xl p-4 mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <div className="w-6 h-6 bg-blue-400 rounded"></div>
          </div>
          <span className="text-xl font-bold">WeatherWise</span>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto">
        {/* Title Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-3">Export & Share</h1>
          <p className="text-gray-400 text-lg">
            Download your weather insights or share them on social media.
          </p>
        </div>

        {/* Export Options */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Export Options</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {/* PDF Report */}
            <button
              onClick={exportToPDF}
              className="bg-slate-800/50 hover:bg-slate-800 transition-all rounded-xl p-6 flex flex-col items-center gap-3 group"
            >
              <div className="w-16 h-16 bg-slate-700/50 rounded-xl flex items-center justify-center group-hover:bg-slate-700 transition-colors">
                <FileText className="w-8 h-8 text-blue-400" />
              </div>
              <span className="font-semibold">Export PDF</span>
            </button>

            {/* Download CSV */}
            <button
              onClick={exportToCSV}
              className="bg-slate-800/50 hover:bg-slate-800 transition-all rounded-xl p-6 flex flex-col items-center gap-3 group"
            >
              <div className="w-16 h-16 bg-slate-700/50 rounded-xl flex items-center justify-center group-hover:bg-slate-700 transition-colors">
                <Download className="w-8 h-8 text-green-400" />
              </div>
              <span className="font-semibold">Export CSV</span>
            </button>

            {/* Download Text */}
            <button
              onClick={exportToText}
              className="bg-slate-800/50 hover:bg-slate-800 transition-all rounded-xl p-6 flex flex-col items-center gap-3 group"
            >
              <div className="w-16 h-16 bg-slate-700/50 rounded-xl flex items-center justify-center group-hover:bg-slate-700 transition-colors">
                <Code className="w-8 h-8 text-purple-400" />
              </div>
              <span className="font-semibold">Export Text</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
