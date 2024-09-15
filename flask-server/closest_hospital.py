import requests
import googlemaps
from datetime import datetime

API_KEY = 'AIzaSyA3O80449lCO3pSJzfxgwGpkatd9L4e-9U'
gmaps_client = googlemaps.Client(key = API_KEY)
now = datetime.now()

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
    result = gmaps_client.directions(
        source,
        destination,
        mode = 'driving',
        departure_time = now,
        transit_mode = 'driving'
    )
    return result[0]['legs'][0]['distance']


lst = closest_hospitals()
get_eta('37.369660, -81.270450', str(lst[0]['lat'])+', '+str(lst[0]['lng']))



    
