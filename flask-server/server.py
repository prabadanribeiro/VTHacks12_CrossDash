from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import requests
from moviepy.editor import AudioFileClip
import os
import io
from pydub import AudioSegment
import time
from main_be import main_be
from closest_hospital import closest_hospitals, get_eta, eta_decrease

app = Flask(__name__)
CORS(app)
google_maps_api_key = os.getenv('GOOGLE_MAPS_API_KEY')
eta = ""
address = ""
latitude = ""
longitude = ""

UPLOAD_FOLDER = './uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/find-address', methods=['GET'])
def find_address():
    try:
        global address, latitude, longitude
        latitude = request.args.get('latitude')
        longitude = request.args.get('longitude')

        if not latitude or not longitude:
            return jsonify({'error': 'Missing latitude or longitude'}), 400

        url = 'https://maps.googleapis.com/maps/api/geocode/json'
        params = {
            'latlng': f'{latitude},{longitude}',
            'key': google_maps_api_key
        }

        response = requests.get(url, params=params)
        result = response.json()

        address = result['results'][0]['formatted_address']

        return jsonify({
            'address': address
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

        global said_message, address, eta, latitude, longitude

        audio_file = request.files['audio']
        file_path = os.path.join(UPLOAD_FOLDER, audio_file.filename)
        audio_file.save(file_path)
        time.sleep(1)

        hospitals = closest_hospitals(latitude, longitude)

        if not hospitals:
            return jsonify({'error': 'No hospitals found nearby'}), 404

        hospital_location = hospitals[0]
        destination = f"{hospital_location['lat']}, {hospital_location['lng']}"

        eta = eta_decrease(get_eta(f"{latitude}, {longitude}", destination))

        advice, said_message = main_be(address)

        return jsonify({
            'advice': advice,
            'audio': said_message,            
            'hospitals': hospitals,
            'eta': eta
        })

    except Exception as e:
        print(f"Error occurred: {e}")
        return str(e), 500

if __name__ == '__main__':
    os.makedirs('uploads', exist_ok=True)
    app.run(debug=True)
