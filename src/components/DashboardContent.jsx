import { useEffect, useState } from "react";
import { Card, Col, ListGroup, Row } from "react-bootstrap";
import { useSelector } from "react-redux";

const DashboardContent = () => {
  const weather = useSelector((state) => state.currentWeather.value);
  const [days, setDays] = useState([]);

  useEffect(() => {
    if (!weather) return;

    const source = weather.forecastDays;

    if (!Array.isArray(source)) return;

    source.forEach((item) => {
      const date = item.displayDate;

      // Try OpenWeather style
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

      setDays([{ date, day, night }]);
    });
    console.log(days);
  }, [weather]);

  return (
    <>
      <Row className="mt-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Daily Forecast</Card.Title>
              {days.length === 0 ? (
                <p className="text-muted">No forecast available.</p>
              ) : (
                days.map((d, idx) => {
                  const dateLabel = new Date(
                    d.date.year,
                    d.date.month,
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
                        <Col md={6} className="mb-2">
                          <Card className="h-100">
                            <Card.Body>
                              <Card.Subtitle className="mb-2 text-muted">
                                Day
                              </Card.Subtitle>
                              <ListGroup variant="flush">
                                <ListGroup.Item>
                                  <strong>Precipitation:</strong>{" "}
                                  {d.day.precipitation.probability.percent ??
                                    "--"}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                  <strong>Wind:</strong>{" "}
                                  {d.day.wind.speed.value ?? "--"}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                  <strong>Humidity:</strong>{" "}
                                  {d.day.relativeHumidity ?? "--"}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                  <strong>UV Index:</strong>{" "}
                                  {d.day.uvIndex ?? "--"}
                                </ListGroup.Item>
                              </ListGroup>
                            </Card.Body>
                          </Card>
                        </Col>

                        <Col md={6}>
                          <Card className="h-100">
                            <Card.Body>
                              <Card.Subtitle className="mb-2 text-muted">
                                Night
                              </Card.Subtitle>
                              <ListGroup variant="flush">
                                <ListGroup.Item>
                                  <strong>Precipitation:</strong>{" "}
                                  {d.night.precipitation.probability.percent ??
                                    "--"}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                  <strong>Wind:</strong>{" "}
                                  {d.night.wind.speed.value ?? "--"}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                  <strong>Humidity:</strong>{" "}
                                  {d.night.relativeHumidity ?? "--"}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                  <strong>UV Index:</strong>{" "}
                                  {d.night.uvIndex ?? "--"}
                                </ListGroup.Item>
                              </ListGroup>
                            </Card.Body>
                          </Card>
                        </Col>
                      </Row>
                    </div>
                  );
                })
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default DashboardContent;
