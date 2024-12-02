import express from "express";
import cors from "cors";
import connectDb from "./config/db.js";
import dotenv from "dotenv";
import adsRouter from "./routes/adsRoutes.js";
import userRouter from "./routes/userRoutes.js";
import categoryRouter from "./routes/categoryRoutes.js";
import bookmarkRouter from "./routes/bookmarkRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

// Get the filename and directory in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const port = process.env.PORT || 8000;

connectDb();
const app = express();

// middleware
app.use(cors());
app.use(express.json());

// for request timeout
app.use((req, res, next) => {
  res.setTimeout(30000, () => {
    res.status(408).send({ error: "Request timeout" });
  });
  next();
});

app.use(express.static(__dirname + "/public"));
app.use("/uploads", express.static("uploads"));

app.use("/ads", adsRouter);
app.use("/user", userRouter);
app.use("/category", categoryRouter);
app.use("/bookmark", bookmarkRouter);

app.get("/", (req, res) => {
  console.log("Server running");
  res.send("server is running");
});

app.listen(port, () => {
  console.log("server is running");
});
