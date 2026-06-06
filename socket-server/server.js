import { Server } from "socket.io";

const io = new Server(5001, {
    cors: {
        origin: "http://localhost:3000",
    },
});

io.on("connection", (socket) => {

    console.log("Connected:", socket.id);

    socket.on("join", (userId) => {

        socket.join(userId);

        console.log(`${userId} joined room`);

    });

    // NEW
    socket.on("sendMessage", (message) => {

        console.log("Message Received:", message);

        io.to(message.receiverId)
          .emit("receiveMessage", message);

    });

    socket.on("disconnect", () => {

        console.log("Disconnected:", socket.id);

    });

});

console.log("Socket server running on port 5001");