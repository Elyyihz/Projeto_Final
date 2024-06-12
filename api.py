import requests

def get_geolocation(api_key):
    url = 'https://www.googleapis.com/geolocation/v1/geolocate?key=' + api_key
    payload = {
        "considerIp": "true"
    }
    response = requests.post(url, json=payload)
    return response.json()

api_key = 'AIzaSyDFNenNi5fhonywnk8Nv7XMz5CR_XpPWdA'
location = get_geolocation(api_key)

if location:
    latitude = location['location']['lat']
    longitude = location['location']['lng']
    accuracy = location['accuracy']
    print(f"Latitude: {latitude}, Longitude: {longitude}, Accuracy: {accuracy} meters")
else:
    print("Não foi possível obter a localização.")
