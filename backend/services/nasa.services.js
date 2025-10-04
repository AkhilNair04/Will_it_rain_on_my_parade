import axios from "axios";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

class NasaDataService {
  async getHistoricalStats(lat, lon) {
    console.log("📡 [NASA SERVICE] Starting NASA data fetch");
    console.log("   - Coordinates: lat=", lat, ", lon=", lon);

    const apiKey = process.env.NASA_API_KEY;
    console.log(
      "🔑 [NASA SERVICE] API key check:",
      apiKey ? "Found" : "Not found"
    );
    if (!apiKey) {
      throw new Error("NASA API key not found in environment variables");
    }

    console.log("--- Step 1: Fetching Historical Data from NASA POWER ---");
    const parameters = "T2M_MAX,RH2M,PRECTOTCORR,WS2M,PS,GWETROOT";
    const endDate = new Date();
    const startDate = new Date();
    startDate.setFullYear(endDate.getFullYear() - 20);

    console.log("📅 [NASA SERVICE] Date range:");
    console.log("   - Start date:", startDate.toISOString().split("T")[0]);
    console.log("   - End date:", endDate.toISOString().split("T")[0]);

    const formatDate = (date) =>
      `${date.getFullYear()}${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}${String(date.getDate()).padStart(2, "0")}`;

    const nasaUrl = `https://power.larc.nasa.gov/api/temporal/daily/point?parameters=${parameters}&community=RE&longitude=${lon}&latitude=${lat}&start=${formatDate(
      startDate
    )}&end=${formatDate(endDate)}&format=JSON`;

    console.log("🌐 [NASA SERVICE] NASA API URL:", nasaUrl);

    try {
      console.log("🚀 [NASA SERVICE] Making API request...");
      const response = await axios.get(nasaUrl);

      console.log("✅ [NASA SERVICE] API response received");
      console.log("   - Response status:", response.status);
      console.log("   - Response data keys:", Object.keys(response.data));

      const params = response.data.properties.parameter;
      console.log(
        "📊 [NASA SERVICE] Available parameters:",
        Object.keys(params)
      );

      const rainfall = Object.values(params.PRECTOTCORR || {}).filter(
        (val) => val !== -999 && val != null
      );
      const soilWetness = Object.values(params.GWETROOT || {}).filter(
        (val) => val !== -999 && val != null
      );

      console.log("📊 [NASA SERVICE] Data filtering results:");
      console.log("   - Total rainfall data points:", rainfall.length);
      console.log("   - Total soil wetness data points:", soilWetness.length);
      console.log(
        "   - Sample rainfall values (first 5):",
        rainfall.slice(0, 5)
      );
      console.log(
        "   - Sample soil wetness values (first 5):",
        soilWetness.slice(0, 5)
      );

      const avgRainfall =
        rainfall.length > 0
          ? rainfall.reduce((a, b) => a + b, 0) / rainfall.length
          : 0;
      const avgSoilWetness =
        soilWetness.length > 0
          ? soilWetness.reduce((a, b) => a + b, 0) / soilWetness.length
          : 0.5;

      console.log("🎯 [NASA SERVICE] Calculated averages:");
      console.log("   - avgRainfall:", avgRainfall);
      console.log("   - avgSoilWetness:", avgSoilWetness);

      console.log("✅ Historical data processed successfully.");
      return { avgRainfall, avgSoilWetness };
    } catch (error) {
      console.error("❌ [NASA SERVICE] Error occurred:");
      console.error("   - Error message:", error.message);
      console.error("   - Error status:", error.response?.status);
      console.error("   - Error data:", error.response?.data);
      console.error("   - Full error:", error);

      console.log("⚠️ Using default historical values due to NASA API error.");
      const fallbackData = { avgRainfall: 2.5, avgSoilWetness: 0.5 };
      console.log("🔄 [NASA SERVICE] Fallback data:", fallbackData);
      return fallbackData;
    }
  }
}

export default new NasaDataService();
