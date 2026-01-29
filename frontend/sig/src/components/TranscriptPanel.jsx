function TranscriptPanel({ text }) {
  return (
    <div style={{ width: "50%", border: "1px solid #ccc", padding: "10px" }}>
      <h4>Lecture</h4>
      <p>{text}</p>
    </div>
  );
}

export default TranscriptPanel;

