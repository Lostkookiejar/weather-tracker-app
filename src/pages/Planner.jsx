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

    //Google Maps Text Search
    const service = new window.google.maps.places.PlacesService(
      //doesnt actually render anything, just a placeholder DOM required by constructor
      document.createElement("div"),
    );

    //textSearch Query
    service.textSearch(request, (results, status) => {
      //status is OK or otherwise
      //results is an array >> https://developers.google.com/maps/documentation/javascript/reference/places-service#PlaceResult
      //NOTE: PlacesServices is deprecated but is still in half-supported limbo
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

  //function for clicking on a location in the results search panel. Sets the Map to navigate on click.
  const handleLocationClick = (location) => {
    setMapCenter({ lat: location.lat, lng: location.lng });
  };

  const getIconForCondition = (condition) => {
    const map = {
      Sunny: "bi-sun-fill text-warning",
      "Partly Cloudy": "bi-cloud-sun-fill text-secondary",
      "Light Rain": "bi-cloud-rain-fill text-info",
      Breezy: "bi-wind text-primary",
      Clear: "bi-brightness-high-fill text-warning",
    };
    return map[condition] || "bi-cloud-fill text-muted";
  };

  const dummyForecasts = locations.map((location) => ({
    locationName: location.name || "Selected location",
    days: [
      { day: "Mon", high: 78, low: 62, condition: "Sunny" },
      { day: "Tue", high: 75, low: 59, condition: "Partly Cloudy" },
      { day: "Wed", high: 70, low: 55, condition: "Light Rain" },
      { day: "Thu", high: 73, low: 57, condition: "Breezy" },
      { day: "Fri", high: 80, low: 63, condition: "Clear" },
    ],
  }));

  //<MapComponent /> contains <MapContent />, which contains the Map DOM element
  return (
    <>
      <div className="min-vh-100">
        <Container>
          <Row>
            <Col xs={8} className="position-relative">
              <Card style={{ height: "30rem" }}>
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
                <div className="results-header d-flex align-items-center justify-content-between mb-3">
                  <h5 className="mb-0">
                    <i className="bi bi-geo-alt-fill me-2 text-primary"></i>
                    Results ({locations.length})
                  </h5>
                  <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2">
                    {locations.length}
                  </span>
                </div>
                {locations.length === 0 ? (
                  <div className="empty-results text-center text-muted py-5">
                    <i className="bi bi-search fs-1 mb-3"></i>
                    <p className="mb-0">
                      Search for a location to see results here.
                    </p>
                  </div>
                ) : (
                  locations.map((location, index) => (
                    <button
                      type="button"
                      key={index}
                      className="result-item"
                      onClick={() => handleLocationClick(location)}
                    >
                      <div className="result-item-icon">
                        <i className="bi bi-pin-map-fill"></i>
                      </div>
                      <div className="result-item-body">
                        <strong>
                          {location.name || `Location ${index + 1}`}
                        </strong>
                        <p className="result-coords mb-1">
                          <i className="bi bi-geo-alt-fill me-1"></i>
                          {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                        </p>
                        {location.address && (
                          <p className="result-address mb-0">
                            <i className="bi bi-house-door me-1"></i>
                            {location.address}
                          </p>
                        )}
                      </div>
                      <div className="result-item-action">
                        <i className="bi bi-chevron-right"></i>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </Col>
          </Row>
          <Row className="mt-4">
            <Col>
              <Card>
                <Card.Body>
                  <h5>Daily Forecast</h5>
                  {dummyForecasts.length === 0 ? (
                    <p className="text-muted">
                      Select one or more locations to view a condensed forecast.
                    </p>
                  ) : (
                    dummyForecasts.map((forecast, index) => (
                      <div key={index} className="mb-3">
                        <h6 className="mb-2">{forecast.locationName}</h6>
                        <div className="forecast-list">
                          {forecast.days.map((day) => (
                            <div
                              key={day.day}
                              className="forecast-item d-flex justify-content-between align-items-center"
                            >
                              <div className="d-flex align-items-center">
                                <i
                                  className={`bi ${getIconForCondition(
                                    day.condition,
                                  )} me-2 fs-5`}
                                  aria-hidden="true"
                                ></i>
                                <strong className="me-2">{day.day}</strong>
                                <span className="text-muted">
                                  {day.condition}
                                </span>
                              </div>
                              <div className="text-nowrap">
                                {day.high}° / {day.low}°
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </Card.Body>
              </Card>
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
