import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Nav, Container } from "react-bootstrap";
import DeckListPage from "./pages/DeckListPage";
import AboutPage from "./pages/AboutPage";
import DeckDetailsPage from "./pages/DeckDetailsPage";
import Home from "./pages/Home";

function App() {
  return (
    <Router>
      <div>
        <Navbar bg="light" expand="lg">
          <Container fluid="lg">
            <Navbar.Brand href="/">Flashcards App</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link as={Link} to="/decks">
                  Your Decks
                </Nav.Link>
                <Nav.Link as={Link} to="/about">
                  About
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/decks" element={<DeckListPage />} />
          <Route path="/decks/:id" element={<DeckDetailsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
