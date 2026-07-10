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
    const { category, capacity, priceRange, city } = req.query;
    const filter: Record<string, any> = {};

    if (category) {
        filter.category = category;
    };
    if (city) {
        filter.city = { $regex: new RegExp(city as string, "i") };
    };
    if (capacity) {
        filter.capacity = { $gte: Number(capacity) };
    };
    if (priceRange) {
        const [min, max] = (priceRange as string).split("-").map(Number);
        filter.price = {};
        if (!isNaN(min)) filter.price.$gte = min;
        if (!isNaN(max)) filter.price.$lte = max;
    };

    const workspaces = await workspaceCollection.find(filter).toArray();
    res.send(workspaces);
};