// index.js
const express = require("express");
const passport = require("passport");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieSession = require("cookie-session");
require("dotenv").config();
require("./models/User");
require("./services/passport");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(
  coockieSession({
    name: "session", // Name of the cookie
    maxAge: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    keys: [process.env.COOKIE_KEY || "your-fallback-secret-key"], // Secret to sign cookies
    httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Define Routes
app.get("/api", (req, res) => {
  res.send({ message: "Hello from the backend!" });
});

// Start the Server
require("./routes/authRoutes")(app);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
