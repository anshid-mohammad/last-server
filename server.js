// // const express = require("express");
// // const cors = require("cors");
// // const dotenv = require("dotenv");
// // const mongoose = require("./configration/connection");
// // const userRouter = require("./router/userRoutes");
// // const passport = require("passport");
// // const passportConfig = require("./configration/passportConfig");
// // const authRoute = require("./router/authRoutes");
// // const session = require("express-session");
// // const mentorRouter = require("./router/mentorRoutes");
// // const adminRouter = require("./router/adminRoutes");
// // const studentRouter = require("./router/studentRoutes");
// // // const storeFiles=require("./files/storeFiles")
// // const createAdmin = require("./CreateAdmin/admin");
// // const sampleFiles = require("./files/sampleFile");
// // const messageRoutes = require("./router/messagesRoutes");
// // const http = require("http"); // ✅ Required for WebSocket server
// // const { Server } = require("socket.io"); // ✅ Corrected socket.io import

// // const app = express();
// // const server = http.createServer(app); // ✅ Create HTTP server

// // app.use(express.json());
// // app.use(
// //   cors({
// //     origin: "http://localhost:3000",
// //     credentials: true, // ✅ Fixed typo (was "credential")
// //   })
// // );

// // app.use(
// //   session({
// //     secret: "your_secret_key", // Secret key for signing the session cookie
// //     resave: false, // Forces the session to be saved back to the store, even if it wasn't modified
// //     saveUninitialized: false, // Prevents storing empty sessions
// //     cookie: { secure: false }, // Set `secure: true` if you're using HTTPS
// //   })
// // );

// // createAdmin();

// // // Initialize Passport and session handling
// // app.use(passport.initialize());
// // app.use(passport.session());

// // app.use("/auth", authRoute);
// // app.use("/api/auth", adminRouter);
// // app.use("/api/auth", messageRoutes);
// // app.use("/api/auth", userRouter, mentorRouter, studentRouter);

// // app.use((err, req, res, next) => {
// //   console.error(err.stack);
// //   res.status(500).send({ message: "An unexpected error occurred" });
// // });

// // // ✅ Fixed WebSocket (Socket.io) Initialization
// // const io = new Server(server, {
// //   cors: {
// //     origin: "http://localhost:3000",
// //     credentials: true,
// //   },
// // });

// // global.onlineUsers = new Map();

// // io.on("connection", (socket) => {
// //   console.log("New user connected:", socket.id);

// //   socket.on("add-user", (userId) => {
// //     onlineUsers.set(userId, socket.id);
// //     console.log("User added:", userId, socket.id);
// //   });

// //   socket.on("send-msg", (data) => {
// //     const sendUserSocket = onlineUsers.get(data.to);
// //     if (sendUserSocket) {
// //       io.to(sendUserSocket).emit("msg-receive", data.message);
// //     }
// //   });

// //   socket.on("disconnect", () => {
// //     onlineUsers.forEach((value, key) => {
// //       if (value === socket.id) {
// //         onlineUsers.delete(key);
// //       }
// //     });
// //     console.log("User disconnected:", socket.id);
// //   });
// // });

// // // Start Server
// // const PORT = process.env.PORT || 5000;
// // server.listen(PORT, () => {
// //   console.log(`Server running on http://localhost:${PORT}`);
// // });
// const express = require("express");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const mongoose = require("./configration/connection");
// const userRouter = require("./router/userRoutes");
// const passport = require("passport");
// const passportConfig = require("./configration/passportConfig");
// const authRoute = require("./router/authRoutes");
// const session = require("express-session");
// const mentorRouter = require("./router/mentorRoutes");
// const adminRouter = require("./router/adminRoutes");
// const studentRouter = require("./router/studentRoutes");
// const messageRoutes = require("./router/messagesRoutes");
// const http = require("http");
// const { Server } = require("socket.io");
// const Razorpay =require("razorpay")
// const razorpayRoutes=require("./router/razorpayRoutes")
// const createAdmin =require("./CreateAdmin/admin")
// const app = express();
// const server = http.createServer(app);

