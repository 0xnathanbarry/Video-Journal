const express = require("express");

const router = express.Router();

const videoLogModel = require("../models/VideoLogModel");

router.post("/new", (request, response) => {
  const videoLog = new videoLogModel({
    videoBlob: request.body.videoBlob,
    transcription: request.body.transcription,
    title: request.body.title,
  });
  videoLog
    .save()
    .then((data) => {
      response.json(data);
    })
    .catch((error) => {
      response.json(error);
    });
});

module.exports = router;
