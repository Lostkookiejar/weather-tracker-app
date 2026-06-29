import {
  Container,
  Row,
  Col,
  Button,
  Card,
  ListGroup,
  Badge,
} from "react-bootstrap";
import { Link } from "react-router-dom";

const highlights = [
  {
    icon: "bi-cloud-sun",
    title: "Live forecasts",
    text: "See current conditions and alerts at a glance before heading out.",
  },
  {
    icon: "bi-map-fill",
    title: "Trip planning",
    text: "Pin destinations, compare routes, and prepare for changing skies.",
  },
  {
    icon: "bi-shield-check",
    title: "Reliable insights",
    text: "Make confident decisions with a streamlined weather dashboard.",
  },
];

const featurePoints = [
  "Real-time weather insights for your current location.",
  "Interactive map-based trip planning with place markers.",
  "One dashboard for forecasts, alerts, and station health.",
];

function LandingPage() {
  return (
    <div className="min-vh-100 bg-light py-5">
      <Container>
        <Row className="align-items-center mb-5 g-4">
          <Col lg={7} className="mb-4 mb-lg-0">
            <Badge
              bg="primary-subtle"
              text="primary"
              className="rounded-pill mb-3 px-3 py-2"
            >
              Weather intelligence for every trip
            </Badge>
            <h1 className="display-4 fw-bold text-dark mb-3">
              Plan every outing with confidence.
            </h1>
            <p className="lead text-muted mb-4">
              Stay ahead of changing weather with a clear dashboard,
              location-aware alerts, and an interactive trip planner built for
              modern travel and outdoor planning.
            </p>
            <div className="d-flex gap-2 flex-wrap mb-4">
              <Button as={Link} to="/dashboard" variant="primary" size="lg">
                <i className="bi bi-speedometer2 me-2"></i>
                View Dashboard
              </Button>
              <Button
                as={Link}
                to="/planner"
                variant="outline-primary"
                size="lg"
              >
                <i className="bi bi-map me-2"></i>
                Open Trip Planner
              </Button>
            </div>
            <div className="d-flex flex-wrap gap-4 text-muted">
              <span className="d-flex align-items-center gap-2">
                <i className="bi bi-cloud-sun text-primary fs-5"></i>
                Live updates
              </span>
              <span className="d-flex align-items-center gap-2">
                <i className="bi bi-geo-alt text-primary fs-5"></i>
                Location-aware
              </span>
              <span className="d-flex align-items-center gap-2">
                <i className="bi bi-lightning-charge text-primary fs-5"></i>
                Quick alerts
              </span>
            </div>
          </Col>

          <Col lg={5}>
            <Card className="shadow-lg border-0 rounded-4 overflow-hidden">
              <Card.Body className="p-4">
                <div className="d-flex align-items-center mb-3">
                  <div className="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
                    <i className="bi bi-broadcast-pin text-primary fs-4"></i>
                  </div>
                  <div>
                    <h5 className="mb-1">Why Weather Tracker?</h5>
                    <p className="text-muted mb-0">
                      Everything you need in one place.
                    </p>
                  </div>
                </div>
                <ListGroup variant="flush">
                  {featurePoints.map((point) => (
                    <ListGroup.Item key={point} className="px-0">
                      <i className="bi bi-check-circle-fill text-success me-2"></i>
                      {point}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row xs={1} md={3} className="g-4">
          {highlights.map((item) => (
            <Col key={item.title}>
              <Card className="h-100 shadow-sm border-0 rounded-4">
                <Card.Body>
                  <div className="rounded-circle bg-primary bg-opacity-10 p-3 d-inline-flex mb-3">
                    <i className={`bi ${item.icon} text-primary fs-4`}></i>
                  </div>
                  <h5>{item.title}</h5>
                  <p className="text-muted mb-0">{item.text}</p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default LandingPage;
