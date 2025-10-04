class PredictionService {
  predictRainfall(liveForecast, historicalAvgRainfall) {
    console.log("🎯 [PREDICTION SERVICE] Starting rainfall prediction");
    console.log("\n--- Step 3: Making Weather-Based Prediction ---");

    console.log("📊 [PREDICTION SERVICE] Input parameters:");
    console.log("   - liveForecast:", JSON.stringify(liveForecast, null, 2));
    console.log("   - historicalAvgRainfall:", historicalAvgRainfall);

    const { T2M_MAX, RH2M, WS2M, PS, API_POP_PERCENT } = liveForecast;

    console.log("🧮 [PREDICTION SERVICE] Extracted weather values:");
    console.log("   - Temperature (T2M_MAX):", T2M_MAX);
    console.log("   - Humidity (RH2M):", RH2M);
    console.log("   - Wind Speed (WS2M):", WS2M);
    console.log("   - Pressure (PS):", PS);
    console.log("   - API POP% (API_POP_PERCENT):", API_POP_PERCENT);

    // This is a simple rule-based system that builds a "rain probability" score.
    let rainProbability = 0;
    console.log(
      "\n🔍 [PREDICTION SERVICE] Calculating rain probability factors:"
    );

    // Humidity is a strong indicator of rain.
    let humidityFactor = 0;
    if (RH2M > 80) {
      humidityFactor = 0.4;
      console.log("   - Humidity > 80%: +0.4");
    } else if (RH2M > 65) {
      humidityFactor = 0.25;
      console.log("   - Humidity > 65%: +0.25");
    } else if (RH2M > 50) {
      humidityFactor = 0.1;
      console.log("   - Humidity > 50%: +0.1");
    } else {
      console.log("   - Humidity <= 50%: +0");
    }
    rainProbability += humidityFactor;

    // Rain is most common in moderate, not extreme, temperatures.
    let tempFactor = 0;
    if (T2M_MAX >= 15 && T2M_MAX <= 30) {
      tempFactor = 0.2;
      console.log("   - Temperature 15-30°C (moderate): +0.2");
    } else if (T2M_MAX < 15 || T2M_MAX > 35) {
      tempFactor = 0.05;
      console.log("   - Temperature extreme (<15°C or >35°C): +0.05");
    } else {
      console.log("   - Temperature other range: +0");
    }
    rainProbability += tempFactor;

    // Moderate to high wind can indicate a weather system moving in.
    let windFactor = 0;
    if (WS2M >= 3 && WS2M <= 8) {
      windFactor = 0.15;
      console.log("   - Wind 3-8 m/s (moderate): +0.15");
    } else if (WS2M > 8) {
      windFactor = 0.25;
      console.log("   - Wind > 8 m/s (high): +0.25");
    } else {
      console.log("   - Wind < 3 m/s (low): +0");
    }
    rainProbability += windFactor;

    // Low atmospheric pressure is a very strong indicator of rain.
    let pressureFactor = 0;
    if (PS < 101.0) {
      // Converted from kPa to more standard hPa comparison
      pressureFactor = 0.3;
      console.log("   - Pressure < 101.0 kPa (low): +0.3");
    } else if (PS < 101.5) {
      pressureFactor = 0.15;
      console.log("   - Pressure < 101.5 kPa (moderate low): +0.15");
    } else {
      console.log("   - Pressure >= 101.5 kPa (normal/high): +0");
    }
    rainProbability += pressureFactor;

    // We also weigh the source API's own prediction.
    const apiPopFactor = (API_POP_PERCENT / 100) * 0.4;
    console.log(
      `   - API POP ${API_POP_PERCENT}% * 0.4: +${apiPopFactor.toFixed(3)}`
    );
    rainProbability += apiPopFactor;

    console.log(
      `\n📈 [PREDICTION SERVICE] Total probability before capping: ${rainProbability.toFixed(
        3
      )}`
    );

    // Ensure the final probability is capped at 100%.
    rainProbability = Math.min(1, Math.max(0, rainProbability));
    console.log(
      `📊 [PREDICTION SERVICE] Final capped probability: ${rainProbability.toFixed(
        3
      )} (${(rainProbability * 100).toFixed(1)}%)`
    );

    // Convert the final probability score into an estimated rainfall amount in mm.
    let predicted_mm = 0;
    console.log(
      "\n🌧️ [PREDICTION SERVICE] Converting probability to rainfall amount:"
    );

    if (rainProbability > 0.7) {
      predicted_mm = historicalAvgRainfall * 2 * rainProbability;
      console.log(
        `   - High probability (>70%): ${historicalAvgRainfall} * 2 * ${rainProbability.toFixed(
          3
        )} = ${predicted_mm.toFixed(3)}mm`
      );
    } else if (rainProbability > 0.4) {
      predicted_mm = historicalAvgRainfall * rainProbability;
      console.log(
        `   - Medium probability (40-70%): ${historicalAvgRainfall} * ${rainProbability.toFixed(
          3
        )} = ${predicted_mm.toFixed(3)}mm`
      );
    } else if (rainProbability > 0.2) {
      predicted_mm = historicalAvgRainfall * 0.5 * rainProbability;
      console.log(
        `   - Low probability (20-40%): ${historicalAvgRainfall} * 0.5 * ${rainProbability.toFixed(
          3
        )} = ${predicted_mm.toFixed(3)}mm`
      );
    } else {
      console.log(`   - Very low probability (<=20%): 0mm`);
    }

    const finalPrediction = Math.max(0, predicted_mm);
    console.log(
      `\n✅ [PREDICTION SERVICE] Final prediction: ${finalPrediction.toFixed(
        2
      )}mm (probability: ${(rainProbability * 100).toFixed(1)}%)`
    );

    return finalPrediction;
  }
}

export default new PredictionService();
