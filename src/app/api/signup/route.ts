import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/models/user";
import connectDB from "@/lib/DBConfig";

connectDB();

export async function POST(request: Request) {
    try {
        const reqBody = await request.json()
        const { name, email, phone, password } = reqBody

        const user = await User.findOne({ email })

        if (user) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            phone,
            password: hashedPassword
        })

        const savedUser = await newUser.save()

        const tokenData = {
            id: savedUser?._id,
            email: savedUser?.email,
        }

        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, { expiresIn: "3d" })

        const response = NextResponse.json({
            message: "User created successfully",
            user: { name, email, phone, onBoarded: false },
            success: true,
        })

        response.cookies.set("token", token, {
            httpOnly: true,
        })

        return response


    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })

    }
}