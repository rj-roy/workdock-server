import express from 'express';
import { getAllWorkspace, getApprovedWorkspace, getWorkspaceByQuery } from '../controllers/workspace.controller.ts';

const router = express.Router();

router.get('/all', getAllWorkspace);
router.get('/status', getApprovedWorkspace);
router.get('/query', getWorkspaceByQuery);

export default router;