import { NextResponse } from "next/server";
import User from "@/models/user";
import connectDB from "@/lib/DBConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import Board from "@/models/board";

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

        const { boardName, task } = reqBody

        const newBoard = new Board({
            name: boardName,
            tasks: [task]
        })


        await newBoard.save()

        user.onBoarded = true

        await user.save()

        return NextResponse.json({
            message: "Board created successfully",
            success: true
        })


    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })

    }
}