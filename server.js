import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

const app = express();
app.use(cors("http://localhost:5173"));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`cliente conectado ${socket.id}`);

  socket.on("mensaje", (data) => {
    console.log(`Mensaje recibido: ${data}`);

    io.emit("mensaje", data);
  });
});

server.listen(3000, () => {
  console.log("servidor ejecutandose");
});
