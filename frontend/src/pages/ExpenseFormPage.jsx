import React, { useState, useEffect } from 'react';
import {
  Container, Typography, TextField, Button, Box, CircularProgress, Alert, Checkbox, FormControlLabel
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';

function ExpenseFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [expenseDate, setExpenseDate] = useState('');
  const [receiptImageFile, setReceiptImageFile] = useState(null); // For file upload
  const [receiptImageURL, setReceiptImageURL] = useState(''); // For displaying existing image URL
  const [isReimbursable, setIsReimbursable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const isEditMode = Boolean(id);

  useEffect(() => {
    if (isEditMode) {
      setLoading(true);
      const fetchExpense = async () => {
        try {
          const response = await api.get(`/expenses/${id}`);
          const expense = response.data;
          setDescription(expense.description);
          setAmount(expense.amount);
          setCategory(expense.category || '');
          setExpenseDate(expense.expense_date);
          setReceiptImageURL(expense.receipt_image_url || '');
          setIsReimbursable(expense.is_reimbursable);
        } catch (err) {
          console.error("Failed to fetch expense for edit:", err);
          setError("Failed to load expense information.");
        } finally {
          setLoading(false);
        }
      };
      fetchExpense();
    }
  }, [id, isEditMode]);

  const handleFileChange = (event) => {
    setReceiptImageFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // TODO: For image upload, the real-world app would upload the file to cloud storage (e.g., AWS S3),
    // then store the image URL in the database after the backend receives it.
    // For now, we only handle text fields.
    // If receiptImageFile exists, here you would add logic to upload and get URL.
    let finalReceiptImageUrl = receiptImageURL; // Default to existing URL

    // Example of file upload logic (simplified and incomplete — requires real backend upload API)
    // if (receiptImageFile) {
    //    const formData = new FormData();
    //    formData.append('receipt', receiptImageFile);
    //    try {
    //        const uploadResponse = await api.post('/upload-receipt', formData, {
    //            headers: { 'Content-Type': 'multipart/form-data' }
    //        });
    //        finalReceiptImageUrl = uploadResponse.data.url; // Assume backend returns uploaded image URL
    //    } catch (uploadErr) {
    //        setError(`Receipt upload failed: ${uploadErr.message}`);
    //        setLoading(false);
    //        return;
    //    }
    // }

    const expenseData = {
      description,
      amount: parseFloat(amount) || 0,
      category: category || null,
      expense_date: expenseDate,
      receipt_image_url: finalReceiptImageUrl || null,
      is_reimbursable: isReimbursable,
    };

    try {
      if (isEditMode) {
        await api.put(`/expenses/${id}`, expenseData);
        setSuccess('Expense updated successfully!');
      } else {
        await api.post('/expenses', expenseData);
        setSuccess('New expense added successfully!');
        // Clear form
        setDescription('');
        setAmount('');
        setCategory('');
        setExpenseDate('');
        setReceiptImageFile(null);
        setReceiptImageURL('');
        setIsReimbursable(false);
      }
      setTimeout(() => navigate('/expenses'), 2000);
    } catch (err) {
      console.error("Failed to save expense:", err);
      setError(`Failed to save expense: ${err.response?.data?.msg || err.message}`);
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
        {isEditMode ? 'Edit Expense' : 'Add New Expense'}
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
          label="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={loading}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          disabled={loading}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="Expense Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={expenseDate}
          onChange={(e) => setExpenseDate(e.target.value)}
          disabled={loading}
        />
        <Box sx={{ my: 2 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>Receipt Image (URL or File Upload)</Typography>
          {receiptImageURL && (
            <Box sx={{ mb: 1 }}>
              <img src={receiptImageURL} alt="Receipt Preview" style={{ maxWidth: '100px', maxHeight: '100px', border: '1px solid #eee' }} />
              <Typography variant="caption" display="block">Current image URL: {receiptImageURL}</Typography>
            </Box>
          )}
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="receipt-file-upload"
            type="file"
            onChange={handleFileChange}
            disabled={loading}
          />
          <label htmlFor="receipt-file-upload">
            <Button variant="outlined" component="span" disabled={loading}>
              Upload Receipt File
            </Button>
          </label>
        </Box>
        <FormControlLabel
          control={
            <Checkbox
              checked={isReimbursable}
              onChange={(e) => setIsReimbursable(e.target.checked)}
              name="isReimbursable"
              color="primary"
              disabled={loading}
            />
          }
          label="Reimbursable?"
          sx={{ mt: 1, mb: 2 }}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : (isEditMode ? 'Update Expense' : 'Add Expense')}
        </Button>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
        <Button
          fullWidth
          variant="outlined"
          sx={{ mb: 2 }}
          onClick={() => navigate('/expenses')}
          disabled={loading}
        >
          Cancel
        </Button>
      </Box>
    </Container>
  );
}

export default ExpenseFormPage;
