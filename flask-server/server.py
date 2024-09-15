from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import requests
from moviepy.editor import AudioFileClip
import os
import io
from pydub import AudioSegment
import time
from main_be import main_be
from closest_hospital import closest_hospitals, get_eta

app = Flask(__name__)
CORS(app) 

global eta
eta = ""
address = ""

UPLOAD_FOLDER = './uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/members', methods=['GET'])
def get_members():
    members = {"members": ["member1", "member2", "member3"]}
    return jsonify(members)


@app.route('/find-address', methods=['GET'])
def find_address():
    try:
        global address
        latitude = request.args.get('latitude')
        longitude = request.args.get('longitude')
       
        hospitals = closest_hospitals(latitude, longitude)
        
        eta = get_eta(str(latitude)+', '+str(longitude), str(hospitals[0]['lat'])+', '+str(hospitals[0]['lng']))

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
       
        address = result['results'][0]['formatted_address']
        
        return jsonify({
            'address': address,
            'hospitals': hospitals,
            'eta': eta['text'],
        })

    except Exception as e:
        print(f"An error occurred: {e}")  
        return jsonify({'error': 'Internal Server Error'}), 500
    
@app.route('/download-audio/<filename>', methods=['GET'])
def download_audio(filename):
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    try:
        return send_file(file_path, as_attachment=True)
    except Exception as e:
        print(f"Error occurred while sending file: {e}")
        return str(e), 500

@app.route('/upload-speech', methods=['POST'])
def upload_audio():
    try:
        if 'audio' not in request.files:
            return 'Audio file not found', 400
        
        global said_message, address
        
        audio_file = request.files['audio']
        file_path = os.path.join(UPLOAD_FOLDER, audio_file.filename)
        audio_file.save(file_path)
        time.sleep(1)

        advice, said_message = main_be(address)

        return jsonify({
            'advice': advice,
            'audio': said_message
        })

    except Exception as e:
        print(f"Error occurred: {e}")
        return str(e), 500
    
if __name__ == '__main__':
    os.makedirs('uploads', exist_ok=True)
    app.run(debug=True)
