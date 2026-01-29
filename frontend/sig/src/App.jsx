import { useState } from "react";
import SpeechInput from "./components/SpeechInput";
import TranscriptPanel from "./components/TranscriptPanel";
import ExplanationPanel from "./components/ExplanationPanel";
import Controls from "./components/Controls";

function App() {
  const [transcript, setTranscript] = useState("");
  const [explanation, setExplanation] = useState("");
  const [listening, setListening] = useState(false);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Real-Time Concept Simplifier</h2>

      <Controls listening={listening} setListening={setListening} />

      <SpeechInput
        listening={listening}
        setTranscript={setTranscript}
        setExplanation={setExplanation}
      />

      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        <TranscriptPanel text={transcript} />
        <ExplanationPanel text={explanation} />
      </div>
    </div>
  );
}

export default App;

