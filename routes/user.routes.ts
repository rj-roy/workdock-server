import express from "express";
import { editProfile } from "../controllers/user.controller.ts";

const router = express.Router();

router.patch('/edit/:id', editProfile);
router.post('/edit/:id', editProfile);

export default router;