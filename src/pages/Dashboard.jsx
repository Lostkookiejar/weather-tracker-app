import { useCallback, useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  ListGroup,
  Badge,
  ProgressBar,
  Spinner,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentPosition } from "../features/locationSlice";
import { getCurrentWeather } from "../features/currentWeatherSlice";

function Dashboard() {
  //.env
  const mapsApiKey = import.meta.env.VITE_MAPS_API_KEY;

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

            {/**
             * Renders as test UI when currentPosition is returned
             * TODO: PLEASE DELETE WHEN NO LONGER NEEDED
             */}
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
          </Col>
        </Row>
        <Row className="mb-4">
          <Col>
            {/**
             * Stat tracker dashboard
             * TODO: CREATE FUNCTION TO GET WEATHER DATA FROM EXTERNAL API
             */}
            <h1 className="mb-2">Dashboard</h1>
            <p className="text-muted">
              Overview of weather tracking metrics, status updates, and recent
              alerts.
            </p>
          </Col>
        </Row>

        <Row className="g-4">
          <Col lg={4}>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <Card.Title>Description</Card.Title>
                <Card.Text className="display-6 fw-bold mb-0">--</Card.Text>
                <div className="text-success mt-3">--</div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <Card.Title>Current Alerts</Card.Title>
                <Card.Text className="display-6 fw-bold mb-0">--</Card.Text>
                <div className="text-danger mt-3">--</div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <Card.Title>Uptime</Card.Title>
                <Card.Text className="display-6 fw-bold mb-3">--</Card.Text>
                <ProgressBar now={0} label="0%" />
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mt-4 g-4">
          <Col xl={8}>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <Card.Title>Weather Insights</Card.Title>
                <Card.Text className="text-muted">
                  Track temperature swings, humidity levels, and pressure
                  changes across all active stations.
                </Card.Text>

                <Row className="mt-4">
                  <Col sm={4} className="mb-3 mb-sm-0">
                    <div className="p-3 rounded bg-white border">
                      <h6 className="text-uppercase text-secondary">
                        Temperature
                      </h6>
                      <p className="fs-3 mb-0">--</p>
                      <small className="text-muted">
                        Average over last hour
                      </small>
                    </div>
                  </Col>
                  <Col sm={4} className="mb-3 mb-sm-0">
                    <div className="p-3 rounded bg-white border">
                      <h6 className="text-uppercase text-secondary">
                        Humidity
                      </h6>
                      <p className="fs-3 mb-0">--</p>
                      <small className="text-muted">
                        Current station average
                      </small>
                    </div>
                  </Col>
                  <Col sm={4}>
                    <div className="p-3 rounded bg-white border">
                      <h6 className="text-uppercase text-secondary">Wind</h6>
                      <p className="fs-3 mb-0">--</p>
                      <small className="text-muted">Peak gusts</small>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>

          <Col xl={4}>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <Card.Title>Recent Alerts</Card.Title>
                <ListGroup variant="flush" className="mt-3">
                  <ListGroup.Item>
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <div className="fw-semibold">--</div>
                        <small className="text-muted">--</small>
                      </div>
                      <Badge bg="warning" pill>
                        --
                      </Badge>
                    </div>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <div className="fw-semibold">--</div>
                        <small className="text-muted">--</small>
                      </div>
                      <Badge bg="danger" pill>
                        --
                      </Badge>
                    </div>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <div className="fw-semibold">--</div>
                        <small className="text-muted">--</small>
                      </div>
                      <Badge bg="info" pill>
                        --
                      </Badge>
                    </div>
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col>
            <Card className="shadow-sm">
              <Card.Body>
                <Card.Title>Action Center</Card.Title>
                <p className="text-muted">
                  Review station health and respond to the latest weather
                  warnings.
                </p>
                <Button variant="primary">Open Alerts</Button>
                <Button variant="outline-secondary" className="ms-2">
                  Review Stations
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
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

export default Dashboard;
