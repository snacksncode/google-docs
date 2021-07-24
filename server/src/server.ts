import "dotenv/config";
import config from "./config";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import mongoose from "mongoose";
import DocumentModel from "./schemas/Document";

const db_url = `mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@main.jmsb3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
mongoose
  .connect(db_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
    useCreateIndex: true,
  })
  .then((mongoose) => {
    console.log(`Successfully connected to database`);
  })
  .catch((err) => {
    console.error(`Error connecting to database`, err);
  });

// Creating initial server
const httpServer = createServer();
const PORT = config.server.port;
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Socket.io's events
io.on("connection", (socket: Socket) => {
  console.log(`Connected user (id: ${socket.id})`);
  socket.on("get-document", async (documentId: string) => {
    const document = await findOrCreateDocument(documentId);
    if (!document) return;
    socket.join(documentId);
    socket.emit("load-document", (document as any).data);

    socket.on("send-changes", (delta) => {
      socket.broadcast.to(documentId).emit("receive-changes", delta);
    });

    socket.on("save-document", async (data) => {
      await DocumentModel.findByIdAndUpdate(documentId, { data });
    });
  });
  socket.once("disconnect", () => {
    console.log(`Disconnected user (id: ${socket.id})`);
  });
});

// Database and saving of documents
async function findOrCreateDocument(id: string): Promise<typeof DocumentModel | null> {
  const DEFAULT_VALUE_EMPTY_DOC = "";
  // fail check
  if (id == null) return null;
  // try finding the doc
  const document = await DocumentModel.findById(id);
  // if found return to the user
  if (document) return document;
  // if document is not found create new one and return it
  return await DocumentModel.create({ _id: id, data: DEFAULT_VALUE_EMPTY_DOC });
}

httpServer.listen(config.server.port);
