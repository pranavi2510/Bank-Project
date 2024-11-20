
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Card, Form, Button, Alert, DropdownButton, Dropdown } from 'react-bootstrap';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('deposit'); // 'deposit' or 'withdrawal'
  const [details, setDetails] = useState('');
  const [userId, setUserId] = useState(null);
  const [balance, setBalance] = useState(0); // To track user balance
  const [error, setError] = useState(null); // For handling errors
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUserId(storedUser ? storedUser.id : null);

    if (storedUser && storedUser.id) {
      // Fetch user's transactions
      axios
        .get(`http://localhost:8080/api/transactions?userId=${storedUser.id}`)
        .then(response => {
          setTransactions(response.data);
        })
        .catch(err => {
          setError('Error fetching transactions.');
          console.error(err);
        });

      // Fetch user's balance
      axios
        .get(`http://localhost:8080/api/user-balance?userId=${storedUser.id}`)
        .then(response => {
          setBalance(response.data);  // Balance is returned directly as a number
        })
        .catch(err => {
          setError('Error fetching balance.');
          console.error(err);
        });
    }
  }, []);

  const handleTransactionSubmit = (e) => {
    e.preventDefault();

    // Validate amount (for withdrawal, ensure sufficient balance)
    if (type === 'withdrawal' && parseFloat(amount) > balance) {
      setError('Insufficient balance for withdrawal.');
      return;
    }

    if (parseFloat(amount) <= 0) {
      setError('Amount must be greater than 0.');
      return;
    }

    const transaction = {
      amount: parseFloat(amount),
      type,
      details,
    };

    axios
      .post(`http://localhost:8080/api/add-transaction?userId=${userId}`, transaction)
      .then(response => {
        setTransactions([...transactions, response.data]);
        setBalance(balance + (type === 'deposit' ? parseFloat(amount) : -parseFloat(amount))); // Update balance
        setAmount('');
        setDetails('');
        setSuccessMessage('Transaction successful!');
        setError(null); // Clear error
      })
      .catch(err => {
        setError('Error adding transaction.');
        console.error('Error adding transaction:', err);
      });
  };

  return (
    <Container className="d-flex flex-column" style={{ minHeight: '100vh' }}>
      {/* Transactions Section */}<br/>
      <h3>Recent Transactions</h3>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div style={{ flex: 1 }}>
          {/* Left-align the "Recent Transactions" Heading */}
         
          <ul>
            {transactions.length ? (
              transactions.map((transaction, index) => (
                <li key={index}>
                  {transaction.details} - ${transaction.amount} ({transaction.type})
                </li>
              ))
            ) : (
              <p>No transactions found.</p>
            )}
          </ul>
        </div>

        {/* Current Balance - Right side */}
        <div style={{ marginLeft: '20px', textAlign: 'right' }}>
          <h4>Current Balance: ${balance}</h4>
        </div>
      </div>

      {/* Add Transaction Form - Card */}
      <Card style={{ width: '100%', maxWidth: '500px', padding: '20px' }} className="shadow-lg mx-auto">
        <Card.Body>
          <h3 className="text-center mb-4">Add a New Transaction</h3>

          {error && <Alert variant="danger" className="text-center">{error}</Alert>}
          {successMessage && <Alert variant="success" className="text-center">{successMessage}</Alert>}

          <Form onSubmit={handleTransactionSubmit}>
            <Form.Group controlId="amount" className="mb-3">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                min="0.01"
              />
            </Form.Group>

            <Form.Group controlId="type" className="mb-3">
              <Form.Label>Type</Form.Label>
              <DropdownButton
    id="dropdown-basic-button"
    title={type === 'deposit' ? 'Deposit' : 'Withdrawal'}
    onSelect={(selectedType) => setType(selectedType)}
    variant="secondary"
    className="w-100"
  >
    <Dropdown.Item eventKey="deposit">Deposit</Dropdown.Item>
    <Dropdown.Item eventKey="withdrawal">Withdrawal</Dropdown.Item>
  </DropdownButton>
            </Form.Group>

            <Form.Group controlId="details" className="mb-3">
              <Form.Label>Details</Form.Label>
              <Form.Control
                type="text"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              Submit Transaction
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Transactions;
