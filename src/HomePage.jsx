import { useState, useEffect } from "react";
import {
  AdvancedMarker,
  APIProvider,
  Map,
  Pin,
} from "@vis.gl/react-google-maps";
import { Card, Col, Container, Row } from "react-bootstrap";

function HomePage() {
  const mapsApiKey = import.meta.env.VITE_MAPS_API_KEY;
  const [locations, setLocations] = useState([]);

  const handleMapClick = (ev) => {
    if (!ev.detail.latLng) return;
    if (locations) {
      setLocations([...locations, ev.detail.latLng]);
    } else {
      setLocations([ev.detail.latLng]);
    }
  };

  useEffect(() => {
    console.log(locations);
  }, [locations]);

  const getLocation = function () {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => console.log(position.coords.latitude),
        () => alert("Sorry, no position available"),
      );
    }
  };
  return (
    <>
      <div className="min-vh-100">
        <Container>
          <Row>
            <Col xs={8}>
              <Card style={{ height: "100vh" }}>
                <APIProvider
                  apiKey={mapsApiKey}
                  onLoad={() => console.log("Maps API has loaded")}
                >
                  <Map
                    style={{ width: "100%", height: "100%" }}
                    defaultZoom={13}
                    defaultCenter={{ lat: -33.860664, lng: 151.208138 }}
                    mapId="59684e579f820bc4a08db50c"
                    onClick={handleMapClick}
                  >
                    {locations && <PoiMarkers pois={locations} />}
                  </Map>
                </APIProvider>
              </Card>
            </Col>
            <Col xs={4}>
              <button onClick={getLocation}>Get Location</button>
              {locations &&
                locations.map((lction, index) => (
                  <p key={index}>
                    {lction.lat}, {lction.lng}
                  </p>
                ))}
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}

const PoiMarkers = ({ pois }) => {
  return (
    <>
      {pois.map((poi) => (
        <AdvancedMarker key={poi} position={poi}>
          <Pin />
        </AdvancedMarker>
      ))}
    </>
  );
};

export default HomePage;
