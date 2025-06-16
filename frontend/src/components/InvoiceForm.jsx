// 📁 InvoiceForm.jsx (New Invoice Form)
import React, { useState } from 'react';
import axios from 'axios';

const InvoiceForm = ({ onCreated }) => {
  const userId = localStorage.getItem('userId');
  const [form, setForm] = useState({
    client_name: '',
    amount: '',
    description: '',
    due_date: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/invoices', { ...form, user_id: userId });
      setForm({ client_name: '', amount: '', description: '', due_date: '' });
      if (onCreated) onCreated();
    } catch (error) {
      console.error('Error creating invoice:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input name="client_name" value={form.client_name} onChange={handleChange} placeholder="Client Name" className="border p-2 w-full" required />
      <input name="amount" value={form.amount} onChange={handleChange} placeholder="Amount" type="number" step="0.01" className="border p-2 w-full" required />
      <input name="due_date" value={form.due_date} onChange={handleChange} type="date" className="border p-2 w-full" required />
      <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="border p-2 w-full" rows={3} />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Create Invoice</button>
    </form>
  );
};

export default InvoiceForm;