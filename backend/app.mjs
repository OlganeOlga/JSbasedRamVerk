// Import necessary modules
import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import cors from 'cors';
import morgan from 'morgan';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import roomState from "./models/socket.mjs";
import comments from "./models/comments.mjs";
import mongoRemote from "./routes/mongoRemote.mjs";
import authRoutes from "./routes/auth_user.mjs";

// Set up the Express app
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Allow requests from any origin
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Parse JSON bodies
app.use(express.static(path.join(process.cwd(), "public"))); // Serve static files
app.use(morgan('combined')); // Log requests in the Apache style

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("create", async (room) => {
    await socket.join(room);
    socket.currentRoom = room;
    console.log("Joined room:", room);

    try {
      const docComments = await comments.getComments(room);
      socket.emit("newComment", docComments); // Send existing comments to the new client

      const data = await roomState.getRoomState(room);
      if (data) {
        socket.emit("socketJoin", data); // Emit current room state
      }
    } catch (error) {
      console.error("Error in create event:", error);
    }
  });

  socket.on("update", (data) => {
    socket.to(socket.currentRoom).emit("content", data); // Emit the updated content to all clients in the room
  });

  socket.on("comment", (data) => {
    comments.addComment(socket.currentRoom, data.comment, data.caretPosition.caret, data.caretPosition.line);
    socket.to(socket.currentRoom).emit("newComment", data); // Broadcast new comment to others in the room
  });

  socket.on("disconnect", async () => {
    console.log("Client disconnected:", socket.id);
    if (socket.currentRoom) {
      const users = io.sockets.adapter.rooms.get(socket.currentRoom);
      if (!users) {
        await roomState.clearRoomState(socket.currentRoom);
        delete roomTimeouts[socket.currentRoom];
      }
    }
  });
});

// Routes
app.use('/data', mongoRemote); // Define routes for MongoDB interactions
app.use('/auth', authRoutes); // Define authentication routes

// Error handling middleware
app.use((req, res, next) => {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// Global error handler
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  res.status(err.status || 500).json({
    "errors": [
      {
        "status": err.status,
        "title": err.message,
        "detail": err.message
      }
    ]
  });
});

// Start the server
const port = process.env.NODE_ENV === 'test' ? process.env.TEST_PORT : process.env.PORT;
const server = httpServer.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

// Export the app and server
export { app, server };