// app.use(express.json());
// // app.use(
  
// //   cors({
// //     origin: "https://master.d2ci0ejc8a8mur.amplifyapp.com",
// //     credentials: true,
// //   })
// // );

// const allowedOrigins = [
//   "http://localhost:3000", 
//   "https://master.d2ci0ejc8a8mur.amplifyapp.com", 
//   "https://zstyleinat.xyz"
// ];

// app.use(cors({
//   origin: allowedOrigins, // Allow frontend and backend domain
//   credentials: true, // Allow cookies and authentication headers
//   methods: ["GET", "POST", "PUT", "DELETE"], // Allowed request methods
//   allowedHeaders: ["Content-Type", "Authorization"] // Allowed headers
// }));
// createAdmin()
// app.use(
//   session({
//     secret: "your_secret_key",
//     resave: false,
//     saveUninitialized: false,
//     cookie: { secure: false },
//   })
// );

// app.use(passport.initialize());
// app.use(passport.session());

// app.use("/auth", authRoute);
// app.use("/api/auth", adminRouter);
// app.use("/api/auth", messageRoutes);
// app.use("/api/auth", userRouter, mentorRouter, studentRouter,razorpayRoutes);

// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send({ message: "An unexpected error occurred" });
// });

// const io = new Server(server, {
//   cors: {
//     origin: "https://master.d2ci0ejc8a8mur.amplifyapp.com",
//     credentials: true,
//   },
// });

// global.onlineUsers = new Map();

// io.on("connection", (socket) => {
//   console.log("New user connected:", socket.id);

//   socket.on("add-user", (userId) => {
//     onlineUsers.set(userId, socket.id);
//     console.log("User added:", userId, socket.id);
//   });

//   socket.on("send-msg", (data) => {
//     const sendUserSocket = onlineUsers.get(data.to);
//     if (sendUserSocket) {
//       io.to(sendUserSocket).emit("msg-receive", data.message);
//     }
//   });

//   socket.on("disconnect", () => {
//     onlineUsers.forEach((value, key) => {
//       if (value === socket.id) {
//         onlineUsers.delete(key);
//       }
//     });
//     console.log("User disconnected:", socket.id);
//   });
// });

// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("./configration/connection");
const session = require("express-session");
const passport = require("passport");
const passportConfig = require("./configration/passportConfig");
const http = require("http");
const { Server } = require("socket.io");
const Razorpay = require("razorpay");

// Routers
const userRouter = require("./router/userRoutes");
const authRoute = require("./router/authRoutes");
const mentorRouter = require("./router/mentorRoutes");
const adminRouter = require("./router/adminRoutes");
const studentRouter = require("./router/studentRoutes");
const messageRoutes = require("./router/messagesRoutes");
const razorpayRoutes = require("./router/razorpayRoutes");
const createAdmin = require("./CreateAdmin/admin");

dotenv.config(); // Load environment variables

const app = express();
const server = http.createServer(app);

// ✅ CORS Configuration
const allowedOrigins = [
  "http://localhost:3000",
  "https://master.d2ci0ejc8a8mur.amplifyapp.com",
  "https://zstyleinat.xyz",
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// ✅ Handle preflight OPTIONS requests
app.options("*", cors());

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || "your_secret_key",
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === "production" }, // Secure cookies in production
}));

app.use(passport.initialize());
app.use(passport.session());

// ✅ Create Admin on startup
createAdmin();

// ✅ Routes
app.use("/auth", authRoute);
app.use("/api/auth", adminRouter);
app.use("/api/auth", messageRoutes);
app.use("/api/auth", userRouter, mentorRouter, studentRouter, razorpayRoutes);

// ✅ Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({ message: "An unexpected error occurred" });
});

// ✅ Socket.io Setup
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
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

// ✅ Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
