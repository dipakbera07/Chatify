"use client"
import React from 'react'

import { Button } from "@/components/ui/button";
import { Cross, Loader2, LogOut, MessageCircleMore, Pencil, Plus, SendHorizontal, VolumeOff, X } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input"
import { toast } from 'sonner'
import { useRouter } from 'next/navigation';
import { socket } from '../lib/socket';

const Dashbord = (props) => {

    const [start, setStart] = useState(true)
    const [allContacts, setAllContacts] = useState([])
    const [allChatPartners, setAllChatPartners] = useState([])
    const [contacts, setContacts] = useState(true)
    const [chatMessages, setChatMessages] = useState([])
    const [selectedChatpartner, setSelectedChatpartner] = useState(null)
    const [selectedContact, setSelectedContact] = useState(null)
    const [message, setMessage] = useState("")
    const [selectedImage, setSelectedImage] = useState(null);
    const [messageSending, setMessageSending] = useState(false)
    const [imageLoading, setImageLoading] = useState(false)
    const [profilePic, setProfilePic] = useState(null)
    const [chatPartnerPic, setChatPartnerPic] = useState(null)
    const [chatPartnerName, setChatPartnerName] = useState("")
    const [chatTime, setChatTime] = useState([])

    const { data: session } = useSession()
    const chatContainerRef = useRef(null)
    const fileInputRef = useRef(null);

    const router = useRouter()

    // console.log("Joined room:", session.user.id);

    useEffect(() => {

        socket.on("connect", () => {
            console.log("Socket Connected:", socket.id);
        });

        return () => {
            socket.off("connect");
        };

    }, []);

    useEffect(() => {

        if (session?.user?.id) {

            socket.emit(
                "join",
                session.user.id
            );

            console.log(
                "Joined room:",
                session.user.id
            );

        }

    }, [session]);



    useLayoutEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop =
                chatContainerRef.current.scrollHeight;
        }
    }, [chatMessages]);



    const handleClick = async () => {
        try {
            await signOut();
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchAllContacts()
        fetchAllChatPartners()
    }, [])

    useEffect(() => {
        const savedTab = localStorage.getItem("contacts");

        if (savedTab !== null) {
            setContacts(JSON.parse(savedTab));
        }
    }, []);

    useEffect(() => {
        const savedChatPartner = localStorage.getItem("selectedChatPartner")

        if (savedChatPartner) {
            setSelectedChatpartner(savedChatPartner)
            handleChatPartnerClick(savedChatPartner)
        }
    }, [])



    const handleContactClick = () => {
        setContacts(true)
        localStorage.setItem("contacts", JSON.stringify(true));
    }
    const handleChatClick = () => {
        setContacts(false)
        localStorage.setItem("contacts", JSON.stringify(false));
    }


    const fetchAllContacts = async () => {
        try {
            const res = await fetch("/api/messages/get-contacts")
            const data = await res.json()
            setAllContacts(data.users)
            // console.log("contacts: ", data.users)
        } catch (error) {
            console.log("Error to fetch all contacts , error: ", error)
        }
    }

    const fetchAllChatPartners = async () => {
        try {
            const res = await fetch("/api/messages/get-chat-partners")
            const data = await res.json()
            setAllChatPartners(data.users)
            // console.log("Chats: ", data.users)
        } catch (error) {
            console.log("Error to fetch all chat partners , error: ", error)
        }
    }

    useEffect(() => {
        fetchAllChatPartners()
        fetchAllContacts()
    }, [contacts])

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


    const handleChatPartnerClick = async (chatPartnerId) => {
        localStorage.setItem("selectedChatPartner", chatPartnerId)
        setSelectedChatpartner(chatPartnerId)
        const res = await fetch(`/api/messages/${chatPartnerId}`)
        const data = await res.json()

        setChatMessages(data.messages)
        const response = await fetch(`/api/fetch-partner-dp/${chatPartnerId}`)
        if (!response.ok) {
            console.log("Request failed");
            return;
        }
        const data2 = await response.json()
        setChatPartnerPic(data2.pic)
        setChatPartnerName(data2.name)

        setStart(false)

    }

    const handleChatPartnerClickSmall = (id) => {
        router.push(`/${id}`)
        console.log("Small clicked")
    }

    useEffect(() => {

        const handleReceiveMessage = (newMessage) => {

            console.log(
                "Received:",
                newMessage
            );

            if (
                newMessage.senderId === selectedChatpartner
            ) {

                setChatMessages(prev => [
                    ...prev,
                    newMessage
                ]);

            }

        };

        socket.on(
            "receiveMessage",
            handleReceiveMessage
        );

        return () => {

            socket.off(
                "receiveMessage",
                handleReceiveMessage
            );

        };

    }, [selectedChatpartner]);

    const handleSentClick = async (id) => {
        console.log("id: ", id)
        setMessageSending(true)
        try {
            const res = await fetch(`/api/messages/send-message/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type":
                        "application/json",
                },
                body: JSON.stringify({
                    text: message,
                    image: selectedImage
                })
            })
            const data = await res.json();

            if (!res.ok) {
                toast(data.error);
                return;
            }

            socket.emit(
                "sendMessage",
                data.newMessage
            );

            setChatMessages(prev => [
                ...prev,
                data.newMessage
            ]);

            setMessage("");
            setSelectedImage(null);
            // toast("Message sent successfully");
            setMessageSending(false)
        } catch (error) {
            console.log("error: ", error.message)
            toast("failed to sent message")
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

    const handleProfileClick = () => {
        router.push("/profile")
    }

    const handleCrossClick = () => {
        setStart(true)
        console.log("strat clicked")
        console.log("Value: ", start)
    }

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    const handleChatClick22 = (id) => {
        if (window.innerWidth < 640) {
            console.log("small")

            console.log("ID:", id)
            router.push(`/chat/${id}`);
        } else {
            console.log("Big")
            handleChatPartnerClick(id);
        }
    };



    return (
        <div className="min-h-screen  w-screen flex overscroll-none overflow-hidden scroll-none">

            {/* ------- Left side ------- */}
            <div className='w-screen sm:w-[35%] xl:w-[30%] flex flex-col h-full bg-slate-900/70 backdrop-blur-xl border-r border-slate-800'>
                <div className="w-full flex justify-between p-3  sm:p-5   xl:px-10 xl:py-5  items-center border-b ">
                    {/* <div 
                    
                    className='flex w-full justify-between items-center cursor-pointer  p-4 rounded-lg '> */}
                    <div
                        onClick={handleProfileClick}
                        className="flex gap-4 items-center   hover:bg-blue-500/9 md:px-0 xl:p-4 rounded-lg cursor-pointer">
                        <div className="h-11 w-11 sm:h-13 sm:w-13 xl:h-15 xl:w-15 rounded-full flex flex-col relative">
                            <img src={profilePic || "/sample.avif"} className="rounded-full h-full w-full object-cover" alt="" />
                        </div>
                        <div>
                            <div className="font-semibold text-sm sm:text-md xl:text-lg" >{props.name}</div>
                            <div className="text-gray-400 text-xs xl:text-sm">Online</div>
                        </div>
                    </div>

                    <div className=" items-center flex sm:hidden xl:flex">
                        <div
                            onClick={handleClick}
                            className='cursor-pointer hover:bg-blue-500/18 p-3 rounded-full'
                        >
                            <LogOut className="h-5 cursor-pointer  " />
                        </div>

                    </div>
                    {/* </div> */}

                </div>
                <div className="w-full flex gap-5 justify-between items-center p-3 sm:p-5 xl:px-8 xl:py-5">
                    <div onClick={handleChatClick} className={`w-[50%] h-9 xl:h-10 rounded-md text-sm xl:text-md flex justify-center items-center hover:text-blue-300 hover:bg-blue-500/18  cursor-pointer ${contacts ? "bg-blue-500/9  text-blue-200  " : "text-blue-300 bg-blue-500/18 "}`}>Chats</div>
                    <div onClick={handleContactClick} className={`w-[50%] h-9 xl:h-10 rounded-md text-sm xl:text-md flex justify-center items-center hover:text-blue-300 hover:bg-blue-500/18  cursor-pointer ${contacts ? "text-blue-300 bg-blue-500/18  " : "bg-blue-500/9  text-blue-200  "}`}>Contacts</div>
                </div>
                {/* <div className="w-full flex flex-col  h-full"> */}
                <div className="w-full p-3  sm:p-5 pt-0 xl:px-8 xl:pb-8 min-h-0 flex-1 flex flex-col gap-3  overflow-y-auto chat-scroll2 scroll-smooth">
                    {
                        contacts ?

                            <>
                                {
                                    allContacts?.map((contact) => {
                                        return (
                                            <div onClick={() => handleChatClick22(contact._id)} key={contact._id}
                                                className={`h-13 w-full  sm:h-15 xl:h-18 cursor-pointer flex justify-start items-center p-2  sm:p-3 rounded-md bg-blue-500/9   
                                                ${selectedChatpartner === contact._id ?
                                                        "text-blue-300 bg-blue-500/18"
                                                        :
                                                        "bg-blue-500/9  text-blue-200 "}
                                                `}>
                                                <div className="flex gap-2 sm:gap-4 items-center">
                                                    <div className=" h-9 w-9 sm:h-11 sm:w-11 xl:h-12 xl:w-12 rounded-full overflow-hidden flex">
                                                        <img src={contact.image || "./sample.avif"}
                                                            onError={(e) => {
                                                                e.target.src = "/sample.avif";
                                                            }}
                                                            className="h-full w-full object-cover" alt="" />
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-sm xl:text-md" >{contact.name}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }


                            </>
                            :
                            <>
                                <div className="flex flex-col gap-3">
                                    {
                                        allChatPartners?.map((chat) => {
                                            return (
                                                <div
                                                    key={chat._id}
                                                    onClick={() => handleChatClick22(chat._id)}
                                                    className={`w-full h-18 cursor-pointer flex justify-start items-center p-3 rounded-md 
                            ${selectedChatpartner === chat._id ?
                                                            "text-blue-300 bg-blue-500/18  "
                                                            :
                                                            "bg-blue-500/9  text-blue-200 "
                                                        }`}>
                                                    <div className="flex gap-4 items-center">
                                                        <div className="h-12 w-12 rounded-full overflow-hidden flex">
                                                            <img src={chat.image || "./sample.avif"}
                                                                onError={(e) => {
                                                                    e.target.src = "/sample.avif";
                                                                }}
                                                                className="h-full w-full object-cover" alt="" />
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold text-md" >{chat.name}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </>
                    }
                </div>


                {/* </div> */}

                {/* <div className="w-full h-full bg-green-500"></div> */}
                {/* <Button variant="outline" onClick={handleClick}>Sign out</Button> */}

            </div>

            {/* -------- Right side ------- */}
            {
                start ?
                    <>
                        <div className="w-0 sm:w-[65%] xl:w-[70%] h-full hidden sm:flex sm:flex-col justify-center items-center  bg-linear-to-br from-slate-950/50 via-slate-950/30 to-blue-950/20">
                            <MessageCircleMore className="size-15 " />
                            <h1 className="text-2xl font-semibold my-3">Select a conversation</h1>
                            <div className="text-gray-400 ">
                                Choose a contact from the sidebar to start chatting or
                            </div>
                            <div className="text-gray-400 ">
                                continue a previous conversation
                            </div>

                        </div>
                    </> :
                    <>
                        <div className="w-0 hidden sm:w-[70%] h-full sm:flex sm:flex-col justify-between   bg-linear-to-br from-slate-950/50 via-slate-950/30 to-blue-950/20">
                            <div className='w-full flex justify-between items-center p-5 h-20 bg-slate-900/70 backdrop-blur-xl  border-slate-800'>
                                <div className='flex gap-3 items-center'>
                                    <div className="h-11 w-11 xl:h-12 xl:w-12 rounded-full flex flex-col relative">
                                        <img src={chatPartnerPic || "/sample.avif"} className="rounded-full h-full w-full object-cover" alt="" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-md" >{chatPartnerName}</div>
                                        <div className="text-gray-400 text-xs xl:text-sm">Online</div>
                                    </div>
                                </div>
                                <div
                                    onClick={handleCrossClick}
                                    className='cursor-pointer hover:bg-blue-500/18 p-3 rounded-full'
                                >
                                    <X className="h-5 cursor-pointer" />
                                </div>
                            </div>

                            <div
                                ref={chatContainerRef}
                                className="flex-1 overflow-y-auto flex flex-col  chat-scroll px-4 pt-4 xl:px-7 xl:pt-7 scroll-smooth">
                                {
                                    chatMessages?.map((message, index) => {
                                        const currentDate = formatDate(message.createdAt);

                                        const previousDate =
                                            index > 0
                                                ? formatDate(chatMessages[index - 1].createdAt)
                                                : null;

                                        const showDate = currentDate !== previousDate;
                                        return (

                                            <div key={message._id}>
                                                {showDate && (
                                                    <div className="flex justify-center my-4">
                                                        <span className="bg-slate-700 px-2 py-1 xl:px-3 xl:py-1.5 rounded-full text-[10px] xl:text-xs text-gray-200">
                                                            {currentDate}
                                                        </span>
                                                    </div>
                                                )}
                                                <div className={`flex ${message.senderId === session?.user?.id
                                                    ? "justify-end" : "justify-start"
                                                    }
                                            `}>
                                                    <div className={`mb-3 max-w-[60%] ${message.text ? "px-4 py-1.5 pr-14" : "p-0 border-2 border-blue-500/10"}  rounded-lg ${message.senderId === session?.user?.id
                                                        ? "bg-blue-600 text-white" : "bg-slate-800"
                                                        }`}>
                                                        {message.image && (
                                                            <div className="max-w-80 xl:max-w-100 rounded-lg relative">
                                                                <img
                                                                    src={message.image}
                                                                    alt="message"
                                                                    className="full rounded-lg"
                                                                />
                                                                <p className='text-[10px] text-gray-500 absolute bottom-1.5 right-1.5 font-semibold'>
                                                                    {new Date(message.createdAt)
                                                                        .toLocaleTimeString("en-IN", {
                                                                            hour: "numeric",
                                                                            minute: "2-digit",
                                                                            hour12: true,
                                                                        })
                                                                        .replace(":", ".")}</p>
                                                            </div>

                                                        )}

                                                        {message.text && (
                                                            <div className='flex flex-col justify-start items-start w-full relative'>
                                                                <p className='text-sm xl:text-md'>{message.text}</p>
                                                                <p className='text-[7px] sm:text-[10px] text-gray-300 absolute -bottom-1 -right-12'>
                                                                    {new Date(message.createdAt)
                                                                        .toLocaleTimeString("en-IN", {
                                                                            hour: "numeric",
                                                                            minute: "2-digit",
                                                                            hour12: true,
                                                                        })
                                                                        .replace(":", ".")}</p>
                                                            </div>

                                                        )}

                                                    </div>

                                                </div>
                                            </div>



                                        )

                                    })
                                }
                            </div>
                            <div className="fixed
                            bottom-0
                            left-0
                            right-0
                            z-20  px-4 pb-4 xl:px-7 xl:pb-7">
                                <div className="relative">
                                    {
                                        selectedImage && (
                                            <div className="absolute top-[-140] left-5">
                                                <img
                                                    src={selectedImage}
                                                    alt="preview"
                                                    className="w-32 h-32 object-cover rounded-lg"
                                                />

                                                <button
                                                    onClick={() => setSelectedImage(null)}
                                                    className="absolute -top-2 -right-2 bg-blue-500 h-6 w-6 rounded-full text-white cursor-pointer flex justify-center items-center"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        )
                                    }
                                    <button
                                        disabled={messageSending || imageLoading}
                                        className="flex disabled:opacity-50 group justify-center items-center absolute left-2 top-1/2 -translate-y-1/2 hover:bg-blue-400 rounded-full h-10 w-10 hover:text-black">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            ref={fileInputRef}
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />

                                        <Plus
                                            onClick={() => fileInputRef.current?.click()}
                                            className="h-7 w-7 cursor-pointer text-slate-400 group-hover:text-black "
                                        />
                                    </button>
                                    <Input
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Type a message"
                                        className="h-13 rounded-full pl-13 pr-12 focus-visible:ring-0 focus-visible:ring-offset-0"
                                    />

                                    <button
                                        disabled={messageSending || imageLoading}

                                        onClick={() => handleSentClick(selectedChatpartner)}
                                        className={`group absolute right-2 top-1/2 -translate-y-1/2 flex justify-center items-center hover:bg-blue-400 disabled:hover:bg-transparent h-10 w-10 rounded-full hover:text-black cursor-pointer  disabled:cursor-not-allowed`}>
                                        {
                                            imageLoading || messageSending ? (
                                                <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                                            ) : (
                                                <SendHorizontal
                                                    className="h-7 w-7 text-slate-400 group-hover:text-black"
                                                />
                                            )
                                        }
                                    </button>
                                </div>
                            </div>


                        </div>
                    </>
            }



        </div>
    )
}

export default Dashbord
