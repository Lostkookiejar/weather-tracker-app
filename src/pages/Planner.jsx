import { useState, useEffect } from "react";
import {
  AdvancedMarker,
  APIProvider,
  Map,
  Pin,
  useMap,
} from "@vis.gl/react-google-maps";
import { Card, Col, Container, Row } from "react-bootstrap";
import "../styles/MapOverlay.css";

function Planner() {
  const mapsApiKey = import.meta.env.VITE_MAPS_API_KEY;
  const [locations, setLocations] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [mapCenter, setMapCenter] = useState({
    lat: -33.860664,
    lng: 151.208138,
  });

  const handleMapClick = (ev) => {
    if (!ev.detail.latLng) return;
    if (locations) {
      setLocations([...locations, ev.detail.latLng]);
    } else {
      setLocations([ev.detail.latLng]);
    }
  };

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSearch = () => {
    if (!searchInput.trim()) {
      console.log("Please enter a search query");
      return;
    }

    // Use Google Maps Places API Text Search
    const request = {
      query: searchInput,
      fields: ["formatted_address", "geometry", "name", "place_id"],
    };

    const service = new window.google.maps.places.PlacesService(
      document.createElement("div"),
    );
    service.textSearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        const newLocations = results.map((result) => ({
          lat: result.geometry.location.lat(),
          lng: result.geometry.location.lng(),
          name: result.name,
          address: result.formatted_address,
        }));
        setSearchResults(newLocations);
        setLocations(newLocations);
        console.log("Search results:", newLocations);
      } else {
        console.error("Places text search failed:", status);
      }
    });
  };

  const handleLocationClick = (location) => {
    setMapCenter({ lat: location.lat, lng: location.lng });
  };

  return (
    <>
      <div className="min-vh-100">
        <Container>
          <Row>
            <Col xs={8} className="position-relative">
              <Card style={{ height: "100vh" }}>
                <div className="map-overlay-container">
                  <div className="search-input-group">
                    <input
                      type="text"
                      className="map-search-input"
                      placeholder="Search location..."
                      value={searchInput}
                      onChange={handleSearchChange}
                      onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    />
                    <button
                      className="map-search-button"
                      onClick={handleSearch}
                    >
                      Search
                    </button>
                  </div>
                </div>
                <MapComponent
                  mapsApiKey={mapsApiKey}
                  locations={locations}
                  handleMapClick={handleMapClick}
                  mapCenter={mapCenter}
                />
              </Card>
            </Col>
            <Col xs={4}>
              <div className="search-results-panel">
                <h5>Results ({locations.length})</h5>
                {locations.map((location, index) => (
                  <div
                    key={index}
                    className="result-item"
                    onClick={() => handleLocationClick(location)}
                  >
                    <strong>{location.name || `Location ${index + 1}`}</strong>
                    <p className="result-coords">
                      {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                    </p>
                    {location.address && (
                      <p className="result-address">{location.address}</p>
                    )}
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}

function MapComponent({ mapsApiKey, locations, handleMapClick, mapCenter }) {
  return (
    <APIProvider apiKey={mapsApiKey} libraries={["places"]}>
      <MapContent
        locations={locations}
        handleMapClick={handleMapClick}
        mapCenter={mapCenter}
      />
    </APIProvider>
  );
}

function MapContent({ locations, handleMapClick, mapCenter }) {
  const map = useMap();

  useEffect(() => {
    if (map && mapCenter) {
      map.panTo(mapCenter);
      map.setZoom(15);
    }
  }, [map, mapCenter]);

  return (
    <Map
      style={{ width: "100%", height: "100%" }}
      defaultZoom={13}
      defaultCenter={mapCenter}
      mapId="59684e579f820bc4a08db50c"
      onClick={handleMapClick}
    >
      {locations && <PoiMarkers pois={locations} />}
    </Map>
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

export default Planner;
