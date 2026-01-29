import { useEffect, useRef } from "react";

function SpeechInput({ listening, setTranscript, setExplanation }) {
  const recognitionRef = useRef(null);
  const bufferRef = useRef("");

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let interim = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const text = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          bufferRef.current += text;
          setTranscript(bufferRef.current);

          // sentence detection
          if (text.includes(".")) {
            const sentence = bufferRef.current.trim();
            console.log("Sentence detected:", sentence);

            // TEMP: fake explanation
            setExplanation("ELI5 explanation will appear here");

            bufferRef.current = "";
          }
        } else {
          interim += text;
        }
      }
    };

    recognitionRef.current = recognition;
  }, []);

  useEffect(() => {
    if (!recognitionRef.current) return;

    if (listening) recognitionRef.current.start();
    else recognitionRef.current.stop();
  }, [listening]);

  return null;
}

export default SpeechInput;

