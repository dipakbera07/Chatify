import { NextResponse } from "next/server";
import { dbConnect } from "../../../lib/db";
import User from "../../../models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import cloudinary from "../../../lib/cloudinary";

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {

            return NextResponse.json(
                {
                    success: false,
                    error: "Unauthorized"
                },
                { status: 401 }
            );

        }
        await dbConnect()

        const { image } = await req.json()

        if (!image) {
            return NextResponse.json(
                { error: "Please select an image first" },
                { status: 400 }
            )
        }
        const existingUser = await User.findById(session.user.id)
        if (!existingUser) {
            return NextResponse.json(
                { error: "User does't exists" },
                { status: 400 }
            )
        }

        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url;
        }

        existingUser.image = imageUrl;
        await existingUser.save();

        return NextResponse.json(
            {
                message: "Profile pic uploaded successfully",
                user: existingUser
            },
            { status: 200 }
        )
    } catch (error) {
        console.log("Profile pic upload error: ", error)
        return NextResponse.json(
            { error: "failed to upload profile pic" },
            { status: 500 }
        )

    }

}