const mongoose = require("mongoose");
const { dbConfig } = require("./vars");

mongoose.connect(dbConfig.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("MongoDB connected successfully.");
});

module.exports = db;
