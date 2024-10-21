const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const User = require("../models/User"); // Import the User model

// Serialize user into session (stores user ID in session)
passport.serializeUser((user, done) => {
  done(null, user.id); // `user.id` is the MongoDB ID of the user
});

// Deserialize user from session (retrieves user by ID)
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id); // Look up user by ID
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Configure Google OAuth strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      proxy: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if the user already exists in the database
        let existingUser = await User.findOne({ googleId: profile.id });

        if (existingUser) {
          // User found, return the user
          return done(null, existingUser);
        }

        // Create a new user if not found
        const newUser = await new User({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
        }).save();

        done(null, newUser);
      } catch (err) {
        done(err, null);
      }
    }
  )
);
