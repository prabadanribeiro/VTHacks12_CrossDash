import googlemaps
import folium
from folium.plugins import MarkerCluster
import pandas as pd
from pull_data import pull_data


gmaps = googlemaps.Client(key='AIzaSyA3O80449lCO3pSJzfxgwGpkatd9L4e-9U')


def get_lat_lon(address):
    geocode_result = gmaps.geocode(address)
    if geocode_result and len(geocode_result):
        location = geocode_result[0]['geometry']['location']
        return [location['lat'], location['lng']
                ]
    return None


data = pull_data()
df = pd.DataFrame(data)


df['coordinates'] = df['address'].apply(get_lat_lon)
df = df.dropna(subset=['coordinates'])
df['coordinates'] = df['coordinates'].apply(tuple)


frequency_table = df.groupby(['coordinates', 'cause']).size().reset_index(name='frequency')
frequency_table['address'] = df['address']
print(frequency_table)

m = folium.Map(location=get_lat_lon('Drillfield, Blacksburg, VA'), zoom_start=15.5)

marker_cluster = MarkerCluster(
    icon_create_function="""
    function(cluster) {
        return new L.DivIcon({
            html: '<div style="background-color: red; border-radius: 50%; color: white; text-align: center; line-height: 30px; width: 30px; height: 30px; font-weight: bold;">' + cluster.getChildCount() + '</div>',
            className: 'marker-cluster',
            iconSize: L.point(30, 30)
        });
    }
    """
).add_to(m)


color_map = {
    'drinking': 'blue',
    'drugs': 'red',
    'accident': 'green',
    'unknown': 'black'
}

offsets = {
    'drinking': (0.0001, 0),   
    'drugs': (0, 0.0001),         
    'accident': (-0.0001, 0),     
    'unknown': (0, -0.0001)       
}

for _, row in frequency_table.iterrows():
    lat_lon = row['coordinates']
    event_type = row['cause']
    frequency = row['frequency']

    radius = frequency * 8

    marker_color = color_map.get(event_type, 'gray')
    
    lat_offset, lon_offset = offsets.get(event_type, (0, 0))
    adjusted_lat_lon = (lat_lon[0] + lat_offset, lat_lon[1] + lon_offset)

    folium.CircleMarker(
        location=adjusted_lat_lon,
        radius=radius,
        color=marker_color,
        fill=True,
        fill_opacity=0.8,
        fill_color=marker_color,
        popup=f"Event: {event_type}<br>Frequency: {frequency}"
    ).add_to(marker_cluster)


m.save("map.html")
