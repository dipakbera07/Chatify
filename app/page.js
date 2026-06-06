"use client"
import { Button } from "@/components/ui/button";
import { Loader2, LogOut, MessageCircleMore, Plus, SendHorizontal, VolumeOff } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input"
import { toast } from 'sonner'
import Dashbord from "../components/Dashbord";
import { useRouter } from "next/navigation";

export default function Home() {
  const [profilePic, setProfilePic] = useState(null)
  const [name, setName] = useState("")
  const { data: session } = useSession()
  const router = useRouter()

  const handleLoginClick = () => {
    router.push("/login")
  }
  const handleSignupClick = () => {
    router.push("/register")
  }

  useEffect(() => {
    console.log("image: ", session?.user?.image)
    console.log("sesion: ", session)
    setProfilePic(session?.user?.image)
    setName(session?.user?.name)
  }, [session])






  return (
    <>
      {session ?
        <Dashbord
          profilePic={profilePic}
          name={name}
        />
        :
        <>
          <div className='flex overscroll-none overflow-hidden scroll-none justify-center items-center min-h-screen w-screen bg-linear-to-br from-black via-slate-950 to-blue-950'>
            <div className='w-full max-w-sm flex flex-col justify-center items-center'>
              <h1 className="text-4xl font-bold mb-3">
                Welcome to Chatify
              </h1>

              <p className="text-slate-400 text-center max-w-md">
                Connect with friends, share images, and stay in touch with
                real-time conversations.
              </p>
              <div className="flex justify-center items-center gap-3 my-4">
                <Button onClick={handleLoginClick} className="cursor-pointer hover:bg-gray-300">Login</Button>
                <Button onClick={handleSignupClick} className="cursor-pointer hover:bg-gray-300">Signup</Button>

              </div>


            </div>
          </div>
        </>
      }

    </>

  );
}
