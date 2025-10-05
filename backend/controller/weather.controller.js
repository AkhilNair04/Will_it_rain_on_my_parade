import NasaDataService from '../services/nasa.services.js';
import OpenWeatherMapService from '../services/openWeather.services.js';

export const predictWeather = async (req, res) => {
    console.log("🚀 [WEATHER CONTROLLER] Starting weather check request");
    console.log("📥 [WEATHER CONTROLLER] Request body:", JSON.stringify(req.body, null, 2));

    try {
        let { city, latitude, longitude, forecast_date, start_hour = 12, end_hour = 12 } = req.body;
        
        // --- Geocoding Logic ---
        if (!latitude || !longitude) {
            if (!city) return res.status(400).json({ error: "Missing city or coordinates." });
            const coords = await OpenWeatherMapService.getCoordinates(city);
            latitude = coords.lat;
            longitude = coords.lon;
        }

        console.log(`🌍 [WEATHER CONTROLLER] Processing for ${city || 'Custom Location'} (${latitude}, ${longitude})`);

        // --- Step 1: Get Historical Statistics ---
        console.log("📡 [WEATHER CONTROLLER] Step 1: Calling NASA Data Service to get historical stats...");
        const { modelInfo, historicalAvgSoilWetness } = await NasaDataService.getHistoricalStats(latitude, longitude);
        console.log("✅ [WEATHER CONTROLLER] Historical data analysis completed.");

    // --- Step 2: Get Live Forecast ---
    console.log("🌤️ [WEATHER CONTROLLER] Step 2: Calling OpenWeatherMap Service...");
    // Pass forecast_date (if provided) to ensure the service filters for the exact requested day
    const liveForecast = await OpenWeatherMapService.getLiveForecast(latitude, longitude, start_hour, end_hour, forecast_date);
        console.log("✅ [WEATHER CONTROLLER] Live forecast received.");

        // --- Step 3: Make Prediction with Statistical Model ---
        console.log("🎯 [WEATHER CONTROLLER] Step 3: Making statistical prediction...");
        const predicted_mm = NasaDataService.predictRainfall(liveForecast, modelInfo);
        console.log(`✅ [WEATHER CONTROLLER] Prediction completed: ${predicted_mm.toFixed(2)}mm`);

        // --- Step 4: Descriptive Analysis ---
        console.log("🌡️ [WEATHER CONTROLLER] Generating weather outlooks...");
        const temp = liveForecast.T2M_MAX;
        const wind = liveForecast.WS2M;

        let tempOutlook;
        if (temp >= 37) tempOutlook = "Extremely Hot"; else if (temp >= 30) tempOutlook = "Hot"; else if (temp >= 24) tempOutlook = "Warm"; else if (temp >= 17) tempOutlook = "Mild / Pleasant"; else if (temp >= 10) tempOutlook = "Cool"; else if (temp >= 0) tempOutlook = "Cold"; else if (temp >= -10) tempOutlook = "Freezing"; else tempOutlook = "Extremely Cold";

        let windOutlook;
        if (wind >= 17.0) windOutlook = "Gale Force Winds / Very Stormy"; else if (wind >= 11.0) windOutlook = "Strong Wind"; else if (wind >= 5.5) windOutlook = "Moderate Breeze / Windy"; else if (wind >= 1.5) windOutlook = "Light Breeze"; else windOutlook = "Calm";

        let rainOutlook;
        if (predicted_mm > 50) rainOutlook = "Extreme Rainfall / Downpour"; else if (predicted_mm > 10) rainOutlook = "Heavy Rain"; else if (predicted_mm > 3.5) rainOutlook = "Moderate Rain"; else if (predicted_mm > 0.5) rainOutlook = "Light Rain"; else if (predicted_mm > 0) rainOutlook = "Drizzle / Very Light Rain"; else rainOutlook = "No Chance of Rain";

        const erosion_risk = (predicted_mm > 10.0 && historicalAvgSoilWetness > 0.6) ? "High" : "Low";
        const description = `The weather will be ${tempOutlook.toLowerCase()} and ${windOutlook.toLowerCase()}, with a forecast of ${rainOutlook.toLowerCase()}.`;
        
        console.log("🔮 [WEATHER CONTROLLER] Generated outlooks complete.");

        const final_result = {
            input_location: { name: city || "Custom Location", latitude, longitude, forecast_date },
            model_details: {
                training_data_source: "NASA POWER Project",
                historical_data_range_years: 20,
                model_type: "Statistical Ridge Regression Analysis",
                coefficients: modelInfo.coefficients,
                intercept: modelInfo.intercept,
                description: "Uses historical weather patterns and statistical relationships for rainfall prediction"
            },
            live_forecast_values: {
                temperature_max_celsius: Math.round(liveForecast.T2M_MAX * 100) / 100,
                humidity_percent: Math.round(liveForecast.RH2M),
                wind_speed_mps: Math.round(liveForecast.WS2M * 100) / 100,
                api_pop_percent: Math.round(liveForecast.API_POP_PERCENT)
            },
            prediction_output: {
                predicted_rainfall_mm: Math.round(predicted_mm * 100) / 100,
                temperature_outlook: tempOutlook,
                wind_outlook: windOutlook,
                rain_outlook: rainOutlook,
                erosion_risk: erosion_risk,
                final_summary: description
            }
        };

        console.log("✅ [WEATHER CONTROLLER] Final result prepared. Sending response.");
        res.json(final_result);

    } catch (error) {
        console.error("❌ [WEATHER CONTROLLER] An error occurred:");
        console.error("❌ [WEATHER CONTROLLER] Error message:", error.message);
        console.error("❌ [WEATHER CONTROLLER] Error stack:", error.stack);
        
        // More specific error messages
        if (error.message.includes('NASA')) {
            console.error("❌ [WEATHER CONTROLLER] NASA API Error detected");
            res.status(500).json({ 
                message: "NASA API service error", 
                details: error.message,
                type: "NASA_API_ERROR"
            });
        } else if (error.message.includes('OpenWeatherMap') || error.message.includes('Weather')) {
            console.error("❌ [WEATHER CONTROLLER] OpenWeatherMap API Error detected");
            res.status(500).json({ 
                message: "Weather API service error", 
                details: error.message,
                type: "WEATHER_API_ERROR"
            });
        } else {
            console.error("❌ [WEATHER CONTROLLER] General error");
            res.status(500).json({ 
                message: "An internal server error occurred.", 
                details: error.message,
                type: "GENERAL_ERROR"
            });
        }
    }
};