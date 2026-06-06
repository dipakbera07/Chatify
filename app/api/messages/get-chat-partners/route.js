import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import Message from "../../../../models/Message";
import { NextResponse } from "next/server";
import User from "../../../../models/User";
import { dbConnect } from "../../../../lib/db";


export async function GET() {
    try {
        await dbConnect()
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
        const myId = session.user.id;

        const messages = await Message.find({
            $or:[
                {senderId:myId},
                {receiverId:myId}
            ]
        })

        const chatPartnersIds = [...new Set(messages.map((msg)=>
        msg.senderId.toString() === myId.toString()
        ? msg.receiverId.toString() 
        : msg.senderId.toString()
        ))]

        const chatPartners = await User.find({_id:{$in:chatPartnersIds}}).select("-password")

        return NextResponse.json(
            {
                success:true,
                users:chatPartners
            },
            {status:200}
        )

    } catch (error) {
        console.log("Chat partner error: ",error)
        return NextResponse.json(
            {
                success:false,
                error:"Error to fetch chat partners"
            },
            {status:500}
        )
    }
}