import axios from 'axios';

class OpenWeatherMapService {
    async getCoordinates(city, apiKey) {
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

    async getLiveForecast(lat, lon, start_hour, end_hour, apiKey) {
        console.log(`\n--- Step 2: Getting Live Forecast for range ${start_hour}:00 - ${end_hour}:00 ---`);
        const apiUrl = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
        const response = await axios.get(apiUrl);
        
        const tomorrow = new Date();
        tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
        
        const selectedBlocks = response.data.list.filter(forecast => {
            const forecastTime = new Date(forecast.dt_txt.replace(" ", "T") + "Z");
            return forecastTime.getUTCDate() === tomorrow.getUTCDate() && forecastTime.getUTCHours() >= start_hour && forecastTime.getUTCHours() <= end_hour;
        });

        if (selectedBlocks.length === 0) {
            throw new Error("Could not find any forecast blocks in the specified time range.");
        }
        
        const max_temp = Math.max(...selectedBlocks.map(b => b.main.temp_max));
        const avg_humidity = selectedBlocks.reduce((sum, b) => sum + b.main.humidity, 0) / selectedBlocks.length;
        const avg_wind_speed = selectedBlocks.reduce((sum, b) => sum + b.wind.speed, 0) / selectedBlocks.length;
        const avg_pressure = selectedBlocks.reduce((sum, b) => sum + b.main.pressure, 0) / selectedBlocks.length;
        const avg_pop = selectedBlocks.reduce((sum, b) => sum + (b.pop || 0), 0) / selectedBlocks.length;

        console.log("✅ Aggregated live forecast received.");
        return { T2M_MAX: max_temp, RH2M: avg_humidity, WS2M: avg_wind_speed, PS: avg_pressure / 10, API_POP_PERCENT: avg_pop * 100 };
    }
}

export default new OpenWeatherMapService();