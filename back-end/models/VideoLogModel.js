const mongoose = require("mongoose");

const videoLog = new mongoose.Schema({
  videoBlob: {
    type: Object,
    required: true,
  },
  transcription: {
    type: Object,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("videolog", videoLog);
