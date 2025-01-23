from flask import Flask, request, jsonify
from flask_cors import CORS
from CanteenWeb import *

app = Flask(__name__)
CORS(app)
canteen = CanteenWeb()
@app.route('/login',methods=['POST'])
def login():
    input = request.json
    username = input['username']
    password = input['password']

    try:
        print()
        if canteen.login(username, password):
            return 'successfully logged in', 200
    except ValueError as e:
        return str(e), 401
    return 'login unsuccessful', 401

@app.route('/menu',methods=['GET'])
def menu():
    return jsonify(canteen.get_lunches())

@app.route('/rate',methods=['POST'])
def rate():
    pass

if __name__ == '__main__':
    app.run()
