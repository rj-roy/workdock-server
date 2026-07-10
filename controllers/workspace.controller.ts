import { Request, Response } from "express";
import { getCollection } from "../config/db.ts"

export const getAllWorkspace = async (req: Request, res: Response): Promise<void> => {
    const {workspaceCollection} = getCollection();
    const result = await workspaceCollection.find().toArray();
    res.send(result);
};