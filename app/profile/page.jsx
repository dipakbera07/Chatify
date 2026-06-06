"use client"
import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import {
    useSearchParams
} from "next/navigation"
import { Toaster } from "@/components/ui/sonner"
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
import { Check, Pencil } from 'lucide-react'
import { ArrowLeft } from "lucide-react";

const page = () => {

    const [selectedImage, setSelectedImage] = useState(null)
    const [updating, setUpdating] = useState(false)
    const [profilePic, setProfilePic] = useState(null)

    const router = useRouter()
    const { data: session, status, update } = useSession()

    

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login")
        }
    }, [status, router])



    const fetchProfilePic = async () => {
        try {
            const res = await fetch("/api/fetch-profile-pic");

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error);
                return;
            }

            setProfilePic(data.pic);
        } catch (error) {
            console.log(error);
            toast.error("Failed to fetch profile picture");
        }
    };


    useEffect(() => {
        fetchProfilePic();
    }, []);

    // While checking session
    if (status === "loading") {
        return (
            <div className="flex justify-center items-center min-h-screen text-lg">
                <p>Loading...</p>
            </div>
        )
    }





    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (!file) return;
        // setImageLoading(true)
        const reader = new FileReader()
        reader.readAsDataURL(file)

        reader.onload = () => {
            setSelectedImage(reader.result)
            e.target.value = "";
            // setImageLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!selectedImage) {
            toast.error("Please select an image");
            return;
        }
        setUpdating(true)
        try {
            const res = await fetch("/api/profile-setup", {
                method: "POST",
                headers: {
                    "Content-Type":
                        "application/json",
                },
                body: JSON.stringify({
                    image: selectedImage
                })
            })
            const data = await res.json()
            if (!res.ok) {
                toast.error(data.error)
            }
            toast.success(data.message)
            await fetchProfilePic();
            setSelectedImage(null);
        } catch (error) {
            console.log("Failed to update : ", error)
        } finally {
            setUpdating(false)
        }
    }



    return (
        <div className='flex overscroll-none overflow-hidden scroll-none  justify-center items-start min-h-screen  w-screen bg-linear-to-br from-black via-slate-950 to-blue-950'>
            <button
                onClick={() => router.back()}
                className="fixed top-4 left-4 p-2 rounded-full  hover:bg-slate-700 cursor-pointer"
            >
                <ArrowLeft className="h-5 w-5" />
            </button>

            <form onSubmit={handleSubmit} className='w-full max-w-sm flex flex-col justify-center items-center my-30 px-2 gap-5'>



                <div className="  w-60 h-60 rounded-full p-4 mt-3 flex flex-col gap-3 justify-center items-center relative">
                    <img
                        src={selectedImage ||
                            profilePic ||
                            "/sample.avif"}
                        alt="preview"
                        className="w-full h-full object-cover rounded-full "
                    />
                    <div
                        className='p-3 hover:bg-blue-500/9 rounded-full cursor-pointer flex justify-center items-center absolute top-1 right-1'>
                        <label htmlFor='picture' className=' cursor-pointer'>
                            <Pencil className=' h-6 w-6 ' />
                        </label>
                        <Input
                            accept="image/*"
                            id="picture"
                            onChange={handleImageChange}
                            type="file"
                            className="cursor-pointer hidden"

                        />
                    </div>
                </div>


                <div className='w-full flex items-center justify-between '>
                    <div>
                        <CardDescription className="text-sm">
                            Name
                        </CardDescription>
                        <CardTitle className="text-lg">{session?.user?.name}</CardTitle>
                    </div>

                    <Check className='h-6' />
                </div>
                <div className='w-full flex items-center justify-between '>
                    <div>
                        <CardDescription className="text-sm">
                            email
                        </CardDescription>
                        <CardTitle className="text-lg">{session?.user?.email}</CardTitle>
                    </div>
                    <Check className='h-6' />
                </div>

                <Button disabled={updating} type="submit" className="w-full disabled:opacity-50 cursor-pointer">
                    {
                        updating ?
                            "Updating"
                            :
                            "Update"
                    }
                </Button>


                {/* <C */}

            </form>
        </div>
    )


}
export default page
