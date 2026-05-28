import { useState, useEffect, useRef } from "react";
import {
  AdvancedMarker,
  APIProvider,
  Map,
  Pin,
  useMap,
} from "@vis.gl/react-google-maps";
import { MarkerClusterer } from "@googlemaps/markerclusterer";

const locations = [
  { key: "operaHouse", location: { lat: -33.8567844, lng: 151.213108 } },
  { key: "tarongaZoo", location: { lat: -33.8472767, lng: 151.2188164 } },
  { key: "manlyBeach", location: { lat: -33.8209738, lng: 151.2563253 } },
  { key: "hyderPark", location: { lat: -33.8690081, lng: 151.2052393 } },
  { key: "theRocks", location: { lat: -33.8587568, lng: 151.2058246 } },
  { key: "circularQuay", location: { lat: -33.858761, lng: 151.2055688 } },
  { key: "harbourBridge", location: { lat: -33.852228, lng: 151.2038374 } },
  { key: "kingsCross", location: { lat: -33.8737375, lng: 151.222569 } },
  { key: "botanicGardens", location: { lat: -33.864167, lng: 151.216387 } },
  { key: "museumOfSydney", location: { lat: -33.8636005, lng: 151.2092542 } },
  { key: "maritimeMuseum", location: { lat: -33.869395, lng: 151.198648 } },
  {
    key: "kingStreetWharf",
    location: { lat: -33.8665445, lng: 151.1989808 },
  },
  { key: "aquarium", location: { lat: -33.869627, lng: 151.202146 } },
  { key: "darlingHarbour", location: { lat: -33.87488, lng: 151.1987113 } },
  { key: "barangaroo", location: { lat: -33.8605523, lng: 151.1972205 } },
];

function HomePage() {
  const mapsApiKey = import.meta.env.VITE_MAPS_API_KEY;

  /*
  const apiKey = import.meta.env.VITE_API_KEY;
  
  const url = `http://api.openweathermap.org/geo/1.0/zip?zip=43200,MY&appid=${apiKey}`;

  const [data, setData] = useState("");

  const handleGenerateWeather = async () => {
    try {
      const geocodeResponse = await fetch(url);
      const geocodeData = await geocodeResponse.json();

      const coordinates = {
        lat: geocodeData.lat,
        lon: geocodeData.lon,
      };

      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude=minutely,hourly&appid=${apiKey}`,
      );

      setData(await weatherResponse.json());
    } catch (error) {
      console.error(error);
    }
  };
  */
  return (
    <>
      <APIProvider
        apiKey={mapsApiKey}
        onLoad={() => console.log("Maps API has loaded")}
      >
        <Map
          defaultZoom={13}
          defaultCenter={{ lat: -33.860664, lng: 151.208138 }}
          mapId="59684e579f820bc4a08db50c"
        >
          <PoiMarkers pois={locations} />
        </Map>
      </APIProvider>

      {/* 
      <h1>Generate Weather button</h1>
      <button onClick={handleGenerateWeather}>Generate</button>
      {data && data.lat && (
        <>
          <Card>
            <Card.Body>
              <p>{data.timezone}</p>
              <p>{data.current.temp}</p>
              <p>{data.daily[0].summary}</p>
            </Card.Body>
          </Card>
        </>
      )}
      {data && data.cod && (
        <>
          <Card>
            <Card.Body>
              <p>{data.message}</p>
            </Card.Body>
          </Card>
        </>
      )}
        */}
    </>
  );
}

const PoiMarkers = ({ pois }) => {
  const map = useMap();
  const [markers, setMarkers] = useState({});
  const clusterer = useRef(null);

  useEffect(() => {
    if (!map) return;
    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({ map });
    }
  }, [map]);

  useEffect(() => {
    clusterer.current?.clearMarkers();
    clusterer.current?.addMarkers(Object.values(markers));
  }, [markers]);

  const setMarkerRef = (marker, key) => {
    if (marker && markers[key]) return;
    if (!marker && !markers[key]) return;

    setMarkers((prev) => {
      if (marker) {
        return { ...prev, [key]: marker };
      } else {
        const newMarkers = { ...prev };
        delete newMarkers[key];
        return newMarkers;
      }
    });
  };
  return (
    <>
      {pois.map((poi) => (
        <AdvancedMarker
          key={poi.key}
          position={poi.location}
          ref={(marker) => setMarkerRef(marker, poi.key)}
        >
          <Pin
            background={"#FBBC04"}
            glyphColor={"#000"}
            borderColor={"#000"}
          />
        </AdvancedMarker>
      ))}
    </>
  );
};

export default HomePage;
