import {
  Container,
  Row,
  Col,
  Card,
  Button,
  ListGroup,
  Badge,
  ProgressBar,
} from "react-bootstrap";

function Dashboard() {
  return (
    <div className="min-vh-100 bg-light py-4">
      <Container>
        <Row className="mb-4">
          <Col>
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
                <Card.Title>Active Stations</Card.Title>
                <Card.Text className="display-6 fw-bold mb-0">12</Card.Text>
                <div className="text-success mt-3">
                  2 new stations added in the last 24 hours
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <Card.Title>Current Alerts</Card.Title>
                <Card.Text className="display-6 fw-bold mb-0">3</Card.Text>
                <div className="text-danger mt-3">
                  Severe wind and flood alerts active
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <Card.Title>Uptime</Card.Title>
                <Card.Text className="display-6 fw-bold mb-3">99.7%</Card.Text>
                <ProgressBar now={99.7} label="99.7%" />
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
                      <p className="fs-3 mb-0">22°C</p>
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
                      <p className="fs-3 mb-0">63%</p>
                      <small className="text-muted">
                        Current station average
                      </small>
                    </div>
                  </Col>
                  <Col sm={4}>
                    <div className="p-3 rounded bg-white border">
                      <h6 className="text-uppercase text-secondary">Wind</h6>
                      <p className="fs-3 mb-0">14 km/h</p>
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
                        <div className="fw-semibold">Flood Watch</div>
                        <small className="text-muted">Coastal region</small>
                      </div>
                      <Badge bg="warning" pill>
                        Medium
                      </Badge>
                    </div>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <div className="fw-semibold">Wind Advisory</div>
                        <small className="text-muted">Northern range</small>
                      </div>
                      <Badge bg="danger" pill>
                        High
                      </Badge>
                    </div>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <div className="fw-semibold">Temperature Spike</div>
                        <small className="text-muted">East valley</small>
                      </div>
                      <Badge bg="info" pill>
                        Low
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

export default Dashboard;
