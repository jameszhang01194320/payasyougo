import React, { useState, useEffect } from 'react';
import {
  Container, Typography, TextField, Button, Box, CircularProgress, Alert,
  MenuItem, InputAdornment, IconButton
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';

function InvoiceFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [clientId, setClientId] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState([{ description: '', quantity: 0, unit_price: 0 }]);
  const [clients, setClients] = useState([]); // For client selection dropdown
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

    // If editing, fetch invoice details
    if (isEditMode) {
      setLoading(true);
      const fetchInvoice = async () => {
        try {
          const response = await api.get(`/invoices/${id}`);
          const invoice = response.data;
          setInvoiceNumber(invoice.invoice_number);
          setClientId(invoice.client_id);
          setIssueDate(invoice.issue_date);
          setDueDate(invoice.due_date);
          setNotes(invoice.notes || '');
          // Note: Backend may return InvoiceItems in a format different from what edit page expects
          // Ensure response.data.items exists and is an array
          if (invoice.items && Array.isArray(invoice.items)) {
            setItems(invoice.items.map(item => ({
              description: item.description,
              quantity: item.quantity,
              unit_price: item.unit_price
            })));
          } else {
            setItems([{ description: '', quantity: 0, unit_price: 0 }]); // Initialize one empty row if no details
          }
        } catch (err) {
          console.error("Failed to fetch invoice for edit:", err);
          setError("Failed to load invoice details.");
        } finally {
          setLoading(false);
        }
      };
      fetchInvoice();
    }
  }, [id, isEditMode]);

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleAddItem = () => {
    setItems([...items, { description: '', quantity: 0, unit_price: 0 }]);
  };

  const handleRemoveItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const invoiceData = {
      invoice_number: invoiceNumber,
      client_id: clientId,
      issue_date: issueDate,
      due_date: dueDate,
      notes: notes,
      items: items.map(item => ({
        description: item.description,
        quantity: parseFloat(item.quantity) || 0, // Ensure numeric
        unit_price: parseFloat(item.unit_price) || 0
      }))
    };

    try {
      if (isEditMode) {
        await api.put(`/invoices/${id}`, invoiceData);
        setSuccess('Invoice updated successfully!');
      } else {
        await api.post('/invoices', invoiceData);
        setSuccess('New invoice created successfully!');
        // Clear form
        setInvoiceNumber('');
        setClientId('');
        setIssueDate('');
        setDueDate('');
        setNotes('');
        setItems([{ description: '', quantity: 0, unit_price: 0 }]);
      }
      setTimeout(() => navigate('/invoices'), 2000); // Redirect to invoice list after 2 seconds
    } catch (err) {
      console.error("Failed to save invoice:", err);
      setError(`Failed to save invoice: ${err.response?.data?.msg || err.message}`);
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
    <Container component="main" maxWidth="md" sx={{ mt: 8, p: 3, border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
      <Typography variant="h5" component="h1" gutterBottom>
        {isEditMode ? 'Edit Invoice' : 'Create New Invoice'}
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          label="Invoice Number"
          value={invoiceNumber}
          onChange={(e) => setInvoiceNumber(e.target.value)}
          disabled={loading}
        />
        <TextField
          select
          margin="normal"
          required
          fullWidth
          label="Select Client"
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          disabled={loading || clients.length === 0}
        >
          {clients.length === 0 ? (
            <MenuItem disabled>Please add a client first</MenuItem>
          ) : (
            clients.map((client) => (
              <MenuItem key={client.id} value={client.id}>
                {client.name} ({client.email})
              </MenuItem>
            ))
          )}
        </TextField>
        <TextField
          margin="normal"
          required
          fullWidth
          label="Issue Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={issueDate}
          onChange={(e) => setIssueDate(e.target.value)}
          disabled={loading}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="Due Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          disabled={loading}
        />

        <Typography variant="h6" component="h2" sx={{ mt: 3, mb: 1 }}>
          Invoice Items
        </Typography>
        {items.map((item, index) => (
          <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center', border: '1px solid #eee', p: 2, borderRadius: '4px' }}>
            <TextField
              label="Description"
              value={item.description}
              onChange={(e) => handleItemChange(index, 'description', e.target.value)}
              fullWidth
              required
              size="small"
              disabled={loading}
            />
            <TextField
              label="Quantity"
              type="number"
              value={item.quantity}
              onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
              sx={{ width: 100 }}
              required
              size="small"
              disabled={loading}
            />
            <TextField
              label="Unit Price"
              type="number"
              value={item.unit_price}
              onChange={(e) => handleItemChange(index, 'unit_price', e.target.value)}
              sx={{ width: 100 }}
              required
              size="small"
              disabled={loading}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
            />
            <Typography sx={{ minWidth: 80, textAlign: 'right' }}>
              Subtotal: ${((parseFloat(item.quantity) || 0) * (parseFloat(item.unit_price) || 0)).toFixed(2)}
            </Typography>
            {items.length > 1 && (
              <IconButton onClick={() => handleRemoveItem(index)} color="error" disabled={loading}>
                <RemoveCircleIcon />
              </IconButton>
            )}
          </Box>
        ))}
        <Button
          startIcon={<AddCircleIcon />}
          onClick={handleAddItem}
          variant="outlined"
          sx={{ mb: 3 }}
          disabled={loading}
        >
          Add Item
        </Button>

        <TextField
          margin="normal"
          fullWidth
          label="Notes"
          multiline
          rows={4}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          disabled={loading}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : (isEditMode ? 'Update Invoice' : 'Create Invoice')}
        </Button>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
        <Button
          fullWidth
          variant="outlined"
          sx={{ mb: 2 }}
          onClick={() => navigate('/invoices')}
          disabled={loading}
        >
          Cancel
        </Button>
      </Box>
    </Container>
  );
}

export default InvoiceFormPage;
