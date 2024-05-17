import React, { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import AuthService from "../data/AuthService";
const RegisterPage: React.FC = () => {
  const authService = AuthService.getInstance();
  const [isLoading, setSetLoading] = useState(false);
  const [validated, setValidated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleRegister(event: any) {
    event.preventDefault();
    event.stopPropagation();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      setValidated(true);
      return;
    }
    setSetLoading(true);
    await authService.register(username, password);
    setSetLoading(false);
    setValidated(false);
  }

  return (
    <>
      <Container fluid="lg" className="mt-5">
        <div className="login-page">
          <div className="login-page__form">
            <Form noValidate validated={validated} onSubmit={handleRegister}>
              <Form.Group className="mb-3" controlId="formBasicUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter username"
                  required
                  autoFocus
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <Form.Control.Feedback type="invalid">
                  Please enter a valid username.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  required
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Form.Control.Feedback type="invalid">
                  Please enter a valid password.
                </Form.Control.Feedback>
              </Form.Group>
              <div className="d-grid gap-2">
                <Button variant="primary" type="submit" disabled={isLoading}>
                  {isLoading ? "Loading..." : "Register"}
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </Container>
    </>
  );
};

export default RegisterPage;
