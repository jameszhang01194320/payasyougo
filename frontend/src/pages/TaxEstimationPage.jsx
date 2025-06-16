// frontend/src/pages/TaxEstimationPage.jsx

import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Button, Box, CircularProgress,
  Alert,
  TextField,
  InputAdornment,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import api from '../api';

function TaxEstimationPage() {
  const [taxEstimation, setTaxEstimation] = useState(null);
  const [taxPercentage, setTaxPercentage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isNewEntry, setIsNewEntry] = useState(false);

  useEffect(() => {
    fetchTaxEstimation();
  }, []);

  const fetchTaxEstimation = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/tax-estimation/');
      setTaxEstimation(response.data);
      setTaxPercentage(response.data.tax_percentage || '');
      setIsNewEntry(false);
    } catch (err) {
      console.error("Failed to fetch tax estimation:", err);
      if (err.response) {
        if (err.response.status === 404) {
          setError("You have not set up your tax estimation yet. Please enter a percentage above to get started.");
          setTaxEstimation(null);
          setTaxPercentage('');
          setIsNewEntry(true);
        } else if (err.response.status === 401) {
          setError("You are not logged in or your session has expired. Please log in again.");
        } else {
          setError("Unable to load tax estimation settings. Please check your network or try again later.");
        }
      } else {
        setError("Network error or server is not responding. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePercentage = async () => {
    setError(null);
    try {
      let response;
      // Ensure we send a float to the backend
      const dataToSend = { tax_percentage: parseFloat(taxPercentage) };

      if (isNewEntry || !taxEstimation) {
        response = await api.post('/tax-estimation/', dataToSend);
      } else {
        response = await api.put(`/tax-estimation/`, dataToSend);
      }
      
      setTaxEstimation(response.data);
      // Ensure response value is a float then convert to string
      setTaxPercentage(parseFloat(response.data.tax_percentage).toString() || ''); // Ensure input box shows number as string
      setIsNewEntry(false);
      alert('Tax estimation updated successfully!');
      setError(null);
    } catch (err) {
      console.error("Failed to update tax estimation:", err);
      if (err.response && err.response.data) {
        if (err.response.data.tax_percentage) {
          setError(`Invalid percentage: ${err.response.data.tax_percentage.join(', ')}`);
        } else if (err.response.data.detail) {
          setError(`Update failed: ${err.response.data.detail}`);
        } else {
          setError("Failed to update tax estimation. Please check your input or try again later.");
        }
      } else {
        setError("Network error or server is not responding. Please try again later.");
      }
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="md" sx={{ mt: 8, p: 3, border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
      <Typography variant="h5" component="h1" sx={{ mb: 3 }}>
        Tax Estimation Settings
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <TextField
          label="Estimated Tax Percentage (%)"
          type="number"
          value={taxPercentage}
          onChange={(e) => setTaxPercentage(e.target.value)}
          variant="outlined"
          sx={{ flexGrow: 1, mr: 2 }}
          InputProps={{
            endAdornment: <InputAdornment position="end">%</InputAdornment>,
          }}
        />
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleUpdatePercentage}
        >
          Update Percentage
        </Button>
      </Box>

      <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
        Overview
      </Typography>

      <Box sx={{ bgcolor: 'background.paper', p: 3, border: '1px solid #eee', borderRadius: '4px' }}>
        <Typography variant="body1">
          {/* **CRUCIAL FIX HERE:** Convert to number before calling toFixed() */}
          **Amount Set Aside:** ${parseFloat(taxEstimation?.estimated_amount_set_aside).toFixed(2) || '0.00'}
        </Typography>
        <Typography variant="body1">
          **Last Calculated At:** {taxEstimation?.last_calculated_at ? new Date(taxEstimation.last_calculated_at).toLocaleString() : 'N/A'}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          (This amount is automatically calculated and set aside based on your income.)
        </Typography>
      </Box>
    </Container>
  );
}

export default TaxEstimationPage;
