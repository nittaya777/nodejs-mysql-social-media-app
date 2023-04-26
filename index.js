import express from "express";
import multer from 'multer'

const app = express();
const port = 8800;

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import commentRoutes from "./routes/comments.js";
import likeRoutes from "./routes/likes.js";
import storyRoutes from "./routes/stories.js";
import relationshipRoutes from "./routes/relationships.js";
import cors from "cors";
import cookieParser from "cookie-parser";

//MIDDLEWARE
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});
app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000"
}));
app.use(cookieParser());

//UPLOAD
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../client-ui/public/upload')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now()+file.originalname)
  }
})

const upload = multer({ storage: storage })
//END UPLOAD
app.use("/api/upload", upload.single("file"),(req,res)=>{
  const file = req.file;
  res.status(200).json(file.filename)
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/relationships", relationshipRoutes);


app.listen(port, () => {
  console.log(`listening on ${port}`);
});
