import { useState, useEffect } from "react";
import {
  AdvancedMarker,
  APIProvider,
  Map,
  Pin,
} from "@vis.gl/react-google-maps";
import { Card, Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentPosition } from "./features/locationSlice";

function HomePage() {
  const mapsApiKey = import.meta.env.VITE_MAPS_API_KEY;
  const [locations, setLocations] = useState([]);
  const dispatch = useDispatch();
  const currentPosition = useSelector((state) => state.location.value);

  const handleMapClick = (ev) => {
    if (!ev.detail.latLng) return;
    if (locations) {
      setLocations([...locations, ev.detail.latLng]);
    } else {
      setLocations([ev.detail.latLng]);
    }
  };

  const getCurrentLocation = function () {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const response = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        dispatch(getCurrentPosition(response));
      });
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
              <button onClick={getCurrentLocation}>Get Location</button>
              {currentPosition && <p>CurrentPosition: {currentPosition.lat}</p>}
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
