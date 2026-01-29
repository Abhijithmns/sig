import React, { useState, useRef } from "react";
import "./App.css";
import micIcon from "./mic.svg";
import recIcon from "./rec.png";

function App() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [listening, setListening] = useState(false);

  const recognitionRef = useRef(null);

  // Auto-resize textarea
  const autoResize = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  // Start mic
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let finalText = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalText += event.results[i][0].transcript + " ";
        }
      }
      setInputText((prev) => prev + finalText);
    };

    recognition.start();
    recognitionRef.current = recognition;
    setListening(true);
  };

  // Stop mic
  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setListening(false);
  };

  // Submit to backend
  const handleSubmit = async () => {
    if (!inputText.trim()) return;

    try {
      const response = await fetch("http://127.0.0.1:5000/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      });

      const data = await response.json();
      setOutputText(data.result);
    } catch {
      setOutputText("Backend connection failed");
    }
  };

  // Clear all
  const handleClear = () => {
    if (recognitionRef.current) recognitionRef.current.stop();
    setListening(false);
    setInputText("");
    setOutputText("");
  };

  return (
    <div className="page">
      <div className="card">
        <h2 className="title">Inclusive Real-Time Concept Simplifier</h2>

        {/* Input row */}
        <div className="input-row horizontal">
          <label className="input-label">input:</label>
          <textarea
            placeholder="Speak or type lecture content"
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              autoResize(e);
            }}
          />
        </div>

        {/* Mic button */}
        <div className="btn-row">
          {!listening ? (
            <button className="mic-btn" onClick={startListening}>
              <img src={micIcon} alt="mic" className="mic-icon" />
              Start Lecture
            </button>
          ) : (
            <button className="mic-btn" onClick={stopListening}>
              <img src={micIcon} alt="mic" className="mic-icon" />
              Stop Lecture
            </button>
          )}
        </div>

        {/* Recording indicator */}
        {listening && (
          <div className="recording-indicator">
            <img src={recIcon} alt="rec" />
            Recording...
          </div>
        )}

        {/* Action buttons */}
        <div className="action-row">
          <button className="submit-btn" onClick={handleSubmit}>
            submit
          </button>
          <button className="submit-btn" onClick={handleClear}>
            clear
          </button>
        </div>

        {/* Output */}
        <div className="output-box">
          <p>ELI5 output</p>
          <div className="output-text">{outputText}</div>
        </div>
      </div>
    </div>
  );
}

export default App;
