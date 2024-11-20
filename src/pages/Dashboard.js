
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Row, Col } from 'react-bootstrap'; // Using React Bootstrap components
import axios from 'axios';  // Make sure axios is imported
import './Dashboard.css'; // Updated styling file

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true); // For loading state
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (storedUser) {
      // Fetch user data (including transactions)
      setUserData(storedUser);

      // Fetch user's transactions from the backend
      axios
        .get(`http://localhost:8080/api/transactions?userId=${storedUser.id}`)
        .then(response => {
          // Add transactions to the userData
          setUserData(prevData => ({
            ...prevData,
            transactions: response.data,  // Adding transactions to the existing userData
          }));
          setLoading(false); // Set loading to false once data is fetched
        })
        .catch(err => {
          console.error('Error fetching transactions.', err);
          setLoading(false); // Set loading to false in case of error
        });
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleUpdateBalance = (newBalance) => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      const updatedUser = { ...storedUser, balance: newBalance };
      setUserData(updatedUser); // Update user data in the state
      localStorage.setItem('user', JSON.stringify(updatedUser)); // Save the updated user to localStorage
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Container className="dashboard-container">
      <Row className="mb-4">
        <Col className="text-center">
          <h1>Welcome, {userData.name}</h1>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <h2>Account Details</h2>
              <div className="account-info">
                <p><strong>Email:</strong> {userData.email}</p>
                <p><strong>Account Number:</strong> {userData.accountNumber}</p>
                <p><strong>City:</strong> {userData.city}</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body className="d-flex flex-column justify-content-center align-items-center">
              <h3><strong>Account Balance:</strong></h3>
              <h2>${userData.balance}</h2>

              {/* Add a button to simulate balance update */}
              <button
                onClick={() => handleUpdateBalance(userData.balance + 100)} // Add 100 to balance as an example
                className="btn btn-primary mt-3"
              >
                Add $100 to Balance
              </button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <h2>Recent Transactions</h2>
          <Card className="shadow-sm">
            <Card.Body>
              <ul className="transaction-list">
                {userData.transactions && userData.transactions.length > 0 ? (
                  userData.transactions.map((transaction, index) => (
                    <li key={index} className="transaction-item">
                      {transaction.details} - <span className="transaction-amount">${transaction.amount}</span>
                    </li>
                  ))
                ) : (
                  <p>No recent transactions.</p>
                )}
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
