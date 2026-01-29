function ExplanationPanel({ text }) {
  return (
    <div style={{ width: "50%", border: "1px solid #ccc", padding: "10px" }}>
      <h4>ELI5 Explanation</h4>
      <p>{text}</p>
    </div>
  );
}

export default ExplanationPanel;

