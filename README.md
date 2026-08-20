# Chatify 💬

**Chatify** is a full-stack, real-time messaging platform where users can create an account, verify their email, and start chatting with other users.

The platform includes a dedicated **contacts section and chat section**, real-time messaging, and image sharing for a smooth communication experience.

## 🌐 Live Demo

**[Chatify — Live Website](https://dipak-chatify.vercel.app/)**

## ✨ Features

* 🔐 User registration & authentication
* 📧 Email verification
* 💬 Real-time messaging
* 👥 Contacts management
* 🖼️ Image sharing
* ⚡ Live chat using Socket.IO
* 🛡️ Rate limiting & bot protection
* 🔒 Secure password handling
* 📱 Responsive chat interface
* 🤖 AI integration
* 🔔 Toast notifications

## 🛠️ Tech Stack

* **Next.js 16 & React 19** – Full-stack web application
* **MongoDB + Mongoose** – Database
* **NextAuth.js** – Authentication & sessions
* **Socket.IO** – Real-time communication
* **Cloudinary** – Image upload & storage
* **Resend** – Email verification
* **Arcjet** – Security, rate limiting & bot protection
* **OpenAI AI SDK** – AI integration
* **Tailwind CSS & DaisyUI** – Styling & UI
* **Shadcn UI / Radix UI** – UI components
* **Lucide React** – Icons
* **React Email** – Email templates
* **Sonner** – Notifications
* **bcryptjs** – Password hashing

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/dipakbera07/chatify.git
cd chatify
npm install
```

### 2. Environment Variables

Create a `.env.local` file:

```env
MONGODB_URI=Enter_your_MongoDB_URL
NEXTAUTH_SECRET=Enter_your_NextAuth_Secret

RESEND_API_KEY=Enter_your_Resend_API_Key

ARCJET_KEY=Enter_your_Arcjet_Key
ARCJET_ENV=development

EMAIL_USER=Enter_your_Email
EMAIL_PASS=Enter_your_Email_App_Password

CLOUDINARY_CLOUD_NAME=Enter_your_Cloudinary_Cloud_Name
CLOUDINARY_API_KEY=Enter_your_Cloudinary_API_Key
CLOUDINARY_API_SECRET=Enter_your_Cloudinary_API_Secret

NEXT_PUBLIC_SOCKET_URL=Enter_your_Socket_Server_URL
```

Add your own MongoDB, Resend, Arcjet, Cloudinary, email, and Socket.IO credentials.

> ⚠️ Never commit `.env.local` or any API keys, passwords, or secrets to GitHub.

### 3. Run the Project

```bash
npm run dev
```

Open **http://localhost:3000** in your browser.

## 🎯 Purpose

Built as an advanced full-stack project to practice **real-time communication, authentication, email verification, image uploads, security, database integration, and modern web development**.

**Developed by Dipak Bera**
