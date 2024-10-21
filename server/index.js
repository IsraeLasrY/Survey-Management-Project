const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const cookieSession = require("express-session");
const MongoStore = require("connect-mongo");

// Load environment variables from the appropriate .env file
const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";
require("dotenv").config({ path: envFile });

require("./models/User"); // Load User model
require("./services/passport"); // Initialize Passport

const authRoutes = require("./routes/authRoutes"); // Import auth routes

const app = express();

// Use cookie-session middleware
app.use(
  cookieSession({
    secret: process.env.COOKIE_KEY, // Use COOKIE_KEY as the session secret
    resave: false, // Prevents session from being saved back to the store if not modified
    saveUninitialized: false, // Only saves session if something is stored
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
      httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
      secure: process.env.NODE_ENV === "production", // Only use HTTPS in production
    },
  })
);

// Initialize Passport and session management
app.use(passport.initialize());
app.use(passport.session());

// Use authentication routes
app.use(authRoutes);

console.log("hi");
// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
