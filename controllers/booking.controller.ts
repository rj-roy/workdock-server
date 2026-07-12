import { Request, Response } from "express";
import { getCollection } from "../config/db.ts";

export const createBooking = async (req: Request, res: Response): Promise<void> => {
    try {
        const { workspaceTitle, workspaceId, checkInDate, numberOfDays, notes, userId, userName } = req.body;

        if (!workspaceId || !checkInDate || !numberOfDays || !userId || !userName) {
            res.status(400).json({
                success: false,
                message: "Missing required fields.",
            });
            return;
        };

        const { bookingCollection } = getCollection();

        const isAlreadyBookedByUser = await bookingCollection.findOne({
            userId: userId,
            workspaceId: workspaceId,
        });

        if (isAlreadyBookedByUser) {
            res.status(409).json({
                success: false,
                message: "You have already booked this workspace.",
            });
            return;
        } else {
            const booking = {
                workspaceTitle: workspaceTitle,
                workspaceId: workspaceId,
                userName: userName,
                userId: userId,
                checkInDate: checkInDate,
                numberOfDays: Number(numberOfDays),
                notes: notes ?? "",
                status: "pending",
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            const result = await bookingCollection.insertOne(booking);

            res.status(201).json({
                success: true,
                message: "Booking created successfully.",
                data: result,
            });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error.",
        });
    };
};