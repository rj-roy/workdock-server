import express  from "express";
import { createBooking } from "../controllers/booking.controller.ts";

const router = express.Router();

router.post('/create', createBooking);
    
export default router;