import axios from "axios";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

class OpenWeatherMapService {
  async getCoordinates(city) {
    const apiKey = process.env.OPENWEATHERMAP_API_KEY;
    if (!apiKey) {
      throw new Error(
        "OpenWeatherMap API key not found in environment variables"
      );
    }
    console.log(`Geocoding city: ${city}`);
    const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
    const geoResponse = await axios.get(geoUrl);

    if (geoResponse.data.length === 0) {
      throw new Error(`City not found: ${city}`);
    }
    const { lat, lon } = geoResponse.data[0];
    console.log(`Geocoding successful: Lat=${lat}, Lon=${lon}`);
    return { lat, lon };
  }

  async getLiveForecast(lat, lon, start_hour, end_hour) {
    console.log(
      "\ud83c\udf24\ufe0f [OPENWEATHER SERVICE] Starting forecast fetch"
    );
    console.log("   - Coordinates: lat=", lat, ", lon=", lon);
    console.log("   - Time range:", start_hour, "-", end_hour);

    const apiKey = process.env.OPENWEATHERMAP_API_KEY;
    console.log(
      "\ud83d\udd11 [OPENWEATHER SERVICE] API key check:",
      apiKey ? "Found" : "Not found"
    );
    if (!apiKey) {
      throw new Error(
        "OpenWeatherMap API key not found in environment variables"
      );
    }

    console.log(
      `\n--- Step 2: Getting Live Forecast for range ${start_hour}:00 - ${end_hour}:00 ---`
    );
    const apiUrl = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    console.log("\ud83c\udf10 [OPENWEATHER SERVICE] API URL:", apiUrl);

    console.log("\ud83d\ude80 [OPENWEATHER SERVICE] Making API request...");
    const response = await axios.get(apiUrl);
    console.log("\u2705 [OPENWEATHER SERVICE] API response received");
    console.log("   - Response status:", response.status);
    console.log("   - Total forecast items:", response.data.list.length);

    const tomorrow = new Date();
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

    console.log(
      "\ud83d\udcc5 [OPENWEATHER SERVICE] Target date for filtering:"
    );
    console.log("   - Tomorrow date:", tomorrow.toISOString());
    console.log("   - Tomorrow UTC date:", tomorrow.getUTCDate());

    console.log("\ud83d\udd0d [OPENWEATHER SERVICE] All forecast times:");
    response.data.list.slice(0, 5).forEach((forecast, i) => {
      const forecastTime = new Date(forecast.dt_txt.replace(" ", "T") + "Z");
      console.log(
        `   - Item ${i}: ${
          forecast.dt_txt
        } -> UTC Date: ${forecastTime.getUTCDate()}, UTC Hour: ${forecastTime.getUTCHours()}`
      );
    });

    const selectedBlocks = response.data.list.filter((forecast) => {
      const forecastTime = new Date(forecast.dt_txt.replace(" ", "T") + "Z");
      const isCorrectDate = forecastTime.getUTCDate() === tomorrow.getUTCDate();
      const isCorrectHour =
        forecastTime.getUTCHours() >= start_hour &&
        forecastTime.getUTCHours() <= end_hour;

      if (isCorrectDate && isCorrectHour) {
        console.log(
          `   \u2705 Selected: ${
            forecast.dt_txt
          } (Hour: ${forecastTime.getUTCHours()})`
        );
      }

      return isCorrectDate && isCorrectHour;
    });

    console.log("\ud83d\udcca [OPENWEATHER SERVICE] Filtering results:");
    console.log("   - Total selected blocks:", selectedBlocks.length);

    if (selectedBlocks.length === 0) {
      console.error(
        "\u274c [OPENWEATHER SERVICE] No forecast blocks found in time range"
      );
      console.error("   - Target date:", tomorrow.getUTCDate());
      console.error("   - Target hour range:", start_hour, "-", end_hour);
      throw new Error(
        "Could not find any forecast blocks in the specified time range."
      );
    }

    console.log(
      "\ud83e\uddee [OPENWEATHER SERVICE] Calculating aggregated values from selected blocks..."
    );

    const temperatures = selectedBlocks.map((b) => b.main.temp_max);
    const humidities = selectedBlocks.map((b) => b.main.humidity);
    const windSpeeds = selectedBlocks.map((b) => b.wind.speed);
    const pressures = selectedBlocks.map((b) => b.main.pressure);
    const pops = selectedBlocks.map((b) => b.pop || 0);

    console.log("\ud83d\udcca [OPENWEATHER SERVICE] Raw data arrays:");
    console.log("   - Temperatures:", temperatures);
    console.log("   - Humidities:", humidities);
    console.log("   - Wind speeds:", windSpeeds);
    console.log("   - Pressures:", pressures);
    console.log("   - POPs:", pops);

    const max_temp = Math.max(...temperatures);
    const avg_humidity =
      humidities.reduce((sum, b) => sum + b, 0) / selectedBlocks.length;
    const avg_wind_speed =
      windSpeeds.reduce((sum, b) => sum + b, 0) / selectedBlocks.length;
    const avg_pressure =
      pressures.reduce((sum, b) => sum + b, 0) / selectedBlocks.length;
    const avg_pop = pops.reduce((sum, b) => sum + b, 0) / selectedBlocks.length;

    const result = {
      T2M_MAX: max_temp,
      RH2M: avg_humidity,
      WS2M: avg_wind_speed,
      PS: avg_pressure / 10,
      API_POP_PERCENT: avg_pop * 100,
    };

    console.log(
      "\ud83c\udfaf [OPENWEATHER SERVICE] Calculated aggregated values:"
    );
    console.log("   - Max temp (T2M_MAX):", result.T2M_MAX);
    console.log("   - Avg humidity (RH2M):", result.RH2M);
    console.log("   - Avg wind speed (WS2M):", result.WS2M);
    console.log("   - Avg pressure (PS):", result.PS);
    console.log("   - Avg POP (API_POP_PERCENT):", result.API_POP_PERCENT);

    console.log("✅ Aggregated live forecast received.");
    return result;
  }
}

export default new OpenWeatherMapService();
