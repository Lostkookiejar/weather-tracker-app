import { useCallback, useEffect, useState } from "react";
import { Container, Row, Col, Badge, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentPosition } from "../features/locationSlice";
import { getCurrentWeather } from "../features/currentWeatherSlice";
import DashboardContent from "../components/DashboardContent";

const LOCATION_CACHE_KEY = "user-current-location";

//TODO ADD IN TEXT INPUT TO KEY IN LOCATION MANUALLY
function Dashboard() {
  //.env

  //React Hook for Redux Management
  const dispatch = useDispatch();

  //React Hook to get current position from Redux store @ store.js
  const currentPosition = useSelector((state) => state.location.value);

  //Called on success from HTML Geolocation API call
  const handleCurrentLocation = useCallback(
    (position) => {
      const response = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      // Cache the location to avoid repeated geolocation prompts
      window.localStorage.setItem(LOCATION_CACHE_KEY, JSON.stringify(response));
      dispatch(getCurrentPosition(response));
    },
    [dispatch],
  );

  //Called on error from HTML Geolocation API call
  const [geolocationError, setGeolocationError] = useState(false);
  const handleLocationError = useCallback((error) => {
    console.error("Geolocation error:", error);
    setGeolocationError(true);
  }, []);

  //called when currentPosition is updated successfully.
  useEffect(() => {
    if (!currentPosition?.lat || !currentPosition?.lng) return;
    if (geolocationError) return;

    dispatch(getCurrentWeather(currentPosition));
  }, [currentPosition?.lat, currentPosition?.lng]);

  return (
    <div className="min-vh-100 bg-light py-4">
      <Container>
        <Row>
          <Col>
            {/**
             * Handling Geolocation after user accepts Geolocation
             * API Prompt
             */}
            <GeolocationRequest
              currentPosition={currentPosition}
              onSuccess={handleCurrentLocation}
              onError={handleLocationError}
            >
              <div>
                <Spinner />
                <div className="text-muted">
                  Fetching Current Position...(Please allow access to your
                  location if prompted)
                </div>
              </div>
            </GeolocationRequest>

            <CurrentPositionIsValid
              currentPosition={currentPosition}
              geolocationError={geolocationError}
            />
          </Col>
        </Row>

        {/*src/components/DashboardContent*/}
        <DashboardContent />
      </Container>
    </div>
  );
}

const GeolocationRequest = ({
  currentPosition,
  onSuccess,
  onError,
  children,
}) => {
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) {
      onError?.(new Error("Geolocation is not supported by this browser."));
      return;
    }

    if (currentPosition.lat || currentPosition.lng) return;

    // Check if location is already cached
    try {
      const cachedLocation = window.localStorage.getItem(LOCATION_CACHE_KEY);
      if (cachedLocation) {
        const location = JSON.parse(cachedLocation);
        // Create a mock position object matching the geolocation API response
        onSuccess({
          coords: {
            latitude: location.lat,
            longitude: location.lng,
          },
        });
        return;
      }
    } catch (error) {
      console.warn("Failed to retrieve cached location:", error);
    }

    setIsPending(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsPending(false);
        onSuccess(position);
      },
      (error) => {
        setIsPending(false);
        onError?.(error);
      },
    );
  }, [onSuccess, onError]);

  if (!isPending) {
    return null;
  }

  return <div>{children ?? "Something went wrong. Please try again."}</div>;
};

const CurrentPositionIsValid = ({ currentPosition, geolocationError }) => {
  return (
    <>
      {currentPosition.lat ? (
        <p>
          <Badge bg="success">Current Position received</Badge>
        </p>
      ) : !geolocationError ? (
        <p>
          <Badge bg="warning">Current Position pending...</Badge>
        </p>
      ) : (
        <p>
          <Badge bg="danger">Something went wrong.</Badge>
        </p>
      )}
    </>
  );
};

export default Dashboard;
