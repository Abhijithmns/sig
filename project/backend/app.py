from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/process", methods=["POST"])
def process_text():
    data = request.get_json(force=True)
    text = data.get("text", "").lower().strip()

    if not text:
        return jsonify({
            "result": "Please enter some lecture content."
        })

    explanations = []

    # Artificial Intelligence
    if "ai" in text or "artificial intelligence" in text:
        explanations.append(
            "Artificial intelligence is like giving a computer a brain. "
            "It helps machines think and make decisions like humans."
        )

    # Machine Learning
    if "machine learning" in text:
        explanations.append(
            "Machine learning is like teaching a child using examples. "
            "The more examples you show, the better the child learns."
        )

    # Operating System
    if "operating system" in text:
        explanations.append(
            "An operating system is like a manager. "
            "It makes sure all parts of the computer work together properly."
        )

    # Data Structures
    if "data structure" in text:
        explanations.append(
            "A data structure is like organizing toys into boxes "
            "so you can find them easily."
        )

    # Computer Networks
    if "network" in text:
        explanations.append(
            "A computer network is like friends talking to each other "
            "to share information."
        )

    # Fallback
    if not explanations:
        explanations.append(
            "This lecture topic is being explained in a simple way "
            "to help beginners understand."
        )

    return jsonify({
        "result": "\n\n".join(explanations)
    })


if __name__ == "__main__":
    print("✅ Offline ELI5 backend running")
    app.run(host="127.0.0.1", port=5000, debug=False)
