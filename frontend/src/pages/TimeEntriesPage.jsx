import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Button, Box, CircularProgress,
  List, ListItem, ListItemText, IconButton, Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function TimeEntriesPage() {
  const [timeEntries, setTimeEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTimeEntries();
  }, []);

  const fetchTimeEntries = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/time-entries');
      setTimeEntries(response.data);
    } catch (err) {
      console.error("Failed to fetch time entries:", err);
      setError("Failed to load time entries.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (entryId) => {
    if (window.confirm("Are you sure you want to delete this time entry?")) {
      try {
        await api.delete(`/time-entries/${entryId}`);
        fetchTimeEntries(); // Refresh the list
        alert('Time entry deleted successfully!');
      } catch (err) {
        console.error("Failed to delete time entry:", err);
        setError("Failed to delete time entry.");
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

  if (error) {
    return (
      <Container sx={{ mt: 8 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="md" sx={{ mt: 8, p: 3, border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h1">
          Time Entries
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/time-entries/new')}
        >
          Add New Entry
        </Button>
      </Box>

      {timeEntries.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          No time entries yet. Click the "Add New Entry" button to get started!
        </Typography>
      ) : (
        <List>
          {timeEntries.map((entry) => (
            <ListItem
              key={entry.id}
              secondaryAction={
                <Box>
                  <IconButton edge="end" aria-label="edit" onClick={() => navigate(`/time-entries/edit/${entry.id}`)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(entry.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              }
            >
              <ListItemText
                primary={`${entry.description} (${entry.duration_minutes || 0} minutes)`}
                secondary={`Project: ${entry.project_name || 'None'} | Client: ${entry.client_id || 'None'} | Rate: $${entry.hourly_rate || 'N/A'}`}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Container>
  );
}

export default TimeEntriesPage;
