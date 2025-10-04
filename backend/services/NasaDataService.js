import axios from 'axios';

class NasaDataService {
    async getHistoricalStats(lat, lon, apiKey) {
        console.log("--- Step 1: Fetching Historical Data from NASA POWER ---");
        const parameters = "T2M_MAX,RH2M,PRECTOTCORR,WS2M,PS,GWETROOT";
        const endDate = new Date();
        const startDate = new Date();
        startDate.setFullYear(endDate.getFullYear() - 5);
        const formatDate = (date) => `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
        
        const nasaUrl = `https://power.larc.nasa.gov/api/temporal/daily/point?parameters=${parameters}&community=RE&longitude=${lon}&latitude=${lat}&start=${formatDate(startDate)}&end=${formatDate(endDate)}&format=JSON`;

        try {
            const response = await axios.get(nasaUrl);
            const params = response.data.properties.parameter;
            const rainfall = Object.values(params.PRECTOTCORR || {}).filter(val => val !== -999 && val != null);
            const soilWetness = Object.values(params.GWETROOT || {}).filter(val => val !== -999 && val != null);
            const avgRainfall = rainfall.length > 0 ? rainfall.reduce((a, b) => a + b, 0) / rainfall.length : 0;
            const avgSoilWetness = soilWetness.length > 0 ? soilWetness.reduce((a, b) => a + b, 0) / soilWetness.length : 0.5;
            
            console.log("✅ Historical data processed successfully.");
            return { avgRainfall, avgSoilWetness };
        } catch (error) {
            console.log("⚠️ Using default historical values due to NASA API error.");
            return { avgRainfall: 2.5, avgSoilWetness: 0.5 };
        }
    }
}

export default new NasaDataService();