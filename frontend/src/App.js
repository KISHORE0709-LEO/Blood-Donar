import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

import Home       from './pages/Home';
import Login      from './pages/Login';
import Register   from './pages/Register';
import Requests   from './pages/Requests';
import NewRequest from './pages/NewRequest';
import Donors     from './pages/Donors';
import Dashboard  from './pages/Dashboard';
import Admin      from './pages/Admin';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div style={{ minHeight:'100vh', background:'#fff5f5', fontFamily:"'Inter', sans-serif" }}>
          <Navbar />
          <Routes>
            <Route path="/"              element={<Home />} />
            <Route path="/login"         element={<Login />} />
            <Route path="/register"      element={<Register />} />
            <Route path="/requests"      element={<Requests />} />
            <Route path="/donors"        element={<Donors />} />
            <Route path="/requests/new"  element={<ProtectedRoute><NewRequest /></ProtectedRoute>} />
            <Route path="/dashboard"     element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/admin"         element={<ProtectedRoute adminOnly><Admin /></ProtectedRoute>} />
          </Routes>
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </BrowserRouter>
    </AuthProvider>
  );
}
