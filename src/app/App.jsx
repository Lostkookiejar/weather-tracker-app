import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import { Container, Nav, Navbar } from "react-bootstrap";
import LandingPage from "../pages/LandingPage";
import Planner from "../pages/Planner";
import Dashboard from "../pages/Dashboard";
import store from "./store";
import { Provider } from "react-redux";

const App = function () {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <Navb />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/planner" element={<Planner />} />
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </Provider>
    </BrowserRouter>
  );
};

const Navb = function () {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-3">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Weather Tracker
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/planner">
              Trip Planner
            </Nav.Link>
            <Nav.Link as={Link} to="/">
              Dashboard
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default App;
