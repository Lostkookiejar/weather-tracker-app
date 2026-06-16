import { useEffect, useState } from "react";
import { Card, Col, ListGroup, Row, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import "../App.css";

const DashboardContent = () => {
  const weather = useSelector((state) => state.currentWeather.value);
  const [days, setDays] = useState([]);
  const [forecastState, setForecastState] = useState("false");

  useEffect(() => {
    setForecastState("pending");
    if (!weather) {
      setForecastState("error");
      return;
    }

    const source = weather.forecastDays;
    if (!Array.isArray(source)) return;

    var daysCopy = [];
    source.forEach((item) => {
      const date = item.displayDate;

      if (item.daytimeForecast) {
        var day = {
          ...item.daytimeForecast,
        };
      }
      if (item.nighttimeForecast) {
        var night = {
          ...item.nighttimeForecast,
        };
      }

      daysCopy.push({ date, day, night });
    });
    setDays([...daysCopy]);
    setForecastState("false");
  }, [weather]);

  return (
    <>
      <Row className="mt-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>
                <strong>Daily Forecast</strong>
              </Card.Title>
              {forecastState == "pending" && <Spinner />}
              {forecastState == "error" && (
                <p>
                  Something went wrong. Please refresh browser and enable
                  location access
                </p>
              )}
              {days.length !== 0 &&
                days.map((d, idx) => {
                  const dateLabel = new Date(
                    d.date.year,
                    d.date.month - 1,
                    d.date.day,
                  ).toLocaleString("en-MY", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  });

                  return (
                    <div className="mb-3" key={idx}>
                      <h6 className="mb-2">{dateLabel}</h6>
                      <Row>
                        <Col md={6} className="forecast-day">
                          <Card className="h-100">
                            <Card.Body>
                              <Card.Subtitle className="mb-2 text-muted d-flex align-items-center gap-2">
                                <span className="forecast-mode-icon">☀️</span>{" "}
                                Day
                              </Card.Subtitle>
                              <ListGroup variant="flush">
                                <ListGroup.Item className="d-flex align-items-center forecast-metric">
                                  <span className="forecast-metric-icon">
                                    <i className="bi bi-cloud-rain-fill"></i>
                                  </span>
                                  <span>
                                    <strong>Precipitation:</strong>{" "}
                                    {d.day.precipitation.probability.percent ??
                                      "--"}
                                  </span>
                                </ListGroup.Item>
                                <ListGroup.Item className="d-flex align-items-center forecast-metric">
                                  <span className="forecast-metric-icon">
                                    <i className="bi bi-wind"></i>
                                  </span>
                                  <span>
                                    <strong>Wind:</strong>{" "}
                                    {d.day.wind.speed.value ?? "--"}
                                  </span>
                                </ListGroup.Item>
                                <ListGroup.Item className="d-flex align-items-center forecast-metric">
                                  <span className="forecast-metric-icon">
                                    <i className="bi bi-droplet"></i>
                                  </span>
                                  <span>
                                    <strong>Humidity:</strong>{" "}
                                    {d.day.relativeHumidity ?? "--"}
                                  </span>
                                </ListGroup.Item>
                                <ListGroup.Item className="d-flex align-items-center forecast-metric">
                                  <span className="forecast-metric-icon">
                                    <i className="bi bi-sun-fill"></i>
                                  </span>
                                  <span>
                                    <strong>UV Index:</strong>{" "}
                                    {d.day.uvIndex ?? "--"}
                                  </span>
                                </ListGroup.Item>
                              </ListGroup>
                            </Card.Body>
                          </Card>
                        </Col>

                        <Col md={6} className="forecast-night">
                          <Card className="h-100">
                            <Card.Body>
                              <Card.Subtitle className="mb-2 text-muted d-flex align-items-center gap-2">
                                <span className="forecast-mode-icon">🌙</span>{" "}
                                Night
                              </Card.Subtitle>
                              <ListGroup variant="flush">
                                <ListGroup.Item className="d-flex align-items-center forecast-metric">
                                  <span className="forecast-metric-icon">
                                    <i className="bi bi-cloud-rain-fill"></i>
                                  </span>
                                  <span>
                                    <strong>Precipitation:</strong>{" "}
                                    {d.night.precipitation.probability
                                      .percent ?? "--"}
                                  </span>
                                </ListGroup.Item>
                                <ListGroup.Item className="d-flex align-items-center forecast-metric">
                                  <span className="forecast-metric-icon">
                                    <i className="bi bi-wind"></i>
                                  </span>
                                  <span>
                                    <strong>Wind:</strong>{" "}
                                    {d.night.wind.speed.value ?? "--"}
                                  </span>
                                </ListGroup.Item>
                                <ListGroup.Item className="d-flex align-items-center forecast-metric">
                                  <span className="forecast-metric-icon">
                                    <i className="bi bi-droplet"></i>
                                  </span>
                                  <span>
                                    <strong>Humidity:</strong>{" "}
                                    {d.night.relativeHumidity ?? "--"}
                                  </span>
                                </ListGroup.Item>
                                <ListGroup.Item className="d-flex align-items-center forecast-metric">
                                  <span className="forecast-metric-icon">
                                    <i className="bi bi-sun-fill"></i>
                                  </span>
                                  <span>
                                    <strong>UV Index:</strong>{" "}
                                    {d.night.uvIndex ?? "--"}
                                  </span>
                                </ListGroup.Item>
                              </ListGroup>
                            </Card.Body>
                          </Card>
                        </Col>
                      </Row>
                    </div>
                  );
                })}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default DashboardContent;
