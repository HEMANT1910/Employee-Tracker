require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");
const userRoutes = require("./routes/userRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

// Database
connectDB();

// Allowed frontend URLs
const allowedOrigins = [
  "http://localhost:5173",
  "https://task-manager-sepia-sigma.vercel.app",
  "https://romantic-cat-production-5075.up.railway.app"
];

// CORS
app.use(
  cors({
    origin: function (origin, callback) {
      // allow Postman/server-to-server requests too
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS blocked"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
);

// Body parser
app.use(express.json());

// Health route
app.get("/", (req, res) => {
  res.send("Server Running");
});

// API routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", projectRoutes);
app.use("/api", taskRoutes);
app.use("/api", dashboardRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    success: false,
    message: err.message || "Server Error"
  });
});

// Railway-compatible port
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
