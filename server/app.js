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
  "https://romantic-cat-production-5075.up.railway.app",
  "https://employee-tracker-production-7736.up.railway.app"
];

const corsOptions = {
  origin: (origin, callback) => {
    console.log("Request Origin:", origin);

    // Allow requests without origin (Postman/server requests)
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.log(`Blocked by CORS: ${origin}`);
    return callback(new Error(`CORS blocked: ${origin}`));
  },

  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

  allowedHeaders: [
    "Content-Type",
    "Authorization"
  ],

  credentials: true
};

// CORS middleware
app.use(cors(corsOptions));

// Handle preflight OPTIONS requests
app.options(/.*/, cors(corsOptions));

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

// Global error handler
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
