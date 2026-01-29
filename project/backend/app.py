from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/process", methods=["POST"])
def process_text():
    data = request.get_json()
    text = data.get("text", "").lower()

    if not text:
        return jsonify({"result": "No input received."})

    # -------- ELI5 RULE-BASED SIMPLIFIER --------

    if "machine learning" in text:
        result = (
            "Imagine teaching a child to recognize animals. "
            "You show many pictures and correct them when they are wrong. "
            "Over time, the child learns. "
            "Machine learning works the same way: computers learn from examples."
        )

    elif "artificial intelligence" in text:
        result = (
            "Artificial intelligence is like giving a computer a brain. "
            "It helps machines think, learn, and make decisions like humans."
        )

    elif "operating system" in text:
        result = (
            "An operating system is like a school teacher. "
            "It makes sure everyone gets a turn and everything runs smoothly "
            "inside the computer."
        )

    elif "data structure" in text:
        result = (
            "A data structure is like organizing toys in boxes. "
            "When toys are well organized, you can find them quickly."
        )

    elif "computer network" in text:
        result = (
            "A computer network is like a group of friends passing notes. "
            "It helps computers share information with each other."
        )

    else:
        result = (
            "This concept is being captured from the lecture. "
            "ELI5 explanations help students understand complex topics easily."
        )

    return jsonify({"result": result})


if __name__ == "__main__":
    app.run(debug=True)
