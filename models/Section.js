const mongoose = require("mongoose");

const Section = new mongoose.Schema({
  subject: String,
  course: String,
  section: String,
  year: Number,
  session: String,
  title: String,
  description: String,
  activity: String,
  creditdf: Boolean,
  credits: Number,
  location: String,
  term: String,
  duration: {
    start: Date,
    end: Date,
  },
  classes: [
    {
      term: String,
      day: String,
      startTime: String,
      endTime: String,
      building: String,
      room: String,
    },
  ],
  instructors: [String],
});

module.exports = mongoose.model("Section", Section);
