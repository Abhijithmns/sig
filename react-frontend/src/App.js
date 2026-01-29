import React, { useState, useRef } from "react";
import "./App.css";

function App() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [listening, setListening] = useState(false);

  const recognitionRef = useRef(null);

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setInputText((prev) => prev + " " + transcript);
    };

    recognition.start();
    recognitionRef.current = recognition;
    setListening(true);
  };

  const stopListening = () => {
    recognitionRef.current.stop();
    setListening(false);
  };

  const handleSubmit = () => {
    // For now just move input to output
    // Replace this with backend / ML call later
    setOutputText(inputText);
  };

  return (
    <div className="page">
      <div className="card">
        <h2 className="title">Live Lecture / Text Input</h2>

        <div className="input-row">
          <label>input:</label>
          <textarea
            placeholder="Type text OR use microphone"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
        </div>

        <div className="btn-row">
          {!listening ? (
            <button onClick={startListening}>🎤 Start Lecture</button>
          ) : (
            <button onClick={stopListening}>⏹ Stop Lecture</button>
          )}
        </div>

        <button className="submit-btn" onClick={handleSubmit}>
          submit
        </button>

        <div className="output-box">
          <p>output</p>
          <div className="output-text">{outputText}</div>
        </div>
      </div>
    </div>
  );
}

export default App;
