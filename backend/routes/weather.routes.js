import { Router } from "express";
import { predictWeather } from "../controller/weather.controller.js";

const router = Router();

// Main prediction endpoint - POST method (recommended)
router.post("/predict", predictWeather);

// Alternative routes for flexibility
router.post("/", predictWeather);  // Handle POST to /api/weather
router.get("/", (req, res) => {
    res.json({
        message: "Weather Prediction API",
        endpoints: {
            "POST /api/weather": "Main prediction endpoint",
            "POST /api/weather/predict": "Alternative prediction endpoint"
        },
        usage: {
            method: "POST",
            body: {
                city: "string (required if no coordinates)",
                latitude: "number (optional)",
                longitude: "number (optional)", 
                forecast_date: "string (optional)",
                start_hour: "number (default: 12)",
                end_hour: "number (default: 12)"
            }
        },
        example: {
            city: "Riyadh",
            latitude: 24.7136,
            longitude: 46.6753,
            forecast_date: "2025-10-05",
            start_hour: 10,
            end_hour: 16
        }
    });
});

export default router;