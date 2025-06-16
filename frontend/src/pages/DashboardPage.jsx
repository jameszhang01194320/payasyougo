import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Import useNavigate Hook

function DashboardPage() {
  const navigate = useNavigate(); // Get navigate function

  // Handle logout logic: clear locally stored auth info and navigate back to login page
  const handleLogout = () => {
    localStorage.removeItem('access_token'); // Remove access token
    localStorage.removeItem('user_id');      // Remove user ID
    navigate('/login');                      // Navigate to login page
  };

  return (
    <Container component="main" maxWidth="md" sx={{ mt: 8, p: 3, border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
      {/* Dashboard Title */}
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome to the Dashboard!
      </Typography>

      {/* Dashboard Description */}
      <Typography variant="body1">
        You have successfully logged in. View your financial overview here.
        {/* TODO: You can add more data overviews here, such as total income, receivables, etc., which need to be fetched from the backend */}
      </Typography>

      {/* Quick Navigation Button Section */}
      <Box sx={{ mt: 4 }}>
        <Button
          variant="contained"
          color="primary"
          sx={{ mr: 2 }} // Right margin
          onClick={() => navigate('/clients')} // Navigate to client management page on click
        >
          Manage Clients
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/invoices')} // Navigate to invoice management page on click
        >
          Manage Invoices
        </Button>
      </Box>

      {/* Logout Button */}
      {/* Note: In a real app, if MainLayout already has a global logout button, this can be removed.
          Keeping it here just to demonstrate logout can also be handled from this page. */}
      <Button
        variant="contained"
        color="secondary"
        sx={{ mt: 3 }} // Top margin
        onClick={handleLogout} // Call logout function on click
      >
        Logout
      </Button>
    </Container>
  );
}

export default DashboardPage;
