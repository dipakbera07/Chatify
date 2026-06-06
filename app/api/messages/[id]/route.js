import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import { dbConnect } from "../../../../lib/db";
import { NextResponse } from "next/server";
import Message from "../../../../models/Message";

export async function GET(req, { params }) {
    try {
        await dbConnect();

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

        const loggedInUser = session.user.id;
        const { id } = await params;

        const message = await Message.find({
            $or: [
                { senderId: loggedInUser, receiverId: id },
                { senderId: id, receiverId: loggedInUser },
            ]
        });

        return NextResponse.json(
            {
                success: true,
                messages: message
            },
            { status: 200 }
        )

    } catch (error) {
        console.log("ID: ",error)
        return NextResponse.json(
            {
                success: false,
                error: "Error to get all messages"
            },
            { status: 500 }
        )
    }




}