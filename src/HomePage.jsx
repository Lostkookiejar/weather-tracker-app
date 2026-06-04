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

  return (
    <>
      <Container>
        <Row xs={12}>
          <Col className="w-100">
            <Card style={{ width: "50rem", height: "50rem" }}>
              <Card.Body>
                <APIProvider
                  apiKey={mapsApiKey}
                  onLoad={() => console.log("Maps API has loaded")}
                >
                  <Map
                    defaultZoom={13}
                    defaultCenter={{ lat: -33.860664, lng: 151.208138 }}
                    mapId="59684e579f820bc4a08db50c"
                    onClick={handleMapClick}
                  >
                    {locations && <PoiMarkers pois={locations} />}
                  </Map>
                </APIProvider>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
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
