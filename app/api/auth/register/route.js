import mongoose from "mongoose";
import { NextResponse } from "next/server";
import User from "../../../../models/User";
import bcrypt from "bcryptjs";
import { dbConnect } from "../../../../lib/db";
import { sendVerificationEmail } from "../../../../helpers/sendVerificationEmail.js";
import { aj } from "../../../../lib/registerArcjet";
import cloudinary from "../../../../lib/cloudinary";

export async function POST(request) {
    try {

        const { name, email, password, image } = await request.json();

        const decision = await aj.protect(request, {
            requested: 1,
            email,
        });

        console.log("Arcjet:", decision);

        if (decision.isDenied()) {

            if (decision.reason.isRateLimit()) {
                return NextResponse.json(
                    {
                        error: "Too many requests. Please try again later."
                    },
                    {
                        status: 429
                    }
                )
            }

            if (decision.reason.isBot()) {
                return NextResponse.json(
                    {
                        error: "Bot detected"
                    },
                    {
                        status: 403
                    }
                )
            }

            if (decision.reason.isEmail()) {
                return NextResponse.json(
                    {
                        error: "Invalid email address"
                    },
                    {
                        status: 400
                    }
                )
            }

            return NextResponse.json(
                {
                    error: "Access denied"
                },
                {
                    status: 403
                }
            )
        }

        if (!name || !email || !password || !image) {
            return NextResponse.json(
                { error: "Missing fields" },
                { status: 400 }
            )
        }
        if (password.length < 6) {
            return NextResponse.json(
                { error: "Password must be greater then 6 characters" },
                { status: 400 }
            )
        }
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        await dbConnect()
        const existingUser = await User.findOne({ email })

        if (existingUser && existingUser.isVerified === true) {
            return NextResponse.json(
                { error: "User already exists" },
                { status: 409 }
            )
        }

        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url;
        }

        const verifyEmail = await sendVerificationEmail(email, name, verifyCode)
        if (!verifyEmail.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Failed to send verification code"
                },
                {
                    status: 500
                }
            )
        }
        const expiryDate = new Date()
        expiryDate.setHours(expiryDate.getHours() + 1);
        const hashedPassword = await bcrypt.hash(password, 10)
        if (existingUser && existingUser.isVerified === false) {
            await User.updateOne(
                { email },
                {
                    name,
                    email,
                    password: hashedPassword,
                    image,
                    verifyCode,
                    verifyCodeExpiry: expiryDate,
                    isVerified: false
                })
            return NextResponse.json(
                { message: "Please verify your email" },
                { status: 201 }
            )
        }
        await User.create({
            name,
            email,
            password: hashedPassword,
            image:imageUrl,
            verifyCode,
            verifyCodeExpiry: expiryDate,
            isVerified: false
        })



        return NextResponse.json(
            { message: "User successfully registered , Please verify your email" },
            { status: 200 }
        )
    } catch (error) {
        console.log("Failed to rigister user: ", error)
        return NextResponse.json(
            { error: error.message || "Failed to register user" },
            { status: 500 }
        )
    }
}

