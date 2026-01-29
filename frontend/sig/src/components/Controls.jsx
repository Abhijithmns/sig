function Controls({ listening, setListening }) {
  return (
    <button onClick={() => setListening(!listening)}>
      {listening ? "Stop Listening" : "Start Listening"}
    </button>
  );
}

export default Controls;

