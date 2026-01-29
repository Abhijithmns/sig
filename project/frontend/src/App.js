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

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setListening(false);
  };

  const handleSubmit = async () => {
    const response = await fetch("http://127.0.0.1:5000/process", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: inputText }),
    });

    const data = await response.json();
    setOutputText(data.result);
  };

  // 🧹 CLEAR BUTTON LOGIC
  const handleClear = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setListening(false);
    setInputText("");
    setOutputText("");
  };

  return (
    <div className="page">
      <div className="card">
        <h2 className="title">Inclusive Real-Time Concept Simplifier</h2>

        <div className="input-row">
          <label>input:</label>
          <textarea
            placeholder="Speak or type lecture content"
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

        {/* 🧹 CLEAR BUTTON */}
        <button className="submit-btn" onClick={handleClear}>
          clear
        </button>

        <div className="output-box">
          <p>ELI5 output</p>
          <div className="output-text">{outputText}</div>
        </div>
      </div>
    </div>
  );
}

export default App;
