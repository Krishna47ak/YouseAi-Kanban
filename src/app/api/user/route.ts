import { NextResponse } from "next/server";
import User from "@/models/user";
import connectDB from "@/lib/DBConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";

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

        return NextResponse.json({
            success: true,
            user
        })

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}