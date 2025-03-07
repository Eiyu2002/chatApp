import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import routes from "./routes/authRoutes.js";
import dotenv from "dotenv";
import cookieparser from "cookie-parser";
import multer from "multer";
import { dirname} from "path";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const urlsCors = [
  "https://resilient-naiad-27e306.netlify.app",
  "http://localhost:5173",
];

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null,"img" + Date.now());
  },
});

const upload = multer({ storage: storage });

const uploadsDir = "./uploads";
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));
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

app.post("/api/sendImage", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No se envió ningún archivo" });
  }
 
  const fileUrl =
    process.env.NODE_ENV === "production"
      ? `chatapp-production-b82e.up.railway.app/uploads/${req.file.filename} `
      : `http://localhost:3000/api/uploads/${req.file.filename}`;
  res.status(200).json({ fileUrl });
});

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

  socket.on("mensaje", ({ fileUrl, menssage, userMenssage, username }) => {
    console.log(`Mensaje recibido: ${menssage}`);

    io.emit("mensaje", { fileUrl, menssage, userMenssage, username });
  });


});

server.listen(process.env.PORT || 3000, () => {
  console.log("servidor ejecutandose");
});
