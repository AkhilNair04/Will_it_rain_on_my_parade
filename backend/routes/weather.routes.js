import { Router } from "express";
import { weatherCheck } from "../controller/weather.controller.js";
// import { weatherCheck } from "../controllers/weather.controller.js";

const router= Router();

router.get("/",weatherCheck);

export default router;