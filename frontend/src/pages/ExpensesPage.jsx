import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Button, Box, CircularProgress,
  List, ListItem, ListItemText, IconButton, Alert, ListItemSecondaryAction
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ImageSearchIcon from '@mui/icons-material/ImageSearch';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/expenses');
      setExpenses(response.data);
    } catch (err) {
      console.error("Failed to fetch expenses:", err);
      setError("Failed to load expense list.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (expenseId) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
        await api.delete(`/expenses/${expenseId}`);
        fetchExpenses(); // Refresh list
        alert('Expense deleted successfully!');
      } catch (err) {
        console.error("Failed to delete expense:", err);
        setError("Failed to delete expense.");
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
          Expense Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/expenses/new')}
        >
          Add New Expense
        </Button>
      </Box>

      {expenses.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          No expense records yet. Click the “Add New Expense” button to get started!
        </Typography>
      ) : (
        <List>
          {expenses.map((expense) => (
            <ListItem
              key={expense.id}
              secondaryAction={
                <Box>
                  {expense.receipt_image_url && (
                    <IconButton
                      edge="end"
                      aria-label="view-receipt"
                      onClick={() => window.open(expense.receipt_image_url, '_blank')}
                      sx={{ mr: 1 }}
                    >
                      <ImageSearchIcon />
                    </IconButton>
                  )}
                  <IconButton edge="end" aria-label="edit" onClick={() => navigate(`/expenses/edit/${expense.id}`)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(expense.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              }
            >
              <ListItemText
                primary={`${expense.description} ($${expense.amount})`}
                secondary={`Category: ${expense.category || 'Uncategorized'} | Date: ${expense.expense_date}`}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Container>
  );
}

export default ExpensesPage;
