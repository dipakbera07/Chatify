import CredentialsProvider from "next-auth/providers/credentials";
import { dbConnect } from "./db";
import User from "../models/User";
import bcrypt from "bcryptjs";
import { aj } from "./loginArcjet";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials,req) {
                const decision = await aj.protect(req, {
                    requested: 1,
                });

                console.log("Arcjet:", decision);

                if (decision.isDenied()) {
                    throw new Error(
                        "Too many login attempts. Please try again later."
                    );
                }
                if (!credentials.email || !credentials.password) {
                    throw new Error("Missing email or password")
                }
                try {
                    await dbConnect()
                    const existingUser = await User.findOne({ email: credentials.email })
                    if (!existingUser) {
                        throw new Error("User does not exist")
                    }
                    const isvalid = await bcrypt.compare(credentials.password, existingUser.password)
                    if (!isvalid) {
                        throw new Error("Wrong password")
                    }
                    return {
                        id: existingUser._id.toString(),
                        name: existingUser.name,
                        email: existingUser.email,
                    }
                } catch (error) {
                    throw new Error(error.message || "Failed to login")
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.name = user.name
                token.email = user.email
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id
                session.user.name = token.name
                session.user.email = token.email
            }
            return session
        }
    },
    pages: {
        signIn: "/login",
        error: "/auth/Error"
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60
    },
    secret: process.env.NEXTAUTH_SECRET
};