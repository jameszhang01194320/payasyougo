// frontend/src/App.jsx

import React from 'react';
// Import Routes, Route, Navigate from react-router-dom. BrowserRouter has been moved to main.jsx
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

// Import all needed components from @mui/material
import {
  Container, Typography, Button, Box,
  List, ListItemButton, ListItemIcon, ListItemText, // <-- Newly added list components
  AppBar, Toolbar // <-- Newly added top AppBar components
} from '@mui/material';

// Import all needed icons from @mui/icons-material
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CalculateIcon from '@mui/icons-material/Calculate';
import SettingsIcon from '@mui/icons-material/Settings';

// Import core page components
import Login from './Login';
import Register from './Register';
import DashboardPage from './pages/DashboardPage';
import ClientsPage from './pages/ClientsPage';
import ClientFormPage from './pages/ClientFormPage';
import InvoicesPage from './pages/InvoicesPage';
import InvoiceFormPage from './pages/InvoiceFormPage';
import TimeEntriesPage from './pages/TimeEntriesPage';
import TimeEntryFormPage from './pages/TimeEntryFormPage';
import ExpensesPage from './pages/ExpensesPage';
import ExpenseFormPage from './pages/ExpenseFormPage';
import TaxEstimationPage from './pages/TaxEstimationPage';
import SettingsPage from './pages/SettingsPage';

// Import authentication context hook
import { useAuth } from './AuthContext'; // <--- Make sure this line exists and is correctly imported

// MainLayout component: includes navigation and content area, used as a wrapper for protected routes
function MainLayout({ children }) {
  const { username, logout } = useAuth(); // Get logout function from AuthContext
  const navigate = useNavigate(); // Get navigate function for sidebar redirection

  const handleLogoutAndRedirect = () => {
    logout(); // Clear AuthContext state and localStorage
    navigate('/login'); // Redirect to login page
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Top AppBar */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Pay-as-You-Go Accounting
          </Typography>
          <Button color="inherit" onClick={handleLogoutAndRedirect}>Logout</Button>
        </Toolbar>
      </AppBar>

      {/* Content and Sidebar Layout */}
      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        {/* Sidebar Navigation */}
        <Box sx={{ width: 200, bgcolor: 'background.paper', p: 2, borderRight: '1px solid #eee' }}>
          <List component="nav">
            <ListItemButton onClick={() => navigate('/dashboard')}>
              <ListItemIcon><DashboardIcon /></ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
            <ListItemButton onClick={() => navigate('/clients')}>
              <ListItemIcon><PeopleIcon /></ListItemIcon>
              <ListItemText primary="Clients" />
            </ListItemButton>
            <ListItemButton onClick={() => navigate('/invoices')}>
              <ListItemIcon><ReceiptIcon /></ListItemIcon>
              <ListItemText primary="Invoices" />
            </ListItemButton>
            <ListItemButton onClick={() => navigate('/time-entries')}>
              <ListItemIcon><AccessTimeIcon /></ListItemIcon>
              <ListItemText primary="Time Entries" />
            </ListItemButton>
            <ListItemButton onClick={() => navigate('/expenses')}>
              <ListItemIcon><AttachMoneyIcon /></ListItemIcon>
              <ListItemText primary="Expenses" />
            </ListItemButton>
            <ListItemButton onClick={() => navigate('/tax-estimation')}>
              <ListItemIcon><CalculateIcon /></ListItemIcon>
              <ListItemText primary="Tax Estimation" />
            </ListItemButton>
            <ListItemButton onClick={() => navigate('/settings')}>
              <ListItemIcon><SettingsIcon /></ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItemButton>
          </List>
        </Box>
        {/* Main Content Area */}
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          {children} {/* The children here are the respective page components */}
        </Box>
      </Box>
    </Box>
  );
}

// App component as the root of the routing
function App() {
  // Get isAuthenticated and loading state from AuthContext
  // As well as login and logout functions to pass as props to the Login component
  const { isAuthenticated, loading, login, logout } = useAuth(); // <--- Modified here

  console.log("App.jsx: Current isAuthenticated state:", isAuthenticated, "Loading:", loading);

  // **Key change: if authentication status is still loading, show loading indicator or render nothing**
  if (loading) {
    return <div>Loading authentication status...</div>; // You can place a nice loading animation here
  }

  return (
    // Routes defines the routing rules for the application
    <Routes>
      {/* Public routes: accessible without authentication */}
      {/* Pass the login function as a prop to the Login component */}
      <Route path="/login" element={<Login onLogin={login} />} /> {/* <--- Fixed here: pass onLogin={login} */}
      <Route path="/register" element={<Register />} />

      {/* Protected routes: accessible only with authentication, wrapped with MainLayout */}
      {/* If isAuthenticated is true, render MainLayout and the corresponding page component; otherwise redirect to /login */}
      <Route
        path="/dashboard"
        element={isAuthenticated ? <MainLayout><DashboardPage /></MainLayout> : <Navigate to="/login" />}
      />
      <Route
        path="/clients"
        element={isAuthenticated ? <MainLayout><ClientsPage /></MainLayout> : <Navigate to="/login" />}
      />
      <Route
        path="/clients/new"
        element={isAuthenticated ? <MainLayout><ClientFormPage /></MainLayout> : <Navigate to="/login" />}
      />
      <Route
        path="/clients/edit/:id"
        element={isAuthenticated ? <MainLayout><ClientFormPage /></MainLayout> : <Navigate to="/login" />}
      />
      <Route
        path="/invoices"
        element={isAuthenticated ? <MainLayout><InvoicesPage /></MainLayout> : <Navigate to="/login" />}
      />
      <Route
        path="/invoices/new"
        element={isAuthenticated ? <MainLayout><InvoiceFormPage /></MainLayout> : <Navigate to="/login" />}
      />
      <Route
        path="/invoices/edit/:id"
        element={isAuthenticated ? <MainLayout><InvoiceFormPage /></MainLayout> : <Navigate to="/login" />}
      />
      <Route
        path="/time-entries"
        element={isAuthenticated ? <MainLayout><TimeEntriesPage /></MainLayout> : <Navigate to="/login" />}
      />
      <Route
        path="/time-entries/new"
        element={isAuthenticated ? <MainLayout><TimeEntryFormPage /></MainLayout> : <Navigate to="/login" />}
      />
      <Route
        path="/time-entries/edit/:id"
        element={isAuthenticated ? <MainLayout><TimeEntryFormPage /></MainLayout> : <Navigate to="/login" />}
      />
      <Route
        path="/expenses"
        element={isAuthenticated ? <MainLayout><ExpensesPage /></MainLayout> : <Navigate to="/login" />}
      />
      <Route
        path="/expenses/new"
        element={isAuthenticated ? <MainLayout><ExpenseFormPage /></MainLayout> : <Navigate to="/login" />}
      />
      <Route
        path="/expenses/edit/:id"
        element={isAuthenticated ? <MainLayout><ExpenseFormPage /></MainLayout> : <Navigate to="/login" />}
      />
      <Route
        path="/tax-estimation"
        element={isAuthenticated ? <MainLayout><TaxEstimationPage /></MainLayout> : <Navigate to="/login" />}
      />
      <Route
        path="/settings"
        element={isAuthenticated ? <MainLayout><SettingsPage /></MainLayout> : <Navigate to="/login" />}
      />

      {/* Default route or homepage: if authenticated, redirect to dashboard; otherwise redirect to login */}
      <Route
        path="/"
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
      />
    </Routes>
  );
}

export default App;
