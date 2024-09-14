from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  

@app.route('/members', methods=['GET'])
def get_members():
    members = {"members": ["member1", "member2", "member3"]}
    return jsonify(members)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)