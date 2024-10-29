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
import authRoutes, {authenticateToken} from "./routes/auth_user.mjs";


// GAPHQL
import { graphqlHTTP } from 'express-graphql';
const visual = true; // SET IT TO FALSE ONDER PRODUCTION!
//import schema from './graphql/graphschema.mjs';
/**
 * vreate graphql schema in the separate file in graphql/graphschema
 */
import {GraphQLSchema} from "graphql";
import RootQueryType from "./graphql/root.mjs";
import RootMutationType from './graphql/root_mutation.mjs';




//import users from "./models/users.mjs"

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
    console.log(`Client ${socket.id} joined room: ${room}`);
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


// Parse application/json
app.use(bodyParser.json());

app.disable('x-powered-by');

app.set("view engine", "ejs");

// middelwear showing working route
app.use((req, res, next) => {
  console.log(req.method);
  console.log(req.path);
  next();
});

app.use(express.static(path.join(process.cwd(), "public")));

app.use(express.json()); // in plase of bodyParser.urlencoded and bodyParser.json


// don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
}

app.use('/auth', authRoutes); // Use auth routes under '/auth'

// FOR GRAPHQL: import in the begint
const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType   
});

//use authentication in the users request
//app.use('/graphql', authenticateToken, (req, res, next) => {// USE IF ALL WORKS
app.use('/graphql', (req, res, next) => {
    req.socket = io; // Assuming `io` is your Socket.IO server instance
    next();
}, graphqlHTTP({
  schema: schema,
  graphiql: visual, // Visual är satt till true under utveckling
  livereload: true, // watch code chenges
  context: { socket: req.socket },// pass socket to graphQL
  customFormatErrorFn: (error) => {
    // Customize error response
    return {
      message: error.message,
      locations: error.locations,
      path: error.path,
      // Add any additional custom fields if necessary
    };
  },
}));

// Add routes for 404 and error handling
// Catch 404 and forward to error handler
// Put this last
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
