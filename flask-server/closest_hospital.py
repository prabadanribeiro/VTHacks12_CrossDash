import requests
import googlemaps
from datetime import datetime, timedelta
import time
import os
from dotenv import load_dotenv

load_dotenv()
google_maps_api_key = os.getenv('GOOGLE_MAPS_API_KEY')

API_KEY = google_maps_api_key
gmaps_client = googlemaps.Client(key = API_KEY)

def closest_hospitals(lat, lon):
    url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
    params = {
        'location': f'{lat},{lon}',
        'radius': 20000,
        'type': 'hospital',
        'key': API_KEY
    }
    response = requests.get(url, params=params)
    results = response.json()

    hospital_cords = []

    for i in range (len(results['results'])):
        hospital_cords.append(results['results'][i]['geometry']['location'])

    return hospital_cords

def get_eta(source, destination):
    now = datetime.now()
    result = gmaps_client.directions(
        source,
        destination,
        mode = 'driving',
        departure_time = now,
        transit_mode = 'driving'
    )
    return round(result[0]['legs'][0]['duration']['value'])

def eta_decrease(eta):
    x = []
    while eta > 0:
        remaining_time = timedelta(seconds = eta)
        x.append(int(remaining_time.total_seconds())//60)
        eta -= 60
    return x


lst = closest_hospitals(37.369660, -81.270450)