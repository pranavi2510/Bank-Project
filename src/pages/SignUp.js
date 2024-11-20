
import React, { useState } from 'react';
import axios from 'axios';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import './Form.css'; // If you have custom CSS for extra styles

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    accountNumber: '',
    password: '',
    email: '',
    city: '',
  });

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/register', formData);
      setSuccessMessage('Registration successful! Redirecting...');
      
      // Redirect to login page after success
      setTimeout(() => {
        window.location.href = "/login"; // Redirect to login after 1.5 seconds
      }, 1500);
      
    } catch (error) {
      console.error('There was an error registering the user!', error);
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh', paddingTop: '50px' }}>
      <Card style={{ width: '100%', maxWidth: '450px', padding: '20px' }} className="shadow-lg">
        <Card.Body>
          <h2 className="text-center mb-4">Sign Up</h2>

          {error && <Alert variant="danger" className="text-center">{error}</Alert>}
          {successMessage && <Alert variant="success" className="text-center">{successMessage}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="username" className="mb-3">
              <Form.Control
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="name" className="mb-3">
              <Form.Control
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="accountNumber" className="mb-3">
              <Form.Control
                type="text"
                name="accountNumber"
                placeholder="Account Number"
                value={formData.accountNumber}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="email" className="mb-3">
              <Form.Control
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="password" className="mb-3">
              <Form.Control
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="city" className="mb-3">
              <Form.Control
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              Sign Up
            </Button>
          </Form>

          <p className="text-center mt-3">
            Already have an account? <a href="/login" style={{ color: '#0066cc' }}>Login now</a>
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default SignUp;
