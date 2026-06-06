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
// import { getServerSession } from 'next-auth'
import { useSession } from 'next-auth/react'
const page = () => {

  const [name, setName] = useState("")
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
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password
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



  return (
    <div className='flex justify-center items-center min-h-screen w-screen bg-linear-to-br from-black via-slate-950 to-blue-950'>
      <div className='w-full max-w-sm'>
        <h1 className='text-3xl font-bold text-center mb-3'>Register in Chatify</h1>

        <Card className="w-full max-w-sm bg-white/5 backdrop-blur-2xl  border-white/10 border-[0.5px] rounded-[10px]">
          <CardHeader>
            <CardTitle>Create your Chatify account</CardTitle>
            {/* <CardDescription>
              Enter your email below to Create new account
            </CardDescription> */}
            <CardAction>
              <Button variant="link">Sign in</Button>
            </CardAction>
          </CardHeader>
          <CardContent >
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Name</Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    id="name"
                    type="text"
                    placeholder="Enter your name "
                    required

                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    id="email"
                    type="email"
                    placeholder="Enter you email"
                    required
                  />
                </div>
                <div className="grid gap-2 ">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="#"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <Input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    id="password"
                    type="password"
                  
                    required />
                </div>
              </div>
              <Button disabled={submitting} type="submit" className="w-full mt-4">
                {submitting ? "Submitting..." : "Submit"}
              </Button>
            </form>
          </CardContent>
          {/* <CardFooter className="flex-col gap-2">
            <Button variant="outline" className="w-full">
              Login with Google
            </Button>
          </CardFooter> */}
        </Card>
      </div>
    </div>
  )


}
export default page
