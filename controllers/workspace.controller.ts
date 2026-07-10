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
    const { category, capacity, priceRange, city, page } = req.query;
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

    const DEFAULT_LIMIT = 9;
    const pageNum = Math.max(Number(page) || 1, 1);
    const skip = (pageNum - 1) * DEFAULT_LIMIT;

    const [workspaces, totalCount] = await Promise.all([
        workspaceCollection.find(filter).skip(skip).limit(DEFAULT_LIMIT).toArray(),
        workspaceCollection.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalCount / DEFAULT_LIMIT);

    res.setHeader("X-Total-Count", totalCount);
    res.setHeader("X-Total-Pages", totalPages);
    res.setHeader("X-Current-Page", pageNum);
    res.send(workspaces);
};