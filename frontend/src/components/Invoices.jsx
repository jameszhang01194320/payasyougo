import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Invoices() {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const userId = localStorage.getItem('user_id');
        const res = await axios.get(`http://localhost:5000/invoices/${userId}`);
        setInvoices(res.data);
      } catch (err) {
        console.error('Failed to fetch invoices:', err);
      }
    };

    fetchInvoices();
  }, []);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center">
        <h2>Invoices</h2>
        <button className="btn btn-primary">+ New Invoice</button>
      </div>

      <table className="table table-striped mt-3">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Client</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Due Date</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((inv) => (
            <tr key={inv.id}>
              <td>{inv.id}</td>
              <td>{inv.client_name}</td>
              <td>${inv.amount.toFixed(2)}</td>
              <td>{inv.status}</td>
              <td>{inv.due_date}</td>
              <td>{new Date(inv.created_at).toLocaleDateString()}</td>
              <td>
                <button className="btn btn-sm btn-outline-secondary me-2">Edit</button>
                <button className="btn btn-sm btn-outline-danger">Delete</button>
              </td>
            </tr>
          ))}
          {invoices.length === 0 && (
            <tr>
              <td colSpan="7" className="text-center">No invoices found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Invoices;
