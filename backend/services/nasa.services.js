import axios from 'axios';
import 'dotenv/config';

class NasaDataService {
    async getHistoricalStats(lat, lon) {
        console.log("--- Step 1: Fetching Historical Data from NASA POWER ---");
        const apiKey = process.env.NASA_API_KEY || "piqLtsahAFse9bYlkcziVxQfWGPo0fnvCObudiOJ";
        const parameters = "T2M_MAX,RH2M,PRECTOTCORR,WS2M,PS,GWETROOT";
        const endDate = new Date();
        const startDate = new Date();
        startDate.setFullYear(endDate.getFullYear() - 20); // Reduced to 5 years for faster processing
        const formatDate = (date) => `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
        
        const nasaUrl = `https://power.larc.nasa.gov/api/temporal/daily/point?parameters=${parameters}&community=RE&longitude=${lon}&latitude=${lat}&start=${formatDate(startDate)}&end=${formatDate(endDate)}&format=JSON`;

        try {
            const response = await axios.get(nasaUrl);
            const data = response.data;
            
            if (!data.properties || !data.properties.parameter) {
                throw new Error("Invalid NASA data response format");
            }
            
            const params = data.properties.parameter;
            const rainfall = Object.values(params.PRECTOTCORR || {}).filter(val => val !== -999 && val != null);
            const soilWetness = Object.values(params.GWETROOT || {}).filter(val => val !== -999 && val != null);
            const temperatures = Object.values(params.T2M_MAX || {}).filter(val => val !== -999 && val != null);
            const humidity = Object.values(params.RH2M || {}).filter(val => val !== -999 && val != null);
            const windSpeed = Object.values(params.WS2M || {}).filter(val => val !== -999 && val != null);
            const pressure = Object.values(params.PS || {}).filter(val => val !== -999 && val != null);
            
            // Calculate statistical relationships
            const avgRainfall = rainfall.length > 0 ? rainfall.reduce((a, b) => a + b, 0) / rainfall.length : 0;
            const avgSoilWetness = soilWetness.length > 0 ? soilWetness.reduce((a, b) => a + b, 0) / soilWetness.length : 0.5;
            const avgTemperature = temperatures.length > 0 ? temperatures.reduce((a, b) => a + b, 0) / temperatures.length : 20;
            const avgHumidity = humidity.length > 0 ? humidity.reduce((a, b) => a + b, 0) / humidity.length : 60;
            const avgWindSpeed = windSpeed.length > 0 ? windSpeed.reduce((a, b) => a + b, 0) / windSpeed.length : 3;
            const avgPressure = pressure.length > 0 ? pressure.reduce((a, b) => a + b, 0) / pressure.length : 1013;
            
            // Simple statistical model coefficients based on meteorological relationships
            const modelInfo = {
                coefficients: {
                    T2M_MAX: -0.02,   // Higher temps generally reduce rainfall in many regions
                    RH2M: 0.05,       // Higher humidity increases rainfall probability
                    WS2M: 0.1,        // Wind can indicate weather systems
                    PS: -0.01         // Lower pressure often means more rain
                },
                intercept: avgRainfall,
                historicalStats: {
                    avgRainfall,
                    avgTemperature,
                    avgHumidity,
                    avgWindSpeed,
                    avgPressure
                }
            };
            
            console.log("✅ Historical data processed successfully.");
            return { modelInfo, historicalAvgSoilWetness: avgSoilWetness };
        } catch (error) {
            console.log("⚠️ Using default historical values due to:", error.message);
            return {
                modelInfo: {
                    coefficients: {
                        T2M_MAX: -0.02,
                        RH2M: 0.05,
                        WS2M: 0.1,
                        PS: -0.01
                    },
                    intercept: 2.5,
                    historicalStats: {
                        avgRainfall: 2.5,
                        avgTemperature: 20,
                        avgHumidity: 60,
                        avgWindSpeed: 3,
                        avgPressure: 1013
                    }
                },
                historicalAvgSoilWetness: 0.5
            };
        }
    }

    // Simple prediction function using statistical relationships
    predictRainfall(liveForecast, modelInfo) {
        console.log("\n--- Step 3: Making Statistical Prediction ---");
        
        const { T2M_MAX, RH2M, WS2M, PS } = liveForecast;
        const { coefficients, intercept } = modelInfo;
        
        // Linear regression prediction: y = intercept + sum(coefficient * feature)
        let predicted_mm = intercept +
            (coefficients.T2M_MAX * T2M_MAX) +
            (coefficients.RH2M * RH2M) +
            (coefficients.WS2M * WS2M) +
            (coefficients.PS * PS);
        
        // Ensure non-negative prediction
        predicted_mm = Math.max(0, predicted_mm);
        
        console.log(`✅ Prediction completed: ${predicted_mm.toFixed(2)}mm`);
        return predicted_mm;
    }
}

export default new NasaDataService();