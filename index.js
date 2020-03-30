const mongoose = require("mongoose");
const updateDB = require("./src/updateDB");

mongoose.connect(process.env.MONGO_CONNECTION_STRING, {
  useNewUrlParser: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));

db.once("open", function () {
  // we're connected!
  console.log("Connected to SSC cluster on MongoDB Atlas");
  updateDB.updateDB("2019", "W");
});
