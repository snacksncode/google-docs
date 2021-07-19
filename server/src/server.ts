import { createServer } from "http";
import { Server, Socket } from "socket.io";

const httpServer = createServer();
const PORT = 3001;
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket: Socket) => {
  console.log(`Connected user (id: ${socket.id})`);
  socket.on("send-changes", (delta) => {
    socket.broadcast.emit("receive-changes", delta);
  });
  socket.once("disconnect", () => {
    console.log(`Disconnected user (id: ${socket.id})`);
  });
});

httpServer.listen(PORT);
