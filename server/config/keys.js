const mongo = require("mongoose");

module.exports = {
  mongoURI: process.env.MONGO_URI,
  googleclientID: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  cookikey: process.env.COOKIKEY,
};
