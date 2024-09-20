import { NextResponse } from "next/server";
import User from "@/models/user";
import connectDB from "@/lib/DBConfig";
import Board from "@/models/board";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import mongoose from "mongoose";

connectDB();

export async function POST(request: Request) {
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

        const { title, description, priority, dueDate } = reqBody

        const newTask = {
            title,
            description,
            priority,
            dueDate: new Date(dueDate)
        };

        const board = await Board.findOneAndUpdate(
            { user: new mongoose.Types.ObjectId(userId) },
            { $push: { tasks: newTask } },
            { new: true, useFindAndModify: false }
        );

        if (!board) {
            return NextResponse.json({
                message: "Board not found",
                success: false
            }, { status: 404 });
        }

        console.log(board);


        return NextResponse.json({
            message: "Task created successfully",
            success: true,
            tasks: board?.tasks
        });


    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })

    }
}