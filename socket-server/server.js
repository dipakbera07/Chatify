import { createServer } from "http";
import { Server } from "socket.io";

const PORT = process.env.PORT || 5001;

const httpServer = createServer();

const io = new Server(httpServer, {
    cors: {
        origin: "*",
    },
});

io.on("connection", (socket) => {

    console.log("Connected:", socket.id);

    socket.on("join", (userId) => {

        socket.join(userId);

        console.log(`${userId} joined room`);

    });

    socket.on("sendMessage", (message) => {

        console.log("Message Received:", message);

        io.to(message.receiverId)
            .emit("receiveMessage", message);

    });

    socket.on("disconnect", () => {

        console.log("Disconnected:", socket.id);

    });

});

httpServer.listen(PORT, () => {
    console.log(`Socket server running on port ${PORT}`);
});