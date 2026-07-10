import { Request, Response } from "express";
import { getCollection } from "../config/db.ts"

export const getAllWorkspace = async (req: Request, res: Response): Promise<void> => {
    const { workspaceCollection } = getCollection();
    const result = await workspaceCollection.find().toArray();
    res.send(result);
};

export const getApprovedWorkspace = async (req: Request, res: Response): Promise<void> => {
    const { workspaceCollection } = getCollection();
    const { status } = req.query;

    const result = await workspaceCollection.find({
        status: status as string,
    }).toArray();

    res.send(result);
};

export const getWorkspaceByQuery = async (req: Request, res: Response): Promise<void> => {
    const { workspaceCollection } = getCollection();
    const query = req.body;
    console.log(query);
};