// src/components/SignUpForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirect
import { useSelector, useDispatch } from 'react-redux';
import { updateField } from '../features/signup/signupSlice';
import './SignUpForm.css'; 

const SignUpForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize navigate for redirection
  const { fullName, email, password, confirmPassword, rememberMe } = useSelector(state => state.signup);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    dispatch(updateField({ field: e.target.name, value: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fullName, email, password, rememberMe })
      });

      if (response.ok) {
        // If successful, redirect to the questionnaire page
        navigate('/questionnaire');
      } else {
        const message = await response.text();
        setError(message);
      }
    } catch (error) {
      console.error('Error during signup:', error);
      setError('Error registering user');
    }
  };

  return (
    <div className="signup-container">
      <div className="form-section">
        <h2 className="sign-head">Sign up</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="fullName"
            placeholder="Full name"
            value={fullName}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={handleChange}
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={handleChange}
          />
          <button type="submit">Sign up</button>
        </form>
      </div>
    </div>
  );
};

export default SignUpForm;
