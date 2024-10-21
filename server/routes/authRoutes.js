const express = require("express");
const passport = require("passport");

const router = express.Router();

// Route to initiate Google OAuth login
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Callback route after Google OAuth login
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/profile"); // Redirect to profile page on successful login
  }
);

// Route to display the logged-in user's profile
router.get("/profile", (req, res) => {
  if (!req.user) {
    return res.redirect("/auth/google"); // Redirect to login if not authenticated
  }
  res.send(req.session);
});

// Logout route to end the session
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).send("Logout failed.");
    }
    res.send("You are logged out!");
  });
});

module.exports = router;
