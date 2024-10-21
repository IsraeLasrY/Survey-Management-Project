const mongoose = require("mongoose");

// Define the User schema
const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
    unique: true,
  },
  name: String,
  email: String,
  avatar: String,
});

// Create the User model
const User = mongoose.model("users", userSchema);

module.exports = User;
