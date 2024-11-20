import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, ButtonGroup, Form } from 'react-bootstrap';

const AccountDetails = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [creatingAccount, setCreatingAccount] = useState(false);
  const [newBalance, setNewBalance] = useState('');
  const [selectedAccountId, setSelectedAccountId] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser && storedUser.id) {
      const userId = storedUser.id;
      axios
        .get(`http://localhost:8080/api/accounts/user/${userId}`)
        .then((response) => {
          setAccounts(response.data);
          setLoading(false);
        })
        .catch((error) => {
          if (error.response && error.response.status === 404) {
            setAccounts([]);
            setError(null);
          } else {
            setError("Error fetching account details.");
          }
          setLoading(false);
        });
    }
  }, []);

  const handleCreateAccount = () => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const userId = storedUser.id;

    // Generate a random account number
    const accountNumber = `AC-${Math.floor(Math.random() * 1000000000)}`; // Unique account number
    const accountData = {
      accountNumber: accountNumber,
      balance: 0.00,
      accountType: "Savings",
      status: "Active",
      branch: "Main Branch",
      accountCreationDate: new Date().toISOString(),
      lastTransactionDate: new Date().toISOString(),
      user: { id: userId },
    };
    setCreatingAccount(true);
    axios
      .post('http://localhost:8080/api/accounts', accountData)
      .then((response) => {
        setAccounts([response.data]);
        setCreatingAccount(false);
      })
      .catch((error) => {
        setError("Error creating account.");
        setCreatingAccount(false);
        console.error("Error creating account:", error);
      });
  };

  const handleUpdateAccountBalance = () => {
    if (newBalance && selectedAccountId) {
      axios
        .put(`http://localhost:8080/api/accounts/${selectedAccountId}/balance?newBalance=${newBalance}`)
        .then((response) => {
          setAccounts(accounts.map(account => account.id === selectedAccountId ? response.data : account));
          setError(null);
          setNewBalance('');
          setSelectedAccountId(null);
        })
        .catch((error) => {
          setError("Error updating account balance.");
          console.error("Error updating account balance:", error);
        });
    }
  };

  const handleUpdateAccountStatus = (accountId, newStatus) => {
    const statusData = { status: newStatus };
    axios
      .put(`http://localhost:8080/api/accounts/${accountId}/status`, statusData)
      .then((response) => {
        setAccounts(accounts.map(account => account.id === accountId ? response.data : account));
        setError(null);
      })
      .catch((error) => {
        setError("Error updating account status.");
        console.error("Error updating account status:", error);
      });
  };

  const handleDeleteAccount = (accountId) => {
    axios
      .delete(`http://localhost:8080/api/accounts/${accountId}`)
      .then(() => {
        setAccounts(accounts.filter(account => account.id !== accountId));
        setError(null);
      })
      .catch((error) => {
        setError("Error deleting account.");
        console.error("Error deleting account:", error);
      });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Account Details</h1>
      {accounts.length === 0 ? (
        <div>
          <p>No accounts found for this user.</p>
          <Button
            variant="primary"
            size="sm"
            onClick={handleCreateAccount}
            disabled={creatingAccount}
          >
            {creatingAccount ? 'Creating Account...' : 'Create Account'}
          </Button>
        </div>
      ) : (
        accounts.map((account) => (
          <div key={account.id} style={{ marginBottom: '1rem' }}>
            <p><strong>Account Number:</strong> {account.accountNumber}</p>
            <p><strong>Balance:</strong> ${account.balance}</p>
            <p><strong>Account Type:</strong> {account.accountType}</p>
            <p><strong>Status:</strong> {account.status}</p>
            <p><strong>Branch:</strong> {account.branch}</p>
            <p><strong>Account Creation Date:</strong> {new Date(account.accountCreationDate).toLocaleDateString()}</p>
            <p><strong>Last Transaction Date:</strong> {new Date(account.lastTransactionDate).toLocaleDateString()}</p>

            {/* Update Balance Input */}
            {selectedAccountId === account.id && (
              <div>
                <Form.Control
                  type="number"
                  value={newBalance}
                  onChange={(e) => setNewBalance(e.target.value)}
                  placeholder="Enter new balance"
                  style={{ width: '200px', marginRight: '10px', display: 'inline-block' }}
                />
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={handleUpdateAccountBalance}
                >
                  Update Balance
                </Button>
              </div>
            )}

            {/* Action Buttons */}
            <ButtonGroup className="mt-2">
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => {
                  setSelectedAccountId(account.id);
                  setNewBalance(account.balance); // Pre-fill balance to update
                }}
                style={{ marginRight: '10px' }}
              >
                Update Balance
              </Button>
              <Button
                variant="outline-warning"
                size="sm"
                onClick={() => handleUpdateAccountStatus(account.id, 'Frozen')}
                style={{ marginRight: '10px' }}
              >
                Freeze Account
              </Button>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => handleDeleteAccount(account.id)}
              >
                Delete Account
              </Button>
            </ButtonGroup>

            <hr />
          </div>
        ))
      )}
    </div>
  );
};

export default AccountDetails;
