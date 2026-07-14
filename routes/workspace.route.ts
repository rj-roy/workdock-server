import express from 'express';
import { createWorkspace, getAllWorkspace, getApprovedWorkspace, getWorkspaceByItsId, getWorkspaceByQuery } from '../controllers/workspace.controller.ts';

const router = express.Router();

router.get('/get/all', getAllWorkspace);
router.get('/get/status', getApprovedWorkspace);
router.get('/get/query', getWorkspaceByQuery);
router.get('/get/id/:id', getWorkspaceByItsId);
router.post('/create', createWorkspace);

export default router;