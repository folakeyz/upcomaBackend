const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const fileupload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");
const socket = require("socket.io");
const errorHandler = require("./middleware/error");
const connectDB = require("./config/db");

// Routes Files
const user = require("./routes/User");
const song = require("./routes/Song");
const genre = require("./routes/Genre");
const trending = require("./routes/Trending");
const event = require("./routes/Event");
const booking = require("./routes/Booking");
const album = require("./routes/Album");
const beat = require("./routes/Beat");
const playlist = require("./routes/Playlist");
const competiton = require("./routes/Competiton");
const comedy = require("./routes/Comedy");
const dj = require("./routes/DJ");
const stream = require("./routes/Stream");
const banner = require("./routes/Banner");
const analytics = require("./routes/Analytics");
const service = require("./routes/Service");
const chat = require("./routes/Chat");

//load env vars
dotenv.config({ path: "./config/.env" });

//connect to database
connectDB();

const app = express();

//Boy Parser
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
//file uploads
app.use(fileupload());

//Sanitize data
app.use(mongoSanitize());

//set security headers
app.use(
  helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false })
);

// Prevent XSS attacks
app.use(xss());

//Rate limiting
// const limiter = rateLimit({
//   windowMs: 60 * 60 * 1000, // 60 mins
//   max: 300,
// });
// app.use(limiter);

//prevent http param pollution
app.use(hpp());

//enable CORS
app.use(cors());

//Mount Routers

app.use("/api/v1/auth/", user);
app.use("/api/v1/song/", song);
app.use("/api/v1/genre/", genre);
app.use("/api/v1/trending/", trending);
app.use("/api/v1/event/", event);
app.use("/api/v1/booking/", booking);
app.use("/api/v1/album/", album);
app.use("/api/v1/beat/", beat);
app.use("/api/v1/playlist/", playlist);
app.use("/api/v1/competition/", competiton);
app.use("/api/v1/comedy/", comedy);
app.use("/api/v1/dj/", dj);
app.use("/api/v1/stream/", stream);
app.use("/api/v1/banner/", banner);
app.use("/api/v1/analytics/", analytics);
app.use("/api/v1/service/", service);
app.use("/api/v1/chat/", chat);

app.use(errorHandler);

//Set static folder
app.use(express.static(path.join(__dirname, "public")));

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "public/index.html"), function (err) {
    if (err) {
      res.status(500).send(err);
    }
  });
});

const PORT = process.env.PORT || 8000;
const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow
  )
);

//Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // close Server & exit Process

  server.close(() => process.exit(1));
});

const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    console.log(data.receiver, "rec");
    const sendUserSocket = onlineUsers.get(data.receiver);
    console.log(sendUserSocket, "send");
    if (sendUserSocket) {
      console.log("Yes");
      socket.to(sendUserSocket).emit("msg-receive", data.message);
    }
  });
});
