import React from 'react';

function Profile() {
  // You can get info from backend
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'John Doe', email: 'example@email.com' };

  return (
    <div className="container mt-4">
      <h2>User Profile</h2>
      <div className="card p-3 mt-3">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Joined:</strong> {/* add time */} 2025-06-01</p>
      </div>
    </div>
  );
}

export default Profile;
