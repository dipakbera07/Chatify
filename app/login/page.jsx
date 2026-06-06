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
import { signIn, useSession } from 'next-auth/react'
import { ArrowLeft } from 'lucide-react'

const page = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const router = useRouter()
  const { data: session, status } = useSession()

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
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false
      })
      if (res.error) {
        toast.error(res.error)
        setSubmitting(false)
      }
      if (res.ok) {
        toast.success("You have successfully logged in")

        setTimeout(() => {
          router.push(`/`)
        }, 2000);
      }
      console.log(res)
    } catch (error) {
      setError("Something went Wrong")
      setSubmitting(false)
    }
  }

  const handleSignInClick = () => {
    router.push("/register")
  }



  return (
    <div className='flex justify-center overscroll-none overflow-hidden scroll-none items-center min-h-screen w-screen bg-linear-to-br from-black via-slate-950 to-blue-950'>
      <button
            onClick={() => router.back()}
            className="fixed top-4 left-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 cursor-pointer"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
      <div className='w-full max-w-sm'>
        <h1 className='text-3xl font-bold text-center mb-3'>Login in Chatify</h1>

        <Card className="w-full max-w-sm bg-white/5 backdrop-blur-2xl  border-white/10 border-[0.5px] rounded-[10px]">
          <CardHeader>
            <div className='flex justify-between items-center text-sm mt-2 gap-2'>
            Login in your Chatify account<span onClick={handleSignInClick} className='cursor-pointer text-blue-400 '>Sign up</span>
          </div>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">

                <div className="grid gap-1">
                  <Label htmlFor="email">Email</Label>
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
                    <Label htmlFor="password">Password</Label>
                   
                  </div>
                  <Input
                    value={password}
                    className="h-9 rounded-md"
                    onChange={(e) => setPassword(e.target.value)}
                    id="password"
                    type="password"
                    required />
                </div>
              </div>
              <Button disabled={submitting} type="submit" className="w-full mt-4 h-9 cursor-pointer ">
                {submitting ? "Submitting..." : "Submit"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )


}
export default page
