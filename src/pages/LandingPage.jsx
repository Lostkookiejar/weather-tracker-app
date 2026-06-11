import { Container, Row, Col, Button, Card, ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <div className="min-vh-100 bg-light py-5">
      <Container>
        <Row className="align-items-center mb-5">
          <Col lg={6} className="mb-4 mb-lg-0">
            <h1 className="display-4 fw-bold">Weather Tracker</h1>
            <p className="lead text-muted">
              Stay ahead of changing weather with a clear dashboard,
              location-aware alerts, and an interactive trip planner built for
              modern travel and outdoor planning.
            </p>
            <div className="d-flex gap-2 flex-wrap">
              <Button as={Link} to="/dashboard" variant="primary" size="lg">
                View Dashboard
              </Button>
              <Button
                as={Link}
                to="/planner"
                variant="outline-primary"
                size="lg"
              >
                Open Trip Planner
              </Button>
            </div>
          </Col>
          <Col lg={6}>
            <Card className="shadow-sm border-0">
              <Card.Body>
                <h5 className="mb-3">Why Weather Tracker?</h5>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    Real-time weather insights for your current location.
                  </ListGroup.Item>
                  <ListGroup.Item>
                    Interactive map-based trip planning with place markers.
                  </ListGroup.Item>
                  <ListGroup.Item>
                    One dashboard for current alerts, station health, and
                    weather metrics.
                  </ListGroup.Item>
                  <ListGroup.Item>
                    Built with React, Bootstrap, and Google Maps for fast load
                    times.
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="g-4">
          <Col md={4}>
            <Card className="h-100 shadow-sm border-0">
              <Card.Body>
                <h5>Track</h5>
                <p className="text-muted mb-0">
                  Monitor weather conditions, active alerts, and key station
                  metrics in one place.
                </p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100 shadow-sm border-0">
              <Card.Body>
                <h5>Plan</h5>
                <p className="text-muted mb-0">
                  Use the trip planner map to pin locations, review routes, and
                  prepare for weather changes.
                </p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100 shadow-sm border-0">
              <Card.Body>
                <h5>Act</h5>
                <p className="text-muted mb-0">
                  Make smarter decisions with weather-aware alerts and an
                  easy-to-use mobile-friendly layout.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default LandingPage;
