import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import path from "path";
import http from "http";
import { fileURLToPath } from "url";
import { Server } from "socket.io";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import chatRoutes from "./routes/chat.js";
import messageRoutes from "./routes/message.js";
import socketIo from "./socket.js";

const app = express();
export const server = http.createServer(app);

// import User from "./models/User.js";
// import Post from "./models/Post.js";
// import { users, posts } from "./data/index.js";

// Configurations
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
// const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

// cloudinary setup
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// socket.io setup
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
  },
});

// saving images in local
// app.use("/assets", express.static(path.join(__dirname, "public/assets")));

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/chat", chatRoutes);
app.use("/message", messageRoutes);

// Mongoose setup
const mongoUri = process.env.MONGO_URI;
// const localUri = "mongodb://localhost:27017/snap-shot";
const PORT = process.env.PORT || 5001;
mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Mongodb Connected");
    server.listen(3001, () => {
      console.log(`Server listening on port ${PORT}`);
    });

    // User.insertMany(users);
    // Post.insertMany(posts);
  })
  .then(() => {
    socketIo(io);
  })
  .catch((error) => console.log(error.message));

export default server;
