import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import routes from "./routes/authRoutes.js";
import dotenv from "dotenv";
import cookieparser from "cookie-parser";

const urlsCors = [
  "https://resilient-naiad-27e306.netlify.app",
  "http://localhost:5173",
];
const app = express();
dotenv.config();
app.use(cookieparser());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || urlsCors.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not Allowed by CORS"));
      }
    },
    methods: "GET, POST, PUT, DELETE",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true,
  })
);
app.use(express.json());

app.use(routes);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || urlsCors.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not Allowed by CORS"));
      }
    },
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`cliente conectado ${socket.id}`);
  io.emit("userid", { userid: socket.id });

  socket.on("mensaje", ({ menssage, userMenssage, username }) => {
    console.log(`Mensaje recibido: ${menssage}`);

    io.emit("mensaje", { menssage, userMenssage, username });
  });
});

server.listen(process.env.PORT || 3000, () => {
  console.log("servidor ejecutandose");
});
