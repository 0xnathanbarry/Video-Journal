import React, { useRef, useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const mic = new SpeechRecognition();

mic.continuous = true;
mic.interimResults = true;
mic.lang = "en-US";
let data = [];
let count = 0;
let interval;
let noteLength = [];
let wordsPerEachSecond = [];
let liveNoteLength = 0;
let wordTimeStamps = [];

function App() {
  const videoEl = useRef(null);
  const recordedEl = useRef(null);

  const [recorded, setRecorded] = useState(false);
  const [currentlyRecording, setCurrentlyRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!videoEl) {
      return;
    }
    try {
      const getStream = async () => {
        let stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        let video = videoEl.current;
        video.srcObject = stream;
        video.play();
      };
      getStream();
    } catch (err) {
      console.log(err);
    }
  }, [videoEl]);

  const startRecording = async () => {
    try {
      setMediaRecorder(new MediaRecorder(videoEl.current.srcObject));
      setCurrentlyRecording(true);
      mic.start();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!mediaRecorder) {
      return;
    }
    mediaRecorder.start(100);

    mediaRecorder.ondataavailable = (event) => data.push(event.data);
    console.log("recording");
  }, [mediaRecorder]);

  useEffect(() => {
    if (currentlyRecording) {
      mic.onresult = (e) => {
        const transcript = Array.from(e.results)
          .map((res) => {
            return res[0];
          })
          .map((res) => res.transcript)
          .join("");
        setNote(transcript);
        liveNoteLength = transcript.split(" ").length;
      };
    }
  }, [currentlyRecording]);

  const countWordsPerSecond = () => {
    count++;
    console.log(`${count} second has passed`);
    noteLength.push(liveNoteLength);
    console.log(noteLength);
    wordsPerEachSecond.push(
      noteLength[noteLength.length - 1] - noteLength[noteLength.length - 2]
    );
    console.log(wordsPerEachSecond);
  };

  useEffect(() => {
    if (currentlyRecording) {
      interval = setInterval(() => countWordsPerSecond(), 1000);
    }
  }, [currentlyRecording]);

  const stopRecording = () => {
    mediaRecorder.stop();
    mic.stop();
    videoEl.current.srcObject.getTracks().forEach((track) => track.stop());
    clearInterval(interval);
    let blob = new Blob(data, {
      type: "video/webm",
    });
    setRecorded(!recorded);
    let recording = recordedEl.current;
    recording.src = URL.createObjectURL(blob);
    console.log(note.split(" "));

    let seconds = 0;
    let pastWordsNumber = 0;
    let words;
    wordsPerEachSecond.forEach((number) => {
      seconds++;
      if (number) {
        words = note
          .split(" ")
          .slice(pastWordsNumber, pastWordsNumber + number);
        words.forEach((word) => {
          wordTimeStamps.push([word, seconds]);
        });
        pastWordsNumber += number;
        console.log(words, seconds);
      }
    });
    console.log(wordTimeStamps);
  };

  return (
    <Grid container>
      <Grid item xs={false} sm={2}></Grid>
      <Grid column="true" item xs={12} sm={8}>
        <Grid item>
          {recorded === false ? (
            <>
              <video ref={videoEl} autoPlay muted />
              <video ref={recordedEl} controls hidden />
            </>
          ) : (
            <>
              <video ref={videoEl} autoPlay muted hidden />
              <video ref={recordedEl} controls />
            </>
          )}
        </Grid>
        <Grid item>
          {currentlyRecording === false && recorded === false ? (
            <Button variant="contained" onClick={() => startRecording()}>
              Start recording
            </Button>
          ) : null}
          {currentlyRecording === true && recorded === false ? (
            <Button variant="contained" onClick={() => stopRecording()}>
              Stop Recording
            </Button>
          ) : null}
        </Grid>
        <Grid item>
          {!recorded ? (
            <Typography>{note}</Typography>
          ) : (
            <Typography>
              {wordTimeStamps.map((grouping, index) => (
                <Link
                  color="inherit"
                  key={index}
                  onClick={() => {
                    recordedEl.current.currentTime =
                      grouping[1] - 2 > 0 ? grouping[1] - 2 : 0;
                  }}
                >
                  {grouping[0] + " "}
                </Link>
              ))}
            </Typography>
          )}
        </Grid>
      </Grid>
      <Grid item xs={false} sm={2}></Grid>
    </Grid>
  );
}

export default App;
