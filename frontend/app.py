from flask import Flask
from flask import request
import os
import requests

BACKEND_HOST = os.getenv('BACKEND_HOST', 'http://localhost:8080')
# BACKEND_HOST = os.getenv('BACKEND_HOST', 'https://facial-recognition-backend.azurewebsites.net')
SERVER_PORT = os.getenv('SERVER_PORT', 8000)
NOSQL_HOST = os.getenv('NOSQL_HOST', 'http://localhost:8080')

# Create Flask app
app = Flask(__name__, static_url_path='/', static_folder='build')

@app.route('/')
def index():
    return app.send_static_file("index.html")

# Test endpoint, ignore
@app.route('/greeting/<name>', methods=['GET'])
def greeting(name):
    response = requests.get(BACKEND_HOST + f"/users/{name}")
    return response.content

@app.route('/images', methods=['POST'])
def image():
    response = requests.post(BACKEND_HOST + '/images', data=request.data)
    return response.content

@app.route('/validate', methods=['POST'])
def validate():
    response = requests.post(BACKEND_HOST + '/validate', data=request.data)
    return response.content
    
@app.route('/form', methods=['POST'])
def form():
    response = requests.post(BACKEND_HOST + '/form', data=request.data)
    return response.content

@app.route('/users', methods=['POST'])
def users():
    response = requests.post(NOSQL_HOST + '/users', data=request.data)
    return response.content

@app.route('/users/<userid>', methods=['GET'])
def getUsersById(userid):
    response = requests.get(NOSQL_HOST + f"/users/{userid}")
    return response.content

@app.route('/users/name/<name>', methods=['GET'])
def getUsersByName(name):
    response = requests.get(NOSQL_HOST + f"/users/name/{name}")
    return response.content


if __name__ == '__main__': 
    app.run(host="0.0.0.0", port=SERVER_PORT, debug=True)