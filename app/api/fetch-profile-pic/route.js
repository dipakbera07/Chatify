import { NextResponse } from "next/server";
import { dbConnect } from "../../../lib/db";
import User from "../../../models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";


export async function GET(req) {
    try {
        await dbConnect()

        const session = await getServerSession(authOptions)


        const existingUser = await User.findById(session.user.id)

        if (!existingUser) {
            return NextResponse.json(
                { error: "User does't exists" },
                { status: 400 }
            )
        }


        return NextResponse.json(
            {
                message: "Profile pic fetched",
                pic: existingUser.image
            },
            { status: 200 }
        )

    } catch (error) {
        return NextResponse.json(
            {
                error: "Failed to fetch profile pic",
            },
            { status: 500 }
        )
    }
}