import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

function ChangePassword() {
  const location = useLocation();
  const { email } = location.state; // Access the email passed from UserProfile

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      alert("New passwords don't match!");
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/change-password', {
        email,
        currentPassword,
        newPassword,
      });
      alert(response.data.message); // Handle success
    } catch (error) {
      console.error('Error changing password:', error.response ? error.response.data : error.message);
      alert('Failed to change password');
    }
  };

  return (
    <div className="change-password">
      <h2>Change Password</h2>
      <form onSubmit={handlePasswordChange}>
        <input
          type="password"
          placeholder="Current Password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
        />
        <button type="submit">Change Password</button>
      </form>
    </div>
  );
}

export default ChangePassword;
