import { NextResponse } from "next/server";
import User from "@/models/user";
import Board from "@/models/board";
import connectDB from "@/lib/DBConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import mongoose from "mongoose";

connectDB()

export async function GET(request: Request) {
    try {
        const userId = await getDataFromToken(request);

        const user = await User.findOne({ _id: userId }).select("-password");

        if (!user) {
            return NextResponse.json({
                message: "Unauthorized",
                success: false
            }, { status: 401 })
        }

        const tasks = await Board.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(userId) } },
            { $unwind: '$tasks' },
            // { $match: { 'tasks._id': new mongoose.Types.ObjectId(taskId) } },
            { $replaceRoot: { newRoot: '$tasks' } }
        ]);

        if (tasks.length === 0) {
            return NextResponse.json({
                message: "Tasks not found",
                success: false
            }, { status: 404 })
        }

        console.log(tasks);
        

        return NextResponse.json({
            success: true,
            tasks
        })

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}