// frontend/src/Login.jsx

import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Container, Alert } from 'react-bootstrap';

const Login = ({ onLogin }) => {
  const [inputs, setInputs] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // API request URL points to the custom Django login endpoint
      const response = await axios.post('http://127.0.0.1:8000/api/login/', {
        username: inputs.username,
        password: inputs.password
      });

      // **Key update: extract token and user object from response**
      if (response.data && response.data.token && response.data.user) {
        const token = response.data.token;
        const user = response.data.user; // Retrieve the entire user object

        // Call the AuthContext login function, passing token, user.id, user.username
        if (onLogin && typeof onLogin === 'function') {
          onLogin(token, user.id, user.username); // <-- pass user.id and user.username
        } else {
          console.warn("onLogin prop is missing or not a function in Login.jsx. Auth state might not update.");
        }

        console.log('Login successful! Token and user stored. Attempting to navigate to /');
        navigate('/'); // Redirect to dashboard
        console.log('Navigation call completed.');

      } else {
        console.log('Login failed: Invalid server response structure.', response.data);
        setError('Login failed: Invalid server response.');
      }

    } catch (err) {
      console.error('Login error in catch block:', err.response || err);
      if (err.response) {
        if (err.response.status === 400) {
          if (err.response.data && err.response.data.detail) { // Custom LoginView might return detail
            setError(err.response.data.detail);
          } else if (err.response.data && err.response.data.non_field_errors) {
            setError(err.response.data.non_field_errors[0]);
          } else {
            setError('Invalid username or password.');
          }
        } else if (err.response.data && err.response.data.detail) {
          setError(err.response.data.detail);
        } else {
          setError('Login failed: ' + (err.response.statusText || 'Unknown error'));
        }
      } else {
        setError('Network error or server not responding. Please try again later.');
      }
    }
  };

  return (
    <Container className="mt-5">
      <h1 className="text-center">Login</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            name="username"
            value={inputs.username}
            onChange={handleChange}
            required
            placeholder="Enter your username"
          />
        </Form.Group>
        <Form.Group controlId="formPassword" className="mt-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={inputs.password}
            onChange={handleChange}
            required
            placeholder="Enter your password"
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="mt-3">
          Login
        </Button>
      </Form>
      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

      {/* <-- Add registration link --> */}
      <div className="text-center mt-3">
        Don't have an account? <Link to="/register">Go to register</Link> {/* <-- Assuming the registration page route is /register */}
      </div>
      {/* <-- End of registration link --> */}

    </Container>
  );
};

export default Login;
