import { NextResponse } from "next/server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../lib/auth";
import { dbConnect } from "../../../../lib/db";
import User from "../../../../models/User";

export async function GET() {

    try {

        await dbConnect();

        const session = await getServerSession(authOptions);

        console.log("SESSION => ", session);

        if (!session) {

            return NextResponse.json(
                {
                    success: false,
                    error: "Unauthorized"
                },
                { status: 401 }
            );

        }

        const loggedInUser = session.user.id;

        const filteredUsers =await User.find({
            _id: { $ne: loggedInUser }
        }).select("-password");

        return NextResponse.json(
            {
                success: true,
                users: filteredUsers
            },
            { status: 200 }
        );

    } catch (error) {

        console.log(error);

        return NextResponse.json(
            {
                success: false,
                error: error.message
            },
            { status: 500 }
        );

    }

}