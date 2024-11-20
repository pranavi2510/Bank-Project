import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import './Login.css'; // If you have custom CSS for extra styles

const Login = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/login', loginData);
      
      // Check if the response contains data
      if (response.data) {
        // Successfully logged in and received user data
        localStorage.setItem('user', JSON.stringify(response.data)); // Store user data in localStorage or context
        setSuccessMessage('Login successful! Redirecting...');
        
        // Redirect to Dashboard after 1.5 seconds
        setTimeout(() => {
          navigate('/dashboard'); // Redirect to Dashboard
        }, 1500); 
      } else {
        setError('Invalid email or password');
      }
    } catch (error) {
      console.error('There was an error logging in!', error);
      
      // Handle specific error when email is not registered
      if (error.response && error.response.data && error.response.data.message === 'Email not registered') {
        setError('Email not registered. Please sign up.');
      } else {
        setError('Error logging in. Please check your credentials.');
      }
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <Card style={{ width: '100%', maxWidth: '400px', padding: '20px' }} className="shadow-lg">
        <Card.Body>
          <h2 className="text-center mb-4">Login</h2>
          
          {error && <Alert variant="danger" className="text-center">{error}</Alert>}
          {successMessage && <Alert variant="success" className="text-center">{successMessage}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="email" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter your email"
                value={loginData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="password" className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Enter your password"
                value={loginData.password}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              Login
            </Button>
          </Form>

          <p className="text-center mt-3">
            Don't have an account? <a href="/signup" style={{ color: '#0066cc' }}>Sign Up now</a>
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;