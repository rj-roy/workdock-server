import express from 'express';
import { getAllWorkspace } from '../controllers/workspace.controller.ts';

const router = express.Router();

router.get('/all', getAllWorkspace);

export default router;