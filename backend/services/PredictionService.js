class PredictionService {
    predictRainfall(liveForecast, historicalAvgRainfall) {
        console.log("\n--- Step 3: Making Weather-Based Prediction ---");
        
        const { T2M_MAX, RH2M, WS2M, PS, API_POP_PERCENT } = liveForecast;
        
        // This is a simple rule-based system that builds a "rain probability" score.
        let rainProbability = 0;
        
        // Humidity is a strong indicator of rain.
        if (RH2M > 80) rainProbability += 0.4;
        else if (RH2M > 65) rainProbability += 0.25;
        else if (RH2M > 50) rainProbability += 0.1;
        
        // Rain is most common in moderate, not extreme, temperatures.
        if (T2M_MAX >= 15 && T2M_MAX <= 30) rainProbability += 0.2;
        else if (T2M_MAX < 15 || T2M_MAX > 35) rainProbability += 0.05;
        
        // Moderate to high wind can indicate a weather system moving in.
        if (WS2M >= 3 && WS2M <= 8) rainProbability += 0.15;
        else if (WS2M > 8) rainProbability += 0.25;
        
        // Low atmospheric pressure is a very strong indicator of rain.
        if (PS < 1010) rainProbability += 0.3; // Using the kPa value
        else if (PS < 1015) rainProbability += 0.15;
        
        // We also weigh the source API's own prediction.
        rainProbability += (API_POP_PERCENT / 100) * 0.4;
        
        // Ensure the final probability is capped at 100%.
        rainProbability = Math.min(1, Math.max(0, rainProbability));
        
        // Convert the final probability score into an estimated rainfall amount in mm.
        let predicted_mm = 0;
        if (rainProbability > 0.7) {
            predicted_mm = historicalAvgRainfall * 2 * rainProbability;
        } else if (rainProbability > 0.4) {
            predicted_mm = historicalAvgRainfall * rainProbability;
        } else if (rainProbability > 0.2) {
            predicted_mm = historicalAvgRainfall * 0.5 * rainProbability;
        } 
        
        console.log(`✅ Prediction completed: ${predicted_mm.toFixed(2)}mm (probability: ${(rainProbability * 100).toFixed(1)}%)`);
        return Math.max(0, predicted_mm);
    }
}

export default new PredictionService();