import React, { useRef, useEffect, useState } from "react";

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

function NewLog() {
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
    wordsPerEachSecond.push(
      noteLength[noteLength.length - 1] - noteLength[noteLength.length - 2]
    );
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
      }
    });
    console.log(wordTimeStamps);
    console.log(blob);
  };

  return (
    <div>
      <div>
        <div>
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
        </div>
        <div>
          {currentlyRecording === false && recorded === false ? (
            <button onClick={() => startRecording()}>Start recording</button>
          ) : null}
          {currentlyRecording === true && recorded === false ? (
            <button onClick={() => stopRecording()}>Stop Recording</button>
          ) : null}
        </div>
        <div>
          {!recorded ? (
            <p>{note}</p>
          ) : (
            <div>
              {wordTimeStamps.map((grouping, index) => (
                <p
                  key={index}
                  onClick={() => {
                    recordedEl.current.currentTime =
                      grouping[1] - 2 > 0 ? grouping[1] - 2 : 0;
                  }}
                >
                  {grouping[0] + " "}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NewLog;
