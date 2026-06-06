import { NextResponse } from "next/server"
import { dbConnect } from "../../../lib/db"
import User from "../../../models/User"
import { sendWelcomeEmail } from "../../../helpers/sendWelcomeEmail"


export async function POST(request) {
    await dbConnect()
    try {
        const { email, verifyCode } = await request.json()
        console.log("Email: ", email, " Code: ", verifyCode)

        if (!verifyCode) {
            return NextResponse.json(
                { error: "Enter verification Code" },
                { status: 400 }
            )
        }
        if (verifyCode.length !== 6){
            return NextResponse.json(
                { error: "Enter 6 digit Code" },
                { status: 400 }
            )
        }
        const existingUser = await User.findOne({ email })
        if (!existingUser) {

            return NextResponse.json(
                {
                    error: "User not found"
                },
                {
                    status: 404
                }
            );
        }
        if (existingUser.verifyCode.toString() !== verifyCode.toString()) {
            return NextResponse.json(
                { error: "Enter a valid verification Code" },
                { status: 400 }
            )
        }
        if (new Date(existingUser.verifyCodeExpiry) < new Date()) {
            return NextResponse.json(
                { message: "verifyCode expired" },
                { status: 400 }
            )
        }
        existingUser.isVerified = true

        await existingUser.save()
        const welcomeEmailResponse = await sendWelcomeEmail(existingUser.name, existingUser.email)
        if (!welcomeEmailResponse.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Failed to send welcome message"
                },
                {
                    status: 500
                }
            )

        }
        return NextResponse.json(
            { message: "Welcome message sent successfully" },
            { status: 200 }
        )

    } catch (error) {
        console.log("FULL ERROR:", error)

    return NextResponse.json(
        { error: error.message || "User verification failed" },
        { status: 500 }
    )
    }
}