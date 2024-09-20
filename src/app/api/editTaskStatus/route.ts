import { NextResponse } from "next/server";
import User from "@/models/user";
import connectDB from "@/lib/DBConfig";
import Board from "@/models/board";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import mongoose from "mongoose";

connectDB();

export async function PUT(request: Request) {
    try {

        const reqBody = await request.json()
        const userId = await getDataFromToken(request);

        const user = await User.findOne({ _id: userId }).select("-password");

        if (!user) {
            return NextResponse.json({
                message: "Unauthorized",
                success: false
            }, { status: 401 })
        }

        const { taskId, status } = reqBody

        const task = await Board.updateOne(
            { user: new mongoose.Types.ObjectId(userId), 'tasks._id': new mongoose.Types.ObjectId(taskId) },
            { $set: { 'tasks.$.status': status } }
        );

        console.log(task);
        


        return NextResponse.json({
            message: "Task status updated successfully",
            success: true
        })


    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })

    }
}