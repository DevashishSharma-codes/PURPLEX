import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import cors from "cors";
import morgan from "morgan";
const app = express();


app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
}));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/auth", authRouter);



app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
  });
});

export default app;
