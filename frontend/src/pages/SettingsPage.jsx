// frontend/src/pages/SettingsPage.jsx

import React, { useState, useEffect } from 'react';
import {
  Container, Typography, TextField, Button, Box, CircularProgress, Alert, MenuItem
} from '@mui/material';
import api from '../api';

function SettingsPage() {
  const [currency, setCurrency] = useState('');
  const [timezone, setTimezone] = useState('');
  const [invoicePrefix, setInvoicePrefix] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Sample timezone list (in real-world app, you might want a more comprehensive list)
  const timezones = [
    { value: 'UTC', label: 'UTC' },
    { value: 'America/New_York', label: 'America/New_York (EST)' },
    { value: 'America/Los_Angeles', label: 'America/Los_Angeles (PST)' },
    { value: 'Asia/Shanghai', label: 'Asia/Shanghai (CST)' },
    { value: 'Europe/London', label: 'Europe/London (GMT)' },
  ];

  // Sample currency list
  const currencies = [
    { value: 'USD', label: 'US Dollar (USD)' },
    { value: 'EUR', label: 'Euro (EUR)' },
    { value: 'GBP', label: 'British Pound (GBP)' },
    { value: 'CNY', label: 'Chinese Yuan (CNY)' },
  ];

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/settings');
      const data = response.data;
      setCurrency(data.currency || 'USD');
      setTimezone(data.timezone || 'UTC');
      setInvoicePrefix(data.invoice_prefix || '');
      setPaymentTerms(data.payment_terms || '');
    } catch (err) {
      console.error("Failed to fetch settings:", err);
      setError("Failed to load user settings.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    const settingsData = {
      currency,
      timezone,
      invoice_prefix: invoicePrefix,
      payment_terms: paymentTerms,
    };

    try {
      await api.put('/settings', settingsData);
      setSuccess('Settings updated successfully!');
      // Optionally reload settings or just update local state
      fetchSettings();
    } catch (err) {
      console.error("Failed to save settings:", err);
      setError(`Failed to save: ${err.response?.data?.msg || err.message}`);
    } finally {
      setIsSaving(false);
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
    <Container component="main" maxWidth="sm" sx={{ mt: 8, p: 3, border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
      <Typography variant="h5" component="h1" gutterBottom>
        User Settings
      </Typography>
      <Box component="form" onSubmit={handleSaveSettings} noValidate sx={{ mt: 1 }}>
        <TextField
          select
          margin="normal"
          fullWidth
          label="Default Currency"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          disabled={isSaving}
        >
          {currencies.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          margin="normal"
          fullWidth
          label="Timezone"
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          disabled={isSaving}
        >
          {timezones.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          margin="normal"
          fullWidth
          label="Invoice Prefix (e.g. INV-)"
          value={invoicePrefix}
          onChange={(e) => setInvoicePrefix(e.target.value)}
          disabled={isSaving}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Default Payment Terms"
          multiline
          rows={4}
          value={paymentTerms}
          onChange={(e) => setPaymentTerms(e.target.value)}
          disabled={isSaving}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={isSaving}
        >
          {isSaving ? <CircularProgress size={24} /> : 'Save Settings'}
        </Button>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
      </Box>
    </Container>
  );
}

export default SettingsPage;
