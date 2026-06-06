"use client"
import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
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

import {
    Field,
    FieldDescription,
    FieldLabel,
} from "@/components/ui/field"
import { ArrowLeft, Loader2 } from 'lucide-react'


const page = () => {

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [submitting, setSubmitting] = useState(false)

    const [selectedImage, setSelectedImage] = useState(null)
    const [imageLoading, setImageLoading] = useState(false)
    const [imageUploading, setImageUploading] = useState(false)





    const router = useRouter()
    const { data: session, status } = useSession()

    const handleSignInClick = () => {
        router.push("/login")
    }

    useEffect(() => {
        if (status === "authenticated") {
            router.push("/")
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
        setSubmitting(true)
        setError("")
        setSuccess("")
        try {
            console.log(name, email, password)
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type":
                        "application/json",
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    image:selectedImage
                })
            })
            const data = await res.json()
            if (!res.ok) {
                toast.error(data.error)
                setSubmitting(false)
            }
            else {
                toast.success(data.message)
                setTimeout(() => {
                    router.replace(`/verify?email=${email}&name=${name}`)
                }, 2000);
            }
            console.log(data)
        } catch (error) {
            setError("Something went Wrong")
            setSubmitting(false)
            console.log(error)
        }
    }



    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (!file) return;
        setImageLoading(true)
        const reader = new FileReader()
        reader.readAsDataURL(file)

        reader.onload = () => {
            setSelectedImage(reader.result)
            e.target.value = "";
            setImageLoading(false)
        }
    }


    // const handleSubmit2 = async (e) => {
    //     e.preventDefault();
    //     setImageUploading(true)
    //     try {
    //         const res = await fetch("/api/profile-setup", {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type":
    //                     "application/json",
    //             },
    //             body: JSON.stringify({
    //                 image: selectedImage
    //             })
    //         })
    //         const data = await res.json()
    //         if (!res.ok) {
    //             toast.error(data.error)
    //         }
    //         else {
    //             toast.success(data.message)
    //             setImageUploading(false)
    //             setTimeout(() => {
    //                 router.push("/")
    //             }, 2000);
    //         }
    //         console.log(data)
    //     } catch (error) {
    //         console.log(data)
    //     }
    // }






    return (
        <div className='flex overscroll-none overflow-hidden scroll-none justify-center items-center min-h-screen w-screen bg-linear-to-br from-black via-slate-950 to-blue-950'>
            <button
      onClick={() => router.back()}
      className="fixed top-4 left-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 cursor-pointer"
    >
      <ArrowLeft className="h-5 w-5" />
    </button>

            <div className="w-full  py-15 max-w-4xl flex flex-col justify-center items-center  bg-white/5 backdrop-blur-2xl  border-white/10 border-[0.5px] rounded-[10px]">
                <h1 className='text-3xl font-bold text-center mb-3'>Register in Chatify</h1>
                <div className='flex justify-center items-center w-full gap-5'>
                    <div className='w-full max-w-sm'>

                        <CardContent >
                            <form onSubmit={handleSubmit}>
                                <div className="flex flex-col gap-4">
                                    <div className="grid gap-1">
                                        <Label className='text-md' htmlFor="email">Name</Label>
                                        <Input
                                            className="h-9 rounded-md"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            id="name"
                                            type="text"
                                            placeholder="Enter your name "
                                            required

                                        />
                                    </div>
                                    <div className="grid gap-1">
                                        <Label className='text-md' htmlFor="email">Email</Label>
                                        <Input
                                            className="h-9 rounded-md"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            id="email"
                                            type="email"
                                            placeholder="Enter you email"
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-1 ">
                                        <div className="flex items-center">
                                            <Label className='text-md' htmlFor="password">Password</Label>
                                           
                                        </div>
                                        <Input
                                            className="h-9 rounded-md"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            id="password"
                                            type="password"
                                            required />
                                    </div>
                                    <Field className="gap-1">
                                            <FieldLabel
                                                htmlFor="picture"
                                                className="text-md"
                                            >Profile Picture</FieldLabel>
                                            <Input
                                                className="h-9 rounded-md cursor-pointer"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                id="picture" type="file"
                                            />
                                        </Field>
                                </div>


                                <Button disabled={submitting} type="submit" className="cursor-pointer w-full mt-4 h-9 rounded-md">
                                    {submitting ? "Submitting..." : "Submit"}
                                </Button>
                                <div className='flex justify-center items-center text-sm mt-2 gap-2'>
                                    Already have an account ?<span onClick={handleSignInClick} className='cursor-pointer text-blue-400 '>Sign in</span>
                                </div>
                            </form>
                        </CardContent>

                    </div>

                    <div className='w-full max-w-sm'>
                        {
                            selectedImage ?
                                <>
                                    <div className="w-full  max-w-3xl max-h-3xl p-4 mt-3 flex flex-col gap-3 justify-center items-center relative">
                                        <div >
                                            <img
                                                src={selectedImage}
                                                alt="preview"
                                                className="w-full h-full object-cover rounded-lg"
                                            />

                                            <button
                                                onClick={() => setSelectedImage(null)}
                                                className=" absolute top-1 right-1 bg-blue-500 h-6 w-6 rounded-full text-white cursor-pointer flex justify-center items-center"
                                            >
                                                ×
                                            </button>
                                        </div>
                                        {
                                            imageLoading &&
                                                <>
                                                    <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                                                </> 
                                        }

                                    </div>
                                </>
                                :
                                <>
                                     <div className="w-full  max-w-3xl max-h-3xl p-4 mt-3 flex flex-col gap-3 justify-center items-center relative">
                                        <div >
                                            <img
                                                src="./sample.avif"
                                                alt="preview"
                                                className="w-full h-full object-cover rounded-lg"
                                            />

                                            
                                        </div>
                                        
                                    </div>
                                </>
                        }
                    </div>
                </div>

            </div>
        </div>
    )


}
export default page
