// index.js
const express = require("express");
const passport = require("passport");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieSession = require("express-session");
require("dotenv").config();
require("./models/User");
require("./services/passport");

const app = express();

// Middleware
app.use(
  cookieSession({
    secret: process.env.COOKIE_KEY, // Use COOKIE_KEY as the session secret
    resave: false, // Prevents session from being saved back to the store if not modified
    saveUninitialized: false, // Only saves session if something is stored
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
      httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
      secure: process.env.NODE_ENV === "production", // Only use HTTPS in production
    },
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

// Start the Server
require("./routes/authRoutes")(app);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
