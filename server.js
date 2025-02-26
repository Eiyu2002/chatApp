import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import routes from "./routes/authRoutes.js";
import dotenv from 'dotenv'
import cookieparser from 'cookie-parser'


const app = express();
dotenv.config();
app.use(cookieparser());
app.use(
  cors({
    origin: "http://localhost:5173",
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
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`cliente conectado ${socket.id}`);
  io.emit("userid", {userid: socket.id})

  socket.on("mensaje", ({ menssage, userMenssage, username }) => {
    console.log(`Mensaje recibido: ${menssage}`);

    io.emit("mensaje", { menssage, userMenssage, username });
  });
});

server.listen(3000, () => {
  console.log("servidor ejecutandose");
});
