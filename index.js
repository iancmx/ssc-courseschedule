const mongoose = require("mongoose");
const updateDB = require("./src/updateDB");

const mongoDB =
  "mongodb+srv://iancmx:3l1te_1414@ssc-xkg4y.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(mongoDB, { useNewUrlParser: true });

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));

db.once("open", function () {
  // we're connected!
  console.log("Connected to SSC cluster on MongoDB Atlas");
  updateDB.updateDB("2019", "W");
});
