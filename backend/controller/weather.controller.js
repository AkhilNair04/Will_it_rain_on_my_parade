import NasaDataService from "../services/nasa.services.js";
import OpenWeatherMapService from "../services/openWeather.services.js";
import PredictionService from "../services/prediction.services.js";

export const weatherCheck = async (req, res) => {
  console.log("🚀 [WEATHER CONTROLLER] Starting weather check request");
  console.log(
    "📥 [WEATHER CONTROLLER] Request body:",
    JSON.stringify(req.body, null, 2)
  );

  try {
    const { city, latitude, longitude, start_hour, end_hour } = req.body;

    console.log("🔍 [WEATHER CONTROLLER] Extracted parameters:");
    console.log("   - location_name:", city);
    console.log("   - latitude:", latitude);
    console.log("   - longitude:", longitude);
    console.log("   - start_hour:", start_hour);
    console.log("   - end_hour:", end_hour);

    // Validate required fields
    if (
      !city ||
      !latitude ||
      !longitude ||
      start_hour === undefined ||
      end_hour === undefined
    ) {
      console.log(
        "❌ [WEATHER CONTROLLER] Validation failed - missing required fields"
      );
      return res.status(400).json({
        error:
          "Missing required fields: city, latitude, longitude, start_hour, end_hour",
      });
    }

    console.log("✅ [WEATHER CONTROLLER] Validation passed");
    console.log(
      `🌍 [WEATHER CONTROLLER] Processing weather request for ${city} (${latitude}, ${longitude})`
    );

    // Step 1: Get historical data from NASA
    console.log("📡 [WEATHER CONTROLLER] Step 1: Calling NASA Data Service...");
    const { avgRainfall, avgSoilWetness } =
      await NasaDataService.getHistoricalStats(latitude, longitude);
    console.log("✅ [WEATHER CONTROLLER] NASA data received:");
    console.log("   - avgRainfall:", avgRainfall);
    console.log("   - avgSoilWetness:", avgSoilWetness);

    // Step 2: Get live forecast from OpenWeatherMap
    console.log(
      "🌤️ [WEATHER CONTROLLER] Step 2: Calling OpenWeatherMap Service..."
    );
    const liveForecast = await OpenWeatherMapService.getLiveForecast(
      latitude,
      longitude,
      start_hour,
      end_hour
    );
    console.log("✅ [WEATHER CONTROLLER] Live forecast received:");
    console.log("   - liveForecast:", JSON.stringify(liveForecast, null, 2));

    // Step 3: Make prediction
    console.log(
      "🎯 [WEATHER CONTROLLER] Step 3: Making rainfall prediction..."
    );
    const predicted_mm = PredictionService.predictRainfall(
      liveForecast,
      avgRainfall
    );
    console.log("✅ [WEATHER CONTROLLER] Prediction completed:");
    console.log("   - predicted_mm:", predicted_mm);

    // Determine erosion risk
    console.log("⚖️ [WEATHER CONTROLLER] Calculating erosion risk...");
    let erosionRisk = "Low";
    if (predicted_mm > 10 && avgSoilWetness > 0.6) {
      erosionRisk = "High";
    } else if (predicted_mm > 5 && avgSoilWetness > 0.4) {
      erosionRisk = "Medium";
    }
    console.log("   - erosionRisk:", erosionRisk);

    // Generate weather outlooks
    console.log("🌡️ [WEATHER CONTROLLER] Generating weather outlooks...");
    const temp = liveForecast.T2M_MAX;
    const humidity = liveForecast.RH2M;
    const wind = liveForecast.WS2M;
    const apiPop = liveForecast.API_POP_PERCENT;

    console.log("📊 [WEATHER CONTROLLER] Weather values:");
    console.log("   - temperature:", temp);
    console.log("   - humidity:", humidity);
    console.log("   - wind:", wind);
    console.log("   - apiPop:", apiPop);

    // Temperature outlook
    let tempOutlook;
    if (temp >= 37) tempOutlook = "Extremely Hot";
    else if (temp >= 30) tempOutlook = "Hot";
    else if (temp >= 24) tempOutlook = "Warm";
    else if (temp >= 17) tempOutlook = "Mild / Pleasant";
    else if (temp >= 10) tempOutlook = "Cool";
    else if (temp >= 0) tempOutlook = "Cold";
    else if (temp >= -10) tempOutlook = "Freezing";
    else tempOutlook = "Extremely Cold";

    // Wind outlook
    let windOutlook;
    if (wind >= 17.0) windOutlook = "Gale Force Winds / Very Stormy";
    else if (wind >= 11.0) windOutlook = "Strong Wind";
    else if (wind >= 5.5) windOutlook = "Moderate Breeze / Windy";
    else if (wind >= 1.5) windOutlook = "Light Breeze";
    else windOutlook = "Calm";

    // Rain outlook
    let rainOutlook;
    if (predicted_mm > 50) rainOutlook = "Extreme Rainfall / Downpour";
    else if (predicted_mm > 10) rainOutlook = "Heavy Rain";
    else if (predicted_mm > 3.5) rainOutlook = "Moderate Rain";
    else if (predicted_mm > 0.5) rainOutlook = "Light Rain";
    else if (predicted_mm > 0) rainOutlook = "Drizzle / Very Light Rain";
    else rainOutlook = "No Chance of Rain";

    console.log("🔮 [WEATHER CONTROLLER] Generated outlooks:");
    console.log("   - tempOutlook:", tempOutlook);
    console.log("   - windOutlook:", windOutlook);
    console.log("   - rainOutlook:", rainOutlook);

    const description = `The weather will be ${tempOutlook.toLowerCase()} and ${windOutlook.toLowerCase()}, with a forecast of ${rainOutlook.toLowerCase()}.`;
    console.log("📝 [WEATHER CONTROLLER] Final description:", description);

    const result = {
      input_location: {
        location_name: city,
        latitude,
        longitude,
      },
      historical_data: {
        avg_rainfall_mm: avgRainfall,
        avg_soil_wetness: avgSoilWetness,
        data_source: "NASA POWER Project",
        historical_range_years: 5,
      },
      live_forecast_values: {
        temperature_max_celsius: temp,
        humidity_percent: humidity,
        wind_speed_mps: wind,
        pressure_kpa: liveForecast.PS,
        api_pop_percent: apiPop,
      },
      prediction_output: {
        predicted_rainfall_mm: predicted_mm,
        temperature_outlook: tempOutlook,
        wind_outlook: windOutlook,
        rain_outlook: rainOutlook,
        erosion_risk: erosionRisk,
        final_summary: description,
      },
    };

    console.log("✅ [WEATHER CONTROLLER] Final result prepared:");
    console.log(JSON.stringify(result, null, 2));
    console.log("📤 [WEATHER CONTROLLER] Sending response to client");

    res.json(result);
  } catch (err) {
    console.error("❌ [WEATHER CONTROLLER] ERROR occurred:");
    console.error("   - Error message:", err.message);
    console.error("   - Error stack:", err.stack);
    console.error(
      "   - Request body that caused error:",
      JSON.stringify(req.body, null, 2)
    );

    res.status(500).json({ error: err.message });
  }
};
