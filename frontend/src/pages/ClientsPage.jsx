import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Button, Box, CircularProgress, // CircularProgress for loading state
  List, ListItem, ListItemText, IconButton, Alert, // Alert for error/success messages
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle // Dialog for delete confirmation
} from '@mui/material';
// Import MUI Icons
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom'; // For navigation
import api from '../api'; // Import your wrapped Axios instance

function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null);     // Error message
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); // Control delete confirmation dialog
  const [clientToDelete, setClientToDelete] = useState(null); // Store the client to be deleted
  const navigate = useNavigate(); // Get navigation function

  // --- useEffect: Fetch client list when component loads ---
  useEffect(() => {
    fetchClients();
  }, []); // Empty array means run only once on mount

  const fetchClients = async () => {
    setLoading(true); // Start loading
    setError(null);   // Clear previous errors
    try {
      const response = await api.get('/clients'); // Call backend API to get client list
      setClients(response.data); // Update client state
    } catch (err) {
      console.error("Failed to fetch clients:", err);
      // Provide user-friendly error messages based on error type
      if (err.response && err.response.status === 401) {
        setError("You are not logged in or your session has expired. Please log in again.");
      } else {
        setError("Unable to load client list. Please check your network or try again later.");
      }
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // --- Handle delete button click ---
  const handleDeleteClick = (client) => {
    setClientToDelete(client); // Record the client to be deleted
    setDeleteDialogOpen(true); // Open confirmation dialog
  };

  // --- Confirm delete client ---
  const handleConfirmDelete = async () => {
    if (clientToDelete) {
      try {
        await api.delete(`/clients/${clientToDelete.id}`); // Send DELETE request to backend
        setDeleteDialogOpen(false); // Close dialog
        setClientToDelete(null);    // Clear selected client
        fetchClients();             // Refresh client list
        // You could use MUI Snackbar or Alert here to show success message
        alert('Client deleted successfully!'); // Simple browser alert
      } catch (err) {
        console.error("Failed to delete client:", err);
        setError("Failed to delete client. Please try again.");
      }
    }
  };

  // --- Handle edit button click ---
  const handleEditClick = (clientId) => {
    navigate(`/clients/edit/${clientId}`); // Navigate to client edit page with client ID
  };

  // --- Render loading state ---
  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress /> {/* Show loading spinner */}
      </Container>
    );
  }

  // --- Render error message ---
  if (error) {
    return (
      <Container sx={{ mt: 8 }}>
        <Alert severity="error">{error}</Alert> {/* Display error message */}
        <Button onClick={fetchClients} sx={{ mt: 2 }}>Reload</Button> {/* Retry button */}
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="md" sx={{ mt: 8, p: 3, border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h1">
          Client Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />} // Add icon
          onClick={() => navigate('/clients/new')} // Navigate to add new client page
        >
          Add New Client
        </Button>
      </Box>

      {clients.length === 0 ? (
        // If no clients, show message
        <Typography variant="body1" color="text.secondary">
          No clients yet. Click "Add New Client" to get started!
        </Typography>
      ) : (
        // If clients exist, show them in MUI List
        <List>
          {clients.map((client) => (
            <ListItem
              key={client.id} // Unique key is important
              secondaryAction={ // Right-side action buttons
                <Box>
                  <IconButton edge="end" aria-label="edit" onClick={() => handleEditClick(client.id)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteClick(client)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              }
            >
              <ListItemText
                primary={client.name} // Client name
                secondary={client.email || 'No email'} // Client email, or fallback
              />
            </ListItem>
          ))}
        </List>
      )}

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm delete client?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete client "{clientToDelete?.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} autoFocus color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default ClientsPage;
