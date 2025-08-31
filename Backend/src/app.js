import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import studentRoutes from "./routes/student.routes.js";

const app = express();

// CORS configuration
const allowedOrigins = [
  "http://localhost:5173",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Health check route
app.get("/healthchecker", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is working fine",
    timestamp: new Date().toISOString(),
  });
});

// Student routes
app.use("/api/students", studentRoutes);

export { app };
