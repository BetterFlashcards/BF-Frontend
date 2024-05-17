import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import DeckListPage from "./pages/DeckListPage";
import AboutPage from "./pages/AboutPage";
import DeckDetailsPage from "./pages/DeckDetailsPage";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { Toaster } from "sonner";
import ProtectedRoute from "./pages/ProtectedRoute";
import React, { useEffect, useState } from "react";
import { User } from "./types/types";
import AuthService, { UserChangeCallback } from "./data/AuthService";

const App: React.FC = () => {
  const authService = AuthService.getInstance();
  const [user, setUser] = useState<User | null>(null);

  const userChangeCallback: UserChangeCallback = (u) => setUser(u);

  useEffect(() => {
    setUser(authService.getUser());
    authService.subscribe(userChangeCallback);
    return () => authService.unsubscribe(userChangeCallback);
  }, []);

  return (
    <>
      <Router>
        <div>
          <Navbar bg="light" expand="lg">
            <Container fluid="lg">
              <Navbar.Brand href="/">Flashcards App</Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto" activeKey={location.pathname}>
                  <Nav.Link as={Link} to="/about">
                    About
                  </Nav.Link>
                  {user ? (
                    <>
                      <Nav.Link as={Link} to="/decks">
                        Your Decks
                      </Nav.Link>
                      <Button
                        type="button"
                        variant="link"
                        className="text-decoration-none"
                        onClick={() => authService.logout()}
                      >
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Nav.Link as={Link} to="/login">
                        Login
                      </Nav.Link>
                      <Nav.Link as={Link} to="/register">
                        Register
                      </Nav.Link>
                    </>
                  )}
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/login"
              element={
                <ProtectedRoute user={user} notLoggedIn>
                  <LoginPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/register"
              element={
                <ProtectedRoute user={user} notLoggedIn>
                  <RegisterPage />
                </ProtectedRoute>
              }
            />
            <Route path="/about" element={<AboutPage />} />
            <Route
              path="/decks"
              element={
                <ProtectedRoute user={user}>
                  <DeckListPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/decks/:id"
              element={
                <ProtectedRoute user={user}>
                  <DeckDetailsPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
        <Toaster richColors closeButton position="top-center" />
      </Router>
    </>
  );
};

export default App;
