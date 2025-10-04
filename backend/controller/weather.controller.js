import { getWeatherData } from "../services/dataCheck.service.js";

export const weatherCheck = async (req, res) => {
  try {
    const data = req.body;

    const result = await getWeatherData(data);

    res.json(result);
  } catch (err) {
    console.error("Error in weatherCheck controller:", err.message);
    res.status(500).json({ error: err.message });
  }
};
