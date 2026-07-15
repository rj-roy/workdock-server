import { Request, Response } from "express";
import { UserUpdateFields } from "../types/usersCollTypes.ts";
import { ObjectId } from "mongodb";
import { getCollection } from "../config/db.ts";

export const editProfile = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    const { userCollection } = getCollection();
    const { id } = req.params;
    const targetedUser = new ObjectId(id);
    const { name, phone, company, email, bio } = req.body;

    const updateFields: UserUpdateFields = {};

    if (name !== undefined) updateFields.name = name;
    if (phone !== undefined) updateFields.phone = phone;
    if (company !== undefined) updateFields.company = company;
    if (bio !== undefined) updateFields.bio = bio;

    const result = await userCollection.findOneAndUpdate(
        { _id: targetedUser },
        { $set: updateFields },
        { returnDocument: "after" },
    );

    if (!result) {
        res.status(404).json({
            success: false,
            message: "user not found or something wrong",
            data: null,
        });
        return;
    }

    res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: result,
    });
};