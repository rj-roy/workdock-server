import express from 'express';
import { getAllWorkspace, getApprovedWorkspace, getWorkspaceByItsId, getWorkspaceByQuery } from '../controllers/workspace.controller.ts';

const router = express.Router();

router.get('/all', getAllWorkspace);
router.get('/status', getApprovedWorkspace);
router.get('/query', getWorkspaceByQuery);
router.get('/id/:id', getWorkspaceByItsId);

export default router;