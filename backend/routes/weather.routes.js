import { Router } from "express";
// import { weatherCheck } from "../controllers/weather.controller.js";

const router= Router();

router.get("/",(req,res)=>{
    res.send("Weather route is working!");
});

export default router;