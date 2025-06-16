import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Clients() {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const userId = localStorage.getItem('user_id');
        const res = await axios.get(`http://localhost:5000/clients/${userId}`);
        setClients(res.data);
      } catch (err) {
        console.error('Failed to fetch clients:', err);
      }
    };

    fetchClients();
  }, []);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center">
        <h2>Clients</h2>
        <button className="btn btn-success">+ Add Client</button>
      </div>

      <table className="table table-hover mt-3">
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id}>
              <td>{client.id}</td>
              <td>{client.name}</td>
              <td>{client.email}</td>
              <td>{client.phone || 'N/A'}</td>
              <td>
                <button className="btn btn-sm btn-outline-secondary me-2">Edit</button>
                <button className="btn btn-sm btn-outline-danger">Delete</button>
              </td>
            </tr>
          ))}
          {clients.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center">No clients found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Clients;
