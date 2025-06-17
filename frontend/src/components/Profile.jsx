import React from 'react';

function Profile() {
  // 你可以从后端获取当前用户信息并展示（如用户名、邮箱、创建时间等）
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'John Doe', email: 'example@email.com' };

  return (
    <div className="container mt-4">
      <h2>User Profile</h2>
      <div className="card p-3 mt-3">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Joined:</strong> {/* 可加注册时间 */} 2025-06-01</p>
      </div>
    </div>
  );
}

export default Profile;
