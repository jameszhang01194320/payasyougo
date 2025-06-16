import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // <-- Modified: import Link component
import { Form, Button, Container, Alert } from 'react-bootstrap';

const Register = () => {
  const [inputs, setInputs] = useState({
    username: '',
    email: '',
    phone_number: '',
    password: '',
    password2: '',
    first_name: '',
    last_name: ''
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
      const response = await axios.post('http://127.0.0.1:8000/api/register/', {
        username: inputs.username,
        email: inputs.email,
        phone_number: inputs.phone_number,
        password: inputs.password,
        password2: inputs.password2,
        first_name: inputs.first_name,
        last_name: inputs.last_name,
      });

      if (response.data && response.data.id) {
        alert('Registration successful! Please log in.');
        navigate('/login');
      } else {
        setError('Registration failed: invalid server response.');
      }

    } catch (err) {
      console.error('Registration error:', err.response || err);
      if (err.response) {
        if (err.response.status === 400) {
          if (err.response.data) {
            let errorMessages = [];
            for (const key in err.response.data) {
              if (Array.isArray(err.response.data[key])) {
                errorMessages.push(`${key}: ${err.response.data[key].join(', ')}`);
              } else if (typeof err.response.data[key] === 'string') {
                 errorMessages.push(err.response.data[key]);
              }
            }
            setError(errorMessages.join('\n') || 'Invalid registration information.');
          } else {
            setError('Registration failed: invalid request data.');
          }
        } else if (err.response.data && err.response.data.detail) {
          setError(err.response.data.detail);
        } else {
          setError('Registration failed: ' + (err.response.statusText || 'Unknown error'));
        }
      } else {
        setError('Network error or server not responding. Please try again later.');
      }
    }
  };


  return (
    <Container className="mt-5">
      <h1 className="text-center">Register</h1>
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

        <Form.Group controlId="formEmail" className="mt-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={inputs.email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
          />
        </Form.Group>

        <Form.Group controlId="formPhoneNumber" className="mt-3">
          <Form.Label>Phone Number</Form.Label>
          <Form.Control
            type="tel"
            name="phone_number"
            value={inputs.phone_number}
            onChange={handleChange}
            placeholder="Enter your phone number"
          />
        </Form.Group>

        <Form.Group controlId="formFirstName" className="mt-3">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            name="first_name"
            value={inputs.first_name}
            onChange={handleChange}
            placeholder="Enter your first name"
          />
        </Form.Group>

        <Form.Group controlId="formLastName" className="mt-3">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            name="last_name"
            value={inputs.last_name}
            onChange={handleChange}
            placeholder="Enter your last name"
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

        <Form.Group controlId="formPassword2" className="mt-3">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            name="password2"
            value={inputs.password2}
            onChange={handleChange}
            required
            placeholder="Confirm your password"
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-3">
          Register
        </Button>
      </Form>
      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

      {/* <-- Add login link --> */}
      <div className="text-center mt-3">
        Already have an account? <Link to="/login">Go to login</Link> {/* <-- Assuming the login page is at /login */}
      </div>
      {/* <-- End login link --> */}

    </Container>
  );
};

export default Register;
