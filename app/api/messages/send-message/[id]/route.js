import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../lib/auth";
import cloudinary from "../../../../../lib/cloudinary";
import Message from "../../../../../models/Message";
import { NextResponse } from "next/server";
import { dbConnect } from "../../../../../lib/db";
import User from "../../../../../models/User";




export async function POST(req, { params }) {
    try {

        const { id } = await params
        console.log("id:", id)
        console.log("Hello guys")
        await dbConnect()

        const { text, image } = await req.json();
        const session = await getServerSession(authOptions);
        if (!session) {

            return NextResponse.json(
                {
                    success: false,
                    error: "Unauthorized"
                },
                { status: 401 }
            );

        }
        const senderId = session.user.id
        if (!text && !image) {
            return NextResponse.json(
                { error: "Text or image is required" },
                { status: 400 }
            )
        }
        console.log("Image received:", image ? "YES" : "NO");
        console.log("Image length:", image?.length);
        if (senderId === id) {
            return NextResponse.json(
                { error: "Can't sent message to yourself" },
                { status: 400 }
            )
        }
        const receiverExists = await User.findById(id);
        if (!receiverExists) {
            return NextResponse.json(
                { error: "Receiver does not exists" },
                { status: 400 }
            )
        }

        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId: senderId,
            receiverId: id,
            text,
            image: imageUrl
        });

        await newMessage.save()

        return NextResponse.json(
            { message: "Message sent successfully", newMessage },
            { status: 201 }
        )

    } catch (error) {
        console.log("Sent message error: ", error)
        return NextResponse.json(
            { error: "Failed to sent message" },
            { status: 500 }
        )
    }
}