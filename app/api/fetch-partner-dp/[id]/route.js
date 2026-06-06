import { NextResponse } from "next/server";
import { dbConnect } from "../../../../lib/db";
import User from "../../../../models/User";


export async function GET(req, { params }) {
    try {
        const { id } = await params;
        console.log("Received ID:", id);

        await dbConnect();

        const existingUser = await User.findById(id);

        if (!existingUser) {
            return NextResponse.json(
                { error: "User doesn't exist" },
                { status: 400 }
            );
        }
       console.log("User:", existingUser);
console.log("Image:", existingUser.image);

        return NextResponse.json(
            {
                message: "Profile pic fetched",
                pic: existingUser.image,
                name: existingUser.name
            },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                error: "Failed to fetch profile pic",
            },
            { status: 500 }
        );
    }
}