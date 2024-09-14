from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from moviepy.editor import AudioFileClip
import os
import io
from pydub import AudioSegment

app = Flask(__name__)
CORS(app)  

@app.route('/members', methods=['GET'])
def get_members():
    members = {"members": ["member1", "member2", "member3"]}
    return jsonify(members)

def convert_webm_to_wav(webm_data):
    try:
        audio = AudioSegment.from_file(io.BytesIO(webm_data), format="webm")
        wav_io = io.BytesIO()
        audio.export(wav_io, format="wav")
        wav_io.seek(0)
        
        return wav_io

    except Exception as e:
        print(f"Error converting webm to wav: {e}")
        return None


@app.route('/upload-speech', methods=['POST'])
def upload_audio():
    try:
        if 'audio' not in request.files:
            return 'Audio file not found', 400
        
        audio_file = request.files['audio']

        audio_data = audio_file.read()

        wav_io = convert_webm_to_wav(audio_data) 

        return 'working', 200

    except Exception as e:
        print(f"Error occurred: {e}")
        return str(e), 500
    
@app.route('/find-address', methods=['GET'])
def find_address():
    try:

        latitude = request.args.get('latitude')
        longitude = request.args.get('longitude')


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

if __name__ == '__main__':
    os.makedirs('uploads', exist_ok=True)
    app.run(debug=True)
