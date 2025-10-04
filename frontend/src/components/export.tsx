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
    const reportContent = generateReportContent();
    const element = document.createElement("div");
    element.innerHTML = `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 800px;">
        <h1 style="color: #1e40af; margin-bottom: 20px;">Weather Analysis Report</h1>
        <pre style="white-space: pre-wrap; font-family: Arial, sans-serif; line-height: 1.6;">${reportContent}</pre>
      </div>
    `;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(element.innerHTML);
      printWindow.document.close();
      printWindow.print();
    }
    console.log("📄 [PDF] Report sent to print for PDF generation");
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
