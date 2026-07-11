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
    const { category, capacity, priceRange, city, page, search } = req.query;
    const filter: Record<string, any> = {status: "approved"};

    const searchTerm = String(search ?? "").trim();
    if (searchTerm.length > 100) {
        res.status(400).send({ messege: "Search Too Long" });
        return;
    };

    function secureRegex(text: string): string {
        return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    };

    if (category) {
        filter.category = category;
    };
    if (city) {
        filter.city = { $regex: new RegExp(secureRegex(city as string), "i") };
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

    if (search) {

        filter.title = {
            $regex: secureRegex(search as string),
            $options: "i",
        };
    };

    const DEFAULT_LIMIT = 9;
    const pageNum = Math.min(Math.max(Number(page) || 1, 1), 100)
    const skip = (pageNum - 1) * DEFAULT_LIMIT;

    let [workspaces, totalCount] = await Promise.all([
        workspaceCollection.find(filter).skip(skip).limit(DEFAULT_LIMIT).toArray(),
        workspaceCollection.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalCount / DEFAULT_LIMIT);

    res.setHeader("X-Total-Count", totalCount);
    res.setHeader("X-Total-Pages", totalPages);
    res.setHeader("X-Current-Page", pageNum);
    res.send(workspaces);
};