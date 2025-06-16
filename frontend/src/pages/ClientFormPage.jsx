import React, { useState, useEffect } from 'react';
import {
  Container, Typography, TextField, Button, Box, CircularProgress, Alert
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom'; // useParams is used to get URL parameters (ID)
import api from '../api'; // Import your custom Axios instance

function ClientFormPage() {
  const { id } = useParams(); // Get client ID from URL, if exists then it's edit mode
  const navigate = useNavigate(); // Get navigation function

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  // UI state
  const [loading, setLoading] = useState(false); // State for form submission or initial data loading
  const [error, setError] = useState(null);    // Error message
  const [success, setSuccess] = useState(null); // Success message

  const isEditMode = Boolean(id); // Determine if it's edit or create mode based on ID existence

  // --- useEffect: Load client data in edit mode ---
  useEffect(() => {
    if (isEditMode) {
      setLoading(true); // Start loading old data
      const fetchClient = async () => {
        try {
          const response = await api.get(`/clients/${id}`); // Get client details by ID
          const client = response.data;
          // Set form fields with fetched client data
          setName(client.name);
          setEmail(client.email || ''); // Ensure default value to avoid null
          setPhone(client.phone_number || '');
          setAddress(client.address || '');
        } catch (err) {
          console.error("Failed to load client info:", err);
          setError("This is not your client. Please check the client ID.");

        } finally {
          setLoading(false); // Finish loading
        }
      };
      fetchClient();
    }
  }, [id, isEditMode]); // Rerun when ID or isEditMode changes

  // --- Handle form submission ---
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form behavior
    setLoading(true); // Set submission state to true
    setError(null);    // Clear error
    setSuccess(null);  // Clear success

    const clientData = {
      name,
      email,
      phone_number: phone, // Match backend field name
      address
    };

    try {
      if (isEditMode) {
        // Edit mode: send PUT request
        await api.put(`/clients/${id}`, clientData);
        setSuccess('Client information updated successfully!');
      } else {
        // Create mode: send POST request
        await api.post('/clients', clientData);
        setSuccess('New client added successfully!');
        // Clear form after successful creation for next entry
        setName('');
        setEmail('');
        setPhone('');
        setAddress('');
      }
      // Navigate back to client list after delay
      setTimeout(() => navigate('/clients'), 1500); // Redirect after 1.5 seconds
    } catch (err) {
      console.error("Failed to save client:", err);
      // Show backend error message if available, otherwise show general error
      setError(`Failed to save client: ${err.response?.data?.msg || err.message}`);
    } finally {
      setLoading(false); // Finish submission
    }
  };

  // --- Render loading state (only in edit mode initial load) ---
  if (loading && isEditMode) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="sm" sx={{ mt: 8, p: 3, border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
      <Typography variant="h5" component="h1" gutterBottom>
        {isEditMode ? 'Edit Client' : 'Add New Client'} {/* Show different titles based on mode */}
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required // Mark as required
          fullWidth
          id="name"
          label="Client Name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading} // Disable input during submission
        />
        <TextField
          margin="normal"
          fullWidth
          id="email"
          label="Email"
          name="email"
          type="email" // Use email type for basic validation
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        <TextField
          margin="normal"
          fullWidth
          id="phone"
          label="Phone Number"
          name="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          disabled={loading}
        />
        <TextField
          margin="normal"
          fullWidth
          id="address"
          label="Address"
          name="address"
          multiline // Multiline text field
          rows={3}   // Default to 3 rows
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          disabled={loading}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={loading} // Disable button during submission
        >
          {loading ? <CircularProgress size={24} /> : (isEditMode ? 'Update Client' : 'Add Client')}
        </Button>
        {error && <Alert severity="error">{error}</Alert>} {/* Show error message */}
        {success && <Alert severity="success">{success}</Alert>} {/* Show success message */}
        <Button
          fullWidth
          variant="outlined"
          sx={{ mb: 2 }}
          onClick={() => navigate('/clients')} // Navigate back to client list on cancel
          disabled={loading}
        >
          Cancel
        </Button>
      </Box>
    </Container>
  );
}

export default ClientFormPage;
