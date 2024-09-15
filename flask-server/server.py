from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from moviepy.editor import AudioFileClip
import os
import io
from pydub import AudioSegment
import time
from main_be import main_be
from closest_hospital import closest_hospitals

app = Flask(__name__)
CORS(app) 

latitude_send, longitude_send = None
address_for_main = None
UPLOAD_FOLDER = './uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/members', methods=['GET'])
def get_members():
    members = {"members": ["member1", "member2", "member3"]}
    return jsonify(members)


@app.route('/find-address', methods=['GET'])
def find_address():
    try:
        global latitude_send, longitude_send
        latitude = request.args.get('latitude')
        longitude = request.args.get('longitude')
        

        latitude_send = latitude
        longitude_send = longitude
        closest_hospitals(latitude_send, longitude_send)

        if not latitude or not longitude:
            return jsonify({'error': 'Missing latitude or longitude'}), 400

        print(f"Received latitude: {latitude}, longitude: {longitude}") 

        api_key = 'AIzaSyA3O80449lCO3pSJzfxgwGpkatd9L4e-9U' 
        url = 'https://maps.googleapis.com/maps/api/geocode/json'
        params = {
            'latlng': f'{latitude},{longitude}',
            'key': api_key
        }
        
        response = requests.get(url, params=params)
        result = response.json()

        print(f"Google Maps API response: {result}")  

        if result['status'] == 'OK':
            address = result['results'][0]['formatted_address']
            return jsonify({'address': address})
        else:
            error_message = result.get('error_message', 'Unknown error')
            return jsonify({'error': error_message}), 500
    except Exception as e:
        print(f"An error occurred: {e}")  
        return jsonify({'error': 'Internal Server Error'}), 500



@app.route('/upload-speech', methods=['POST'])
def upload_audio():
    try:
        # Check if the audio file is in the request
        if 'audio' not in request.files:
            return 'Audio file not found', 400
        
        audio_file = request.files['audio']

        # Generate a safe file name and save it to the uploads folder
        file_path = os.path.join(UPLOAD_FOLDER, audio_file.filename)

        # Save the file to the specified path
        audio_file.save(file_path)
        time.sleep(1)
        advice = main_be(address_for_main)

    except Exception as e:
        print(f"Error occurred: {e}")
        return str(e), 500
    

if __name__ == '__main__':
    os.makedirs('uploads', exist_ok=True)
    app.run(debug=True)
