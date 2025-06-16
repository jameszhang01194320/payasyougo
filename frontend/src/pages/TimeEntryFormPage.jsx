// frontend/src/pages/TimeEntryFormPage.jsx

import React, { useState, useEffect } from 'react';
import {
  Container, Typography, TextField, Button, Box, CircularProgress, Alert, MenuItem
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';

function TimeEntryFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [clientId, setClientId] = useState('');
  const [clients, setClients] = useState([]); // Used for client selection dropdown
  const [projectName, setProjectName] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const isEditMode = Boolean(id);

  useEffect(() => {
    // Fetch client list for dropdown menu
    const fetchClients = async () => {
      try {
        const response = await api.get('/clients');
        setClients(response.data);
      } catch (err) {
        console.error("Failed to fetch clients for dropdown:", err);
        setError("Failed to load client list. Please try again later.");
      }
    };
    fetchClients();

    if (isEditMode) {
      setLoading(true);
      const fetchTimeEntry = async () => {
        try {
          const response = await api.get(`/time-entries/${id}`);
          const entry = response.data;
          setDescription(entry.description);
          setStartTime(entry.start_time ? new Date(entry.start_time).toISOString().slice(0, 16) : '');
          setEndTime(entry.end_time ? new Date(entry.end_time).toISOString().slice(0, 16) : '');
          setClientId(entry.client_id || '');
          setProjectName(entry.project_name || '');
          setHourlyRate(entry.hourly_rate || '');
        } catch (err) {
          console.error("Failed to fetch time entry for edit:", err);
          setError("Failed to load time entry.");
        } finally {
          setLoading(false);
        }
      };
      fetchTimeEntry();
    }
  }, [id, isEditMode]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const entryData = {
      description,
      start_time: startTime,
      end_time: endTime || null, // Send null if end time is empty
      client_id: clientId || null,
      project_name: projectName,
      hourly_rate: parseFloat(hourlyRate) || null, // Ensure it's a number
    };

    try {
      if (isEditMode) {
        await api.put(`/time-entries/${id}`, entryData);
        setSuccess('Time entry updated successfully!');
      } else {
        await api.post('/time-entries', entryData);
        setSuccess('New time entry added successfully!');
        // Clear the form
        setDescription('');
        setStartTime('');
        setEndTime('');
        setClientId('');
        setProjectName('');
        setHourlyRate('');
      }
      setTimeout(() => navigate('/time-entries'), 2000);
    } catch (err) {
      console.error("Failed to save time entry:", err);
      setError(`Failed to save time entry: ${err.response?.data?.msg || err.message}`);
    } finally {
      setLoading(false);
    }
  };

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
        {isEditMode ? 'Edit Time Entry' : 'Add New Time Entry'}
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={loading}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="Start Time"
          type="datetime-local"
          InputLabelProps={{ shrink: true }}
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          disabled={loading}
        />
        <TextField
          margin="normal"
          fullWidth
          label="End Time"
          type="datetime-local"
          InputLabelProps={{ shrink: true }}
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          disabled={loading}
        />
        <TextField
          select
          margin="normal"
          fullWidth
          label="Client"
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          disabled={loading || clients.length === 0}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {clients.length === 0 ? (
            <MenuItem disabled>Please add a client first</MenuItem>
          ) : (
            clients.map((client) => (
              <MenuItem key={client.id} value={client.id}>
                {client.name}
              </MenuItem>
            ))
          )}
        </TextField>
        <TextField
          margin="normal"
          fullWidth
          label="Project Name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          disabled={loading}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Hourly Rate"
          type="number"
          value={hourlyRate}
          onChange={(e) => setHourlyRate(e.target.value)}
          disabled={loading}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : (isEditMode ? 'Update Entry' : 'Add Entry')}
        </Button>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
        <Button
          fullWidth
          variant="outlined"
          sx={{ mb: 2 }}
          onClick={() => navigate('/time-entries')}
          disabled={loading}
        >
          Cancel
        </Button>
      </Box>
    </Container>
  );
}

export default TimeEntryFormPage;
