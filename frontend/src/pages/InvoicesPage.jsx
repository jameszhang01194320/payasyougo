// frontend/src/pages/InvoicesPage.jsx

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

function InvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/invoices');
      setInvoices(response.data);
    } catch (err) {
      console.error("Failed to fetch invoices:", err);
      setError("Failed to load invoice list.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (invoiceId) => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      try {
        await api.delete(`/invoices/${invoiceId}`);
        fetchInvoices(); // Refresh the list
        alert('Invoice deleted successfully!');
      } catch (err) {
        console.error("Failed to delete invoice:", err);
        setError("Failed to delete invoice.");
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
          Invoice Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/invoices/new')}
        >
          Create New Invoice
        </Button>
      </Box>

      {invoices.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          No invoices yet. Click the “Create New Invoice” button to get started!
        </Typography>
      ) : (
        <List>
          {invoices.map((invoice) => (
            <ListItem
              key={invoice.id}
              secondaryAction={
                <Box>
                  <IconButton edge="end" aria-label="edit" onClick={() => navigate(`/invoices/edit/${invoice.id}`)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(invoice.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              }
            >
              <ListItemText
                primary={`Invoice #: ${invoice.invoice_number} | Amount: $${invoice.total_amount}`}
                secondary={`Client ID: ${invoice.client_id} | Status: ${invoice.status} | Due Date: ${invoice.due_date}`}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Container>
  );
}

export default InvoicesPage;
