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

const STORAGE_KEY = "planner-trip-state";

function Planner() {
  const mapsApiKey = import.meta.env.VITE_MAPS_API_KEY;
  const [locations, setLocations] = useState([]);
  const [markedLocations, setMarkedLocations] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [tripForecasts, setTripForecasts] = useState([]);
  const [isForecastLoading, setIsForecastLoading] = useState(false);
  const [forecastError, setForecastError] = useState("");
  const [mapCenter, setMapCenter] = useState({
    lat: -33.860664,
    lng: 151.208138,
  });

  useEffect(() => {
    try {
      const savedState = window.localStorage.getItem(STORAGE_KEY);
      if (!savedState) return;

      const parsedState = JSON.parse(savedState);
      if (parsedState.markedLocations) {
        setMarkedLocations(parsedState.markedLocations);
      }
      if (parsedState.tripForecasts) {
        setTripForecasts(parsedState.tripForecasts);
      }
      if (parsedState.mapCenter) {
        setMapCenter(parsedState.mapCenter);
      }
    } catch (error) {
      console.error("Failed to restore planner state:", error);
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          markedLocations,
          tripForecasts,
          mapCenter,
        }),
      );
    } catch (error) {
      console.error("Failed to save planner state:", error);
    }
  }, [markedLocations, tripForecasts, mapCenter]);

  //sets a yellow marker on the map widget when clicked.
  const handleMapClick = (ev) => {
    if (!ev.detail.latLng) return;

    const newMarker = {
      lat: ev.detail.latLng.lat,
      lng: ev.detail.latLng.lng,
      name: "",
      address: "",
    };

    setMarkedLocations((prev) => {
      const nextMarker = {
        ...newMarker,
        name: `Location ${prev.length + 1}`,
      };

      return [...prev, nextMarker];
    });
    setMapCenter({ lat: newMarker.lat, lng: newMarker.lng });
  };

  //boiler function for setting search query
  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  //search query function for pressing the 'Search' button or pressing the Enter key
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

  const handleMarkerRemove = (markerIndex) => {
    setMarkedLocations((prev) =>
      prev.filter((_, index) => index !== markerIndex),
    );
    setTripForecasts((prev) =>
      prev.filter((_, index) => index !== markerIndex),
    );
  };

  const getIconForCondition = (condition) => {
    const normalizedCondition = String(condition || "").toLowerCase();

    if (normalizedCondition.includes("clear")) {
      return "bi-brightness-high-fill text-warning";
    }

    if (normalizedCondition.includes("cloud")) {
      return "bi-cloud-sun-fill text-secondary";
    }

    if (normalizedCondition.includes("thunder")) {
      return "bi-lightning-fill text-warning";
    }

    if (normalizedCondition.includes("rain")) {
      return "bi-cloud-rain-fill text-info";
    }

    if (normalizedCondition.includes("snow")) {
      return "bi-snow2 text-primary";
    }

    if (normalizedCondition.includes("wind")) {
      return "bi-wind text-primary";
    }

    return "bi-cloud-fill text-muted";
  };

  const normalizeForecastData = (location, weatherResponse) => {
    const forecastDays = weatherResponse?.forecastDays ?? [];

    return {
      locationName: location.name || "Selected location",
      days: forecastDays.map((day) => {
        const displayDate = day.displayDate;
        const dayLabel =
          displayDate &&
          new Date(
            displayDate.year,
            displayDate.month - 1,
            displayDate.day,
          ).toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          });

        return {
          day: dayLabel || "Forecast",
          high:
            day.maxTemperature?.degrees != null
              ? Math.round(day.maxTemperature.degrees)
              : "--",
          low:
            day.minTemperature?.degrees != null
              ? Math.round(day.minTemperature.degrees)
              : "--",
          condition:
            day.daytimeForecast?.weatherCondition?.description?.text ||
            "No forecast available",
          conditionType: day.daytimeForecast?.weatherCondition?.type || "",
        };
      }),
    };
  };

  /*
   * markedLocations = [
   *  {
   *    lat: int,
   *    lng: int,
   *    name: string ,
   *    address: string
   *  },
   * ]
   **/

  useEffect(() => {
    if (!markedLocations.length) {
      setTripForecasts([]);
      setForecastError("");
      return;
    }

    async function fetchTripWeather() {
      setIsForecastLoading(true);
      setForecastError("");

      try {
        const weatherData = await Promise.all(
          markedLocations.map(async (location) => {
            const url = `https://weather.googleapis.com/v1/forecast/days:lookup?key=${mapsApiKey}&location.latitude=${location.lat}&location.longitude=${location.lng}&days=5`;

            const response = await fetch(url);
            if (!response.ok) {
              throw new Error(`Weather request failed: ${response.status}`);
            }

            const weather = await response.json();
            return { location, weather };
          }),
        );

        const normalizedForecasts = weatherData.map(({ location, weather }) =>
          normalizeForecastData(location, weather),
        );
        setTripForecasts(normalizedForecasts);
      } catch (error) {
        console.error("Failed to fetch trip weather:", error);
        setForecastError(
          "We couldn't load the forecast for the selected locations.",
        );
        setTripForecasts([]);
      } finally {
        setIsForecastLoading(false);
      }
    }

    fetchTripWeather();
  }, [markedLocations, mapsApiKey]);

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
                  markedLocations={markedLocations}
                  handleMapClick={handleMapClick}
                  handleMarkerRemove={handleMarkerRemove}
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
                  {isForecastLoading && (
                    <p className="text-muted">Loading forecast data...</p>
                  )}
                  {forecastError && (
                    <p className="text-danger">{forecastError}</p>
                  )}
                  {!isForecastLoading &&
                  !forecastError &&
                  tripForecasts.length === 0 ? (
                    <p className="text-muted">
                      Click on the map to add yellow-marked locations for the
                      forecast.
                    </p>
                  ) : (
                    tripForecasts.map((forecast, index) => {
                      const marker = markedLocations[index];

                      return (
                        <div
                          key={`${forecast.locationName}-${index}`}
                          className="mb-3"
                        >
                          <h6
                            className="mb-2 text-primary"
                            role="button"
                            tabIndex={0}
                            onClick={() =>
                              marker && handleLocationClick(marker)
                            }
                            onKeyDown={(event) => {
                              if (event.key === "Enter" || event.key === " ") {
                                event.preventDefault();
                                marker && handleLocationClick(marker);
                              }
                            }}
                          >
                            {forecast.locationName}
                          </h6>
                          <div className="forecast-list">
                            {forecast.days.map((day, dayIndex) => (
                              <div
                                key={`${day.day}-${dayIndex}`}
                                className="forecast-item d-flex justify-content-between align-items-center"
                              >
                                <div className="d-flex align-items-center">
                                  <i
                                    className={`bi ${getIconForCondition(
                                      day.conditionType || day.condition,
                                    )} me-2 fs-5`}
                                    aria-hidden="true"
                                  ></i>
                                  <strong className="me-2">{day.day}</strong>
                                  <span className="text-muted">
                                    {day.condition}
                                  </span>
                                </div>
                                <div className="text-nowrap">
                                  {day.high}°C / {day.low}°C
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })
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

function MapComponent({
  mapsApiKey,
  locations,
  markedLocations,
  handleMapClick,
  handleMarkerRemove,
  mapCenter,
}) {
  return (
    <APIProvider apiKey={mapsApiKey} libraries={["places"]}>
      <MapContent
        locations={locations}
        markedLocations={markedLocations}
        handleMapClick={handleMapClick}
        handleMarkerRemove={handleMarkerRemove}
        mapCenter={mapCenter}
      />
    </APIProvider>
  );
}

function MapContent({
  locations,
  markedLocations,
  handleMapClick,
  handleMarkerRemove,
  mapCenter,
}) {
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
      {markedLocations && (
        <YellowPoiMarkers
          pois={markedLocations}
          onRemoveMarker={handleMarkerRemove}
        />
      )}
    </Map>
  );
}

const PoiMarkers = ({ pois }) => {
  return (
    <>
      {pois.map((poi, index) => (
        <AdvancedMarker key={`${poi.lat}-${poi.lng}-${index}`} position={poi}>
          <Pin />
        </AdvancedMarker>
      ))}
    </>
  );
};

const YellowPoiMarkers = ({ pois, onRemoveMarker }) => {
  return (
    <>
      {pois.map((poi, index) => (
        <AdvancedMarker
          key={`${poi.lat}-${poi.lng}-${index}-yellow`}
          position={poi}
          onClick={() => onRemoveMarker(index)}
        >
          <Pin
            background="#facc15"
            borderColor="#ca8a04"
            glyphColor="#1f2937"
            glyph={String(index + 1)}
          />
        </AdvancedMarker>
      ))}
    </>
  );
};

export default Planner;
