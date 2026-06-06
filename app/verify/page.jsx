"use client"
import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

const page = () => {
    
    const router = useRouter()
    const { data: session, status } = useSession()

    const [verifyCode, setverifyCode] = useState("")
    const [verifying, setVerifying] = useState(false)

    const [email, setEmail] = useState("")

    useEffect(() => {

    const params = new URLSearchParams(
        window.location.search
    );

    setEmail(
        params.get("email") || ""
    );

}, []);

    useEffect(() => {
        if (status === "authenticated") {
            router.push("/setup-profile")
        }
    }, [status, router])

    // While checking session
    if (status === "loading") {
        return (
            <div className="flex justify-center items-center min-h-screen text-lg">
                <p>Loading...</p>
            </div>
        )
    }

    // Prevent page flash before redirect
    if (status === "authenticated") {
        return null
    }


    


    const handleSubmit = async (e) => {
        e.preventDefault()
        setVerifying(true)
        try {
            const res = await fetch("/api/verify", {
                method: "POST",
                headers: {
                    "Content-Type":
                        "application/json",
                },
                body: JSON.stringify({
                    email,
                    verifyCode
                })
            })
            const data = await res.json()
            if (!res.ok) {
                toast.error(data.error)
            }
            else {
                toast.success(data.message)
                setTimeout(() => {
                    router.push("/login")
                }, 2000);
            }
            
        } catch (error) {
            
            console.log(error);

    toast.error(
        "Something went wrong"
    );
        }finally{
             setVerifying(false)
        }
    }



    return (
        <div className='flex justify-center items-center min-h-screen w-screen bg-linear-to-br from-black via-slate-950 to-blue-950'>
            <div className='w-full max-w-sm'>
                <h1 className='text-3xl font-bold text-center mb-3'>Verify you Account</h1>

                <Card className="w-full max-w-sm bg-white/5 backdrop-blur-2xl  border-white/10 border-[0.5px] rounded-[10px]">
                    <CardHeader>
                        {/* <CardTitle>Login to your account</CardTitle> */}
                        <CardDescription>
                            Enter verification Code sent to your email
                        </CardDescription>
                        {/* <CardAction>
              <Button variant="link">Sign Up</Button>
            </CardAction> */}
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <div className="flex flex-col gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Verification Code</Label>
                                    <Input
                                        value={verifyCode}
                                        onChange={(e) => setverifyCode(e.target.value)}
                                        id="verifyCode"
                                        type="text"
                                        placeholder="Enter your verification code "
                                        required

                                    />
                                </div>

                            </div>
                            <Button disabled={verifying} type="submit" className="w-full mt-4">
                                Verify
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )


}
export default page
