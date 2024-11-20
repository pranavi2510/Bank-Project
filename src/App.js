import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import About from './pages/About';
import Help from './pages/Help';
import Dashboard from './pages/Dashboard';
import AccountDetails from './pages/AccountDetails';
import Transactions from './pages/Transactions';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/help" element={<Help />} />
        <Route path='/dashboard' element={<Dashboard/>} />
        <Route path='/account-details' element={<AccountDetails/>} />
        <Route path='/transactions' element={<Transactions/>} />


      </Routes>
    </Router>
  );
}

export default App;
