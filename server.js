


const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("./configuration/connection");
const userRouter = require("./router/userRoutes");
const passport = require("passport");
const passportConfig = require("./configuration/passportConfig");
const authRoute = require("./router/authRoutes");
const session = require("express-session");
const mentorRouter = require("./router/mentorRoutes");
const adminRouter = require("./router/adminRoutes");
const studentRouter = require("./router/studentRoutes");
const messageRoutes = require("./router/messagesRoutes");
const http = require("http");
const { Server } = require("socket.io");
const Razorpay =require("razorpay")
const razorpayRoutes=require("./router/razorpayRoutes")
const createAdmin =require("./CreateAdmin/admin")
const app = express();
const server = http.createServer(app);
const notificationRouter = require("./router/notificationRoutes");

require('dotenv').config();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));// app.use(
  


app.use(
  cors({
    origin:"https://master.d298fqlts9wdsx.amplifyapp.com", 
    credentials: true, 
    methods: ["GET", "POST", "PUT", "DELETE","OPTIONS"], // Allowed request methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
    exposedHeaders: ["Content-Length", "Content-Type", "Authorization"], // ✅ Expose headers properly

  })
);
createAdmin()
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoute);
app.use("/api/auth", adminRouter);
app.use("/api/auth", messageRoutes,notificationRouter);
app.use("/api/auth", userRouter, mentorRouter, studentRouter,razorpayRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: "An unexpected error occurred" });
});

const io = new Server(server, {
  cors: {
    origin:"https://master.d298fqlts9wdsx.amplifyapp.com",
    credentials: true,
  },
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("New user connected:", socket.id);

  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log("User added:", userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      io.to(sendUserSocket).emit("msg-receive", data.message);
    }
  });

  socket.on("disconnect", () => {
    onlineUsers.forEach((value, key) => {
      if (value === socket.id) {
        onlineUsers.delete(key);
      }
    });
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});