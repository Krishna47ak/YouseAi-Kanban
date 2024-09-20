import { NextResponse } from "next/server";
import User from "@/models/user";
import connectDB from "@/lib/DBConfig";
import Board from "@/models/board";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import mongoose from "mongoose";

connectDB();

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const taskId = params?.id

    try {
        const userId = await getDataFromToken(request);

        const user = await User.findOne({ _id: userId }).select("-password");

        if (!user) {
            return NextResponse.json({
                message: "Unauthorized",
                success: false
            }, { status: 401 })
        }
        

        const tasks = await Board.updateOne(
            { user: new mongoose.Types.ObjectId(userId) },
            { $pull: { tasks: { _id: new mongoose.Types.ObjectId(taskId) } } }
        );

        console.log(tasks);
        

        if (tasks.modifiedCount === 0) {
            throw new Error('Task not found or already deleted');
        }


        return NextResponse.json({
            message: "Task deleted successfully",
            success: true
        })


    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })

    }
}