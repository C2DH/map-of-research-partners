import pandas as pd
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut
import json
import time


def geocode_location(city, country):
    """Geocode a city/country combination using Nominatim"""
    geolocator = Nominatim(user_agent="my_agent")
    try:
        if pd.isna(city) or pd.isna(country):
            return None

        query = f"{city}, {country}"
        location = geolocator.geocode(query)

        # Add delay to respect Nominatim's usage policy
        time.sleep(1)

        if location:
            return {"lat": location.latitude, "lng": location.longitude}
        return None
    except GeocoderTimedOut:
        return None


def create_geojson(df):
    """Convert dataframe to GeoJSON FeatureCollection"""
    features = []

    for _, row in df.iterrows():
        # Get coordinates for the location
        coords = geocode_location(row["city"], row["country"])

        if coords:
            feature = {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [coords["lng"], coords["lat"]],
                },
                "properties": {
                    "name": row["name"],
                    "city": row["city"],
                    "country": row["country"],
                    "url": row["url"],
                    "id": row["id"],
                },
            }
            features.append(feature)

    geojson = {"type": "FeatureCollection", "features": features}

    return geojson


# Read CSV
df = pd.read_csv("Partners_MAPBOX.csv", sep=";")

# Create GeoJSON
geojson_data = create_geojson(df)

# Save to file
with open("partners_locations.geojson", "w") as f:
    json.dump(geojson_data, f, indent=2)
