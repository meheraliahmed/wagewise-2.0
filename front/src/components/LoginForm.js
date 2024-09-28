import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateField } from '../features/login/loginSlice';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css';

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { email, password, rememberMe } = useSelector(state => state.login);

  const handleChange = (e) => {
    dispatch(updateField({ field: e.target.name, value: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3001/login', { email, password });
      console.log(response.data);
      // Assuming you want to store the logged-in user's email in Redux or localStorage
      // Update the user state with the logged-in email
      dispatch(updateField({ field: 'email', value: email }));
      navigate('/Profile'); 
    } catch (error) {
      console.error('Error logging in:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="login-container">
      <div className="image-section">
        <img src={`${process.env.PUBLIC_URL}/logoimg1.png`} alt="Wage Wise Logo" className="logo-img" />
      </div>
      <div className="form-section">
        <h2 className="login-head">Welcome Back</h2>
        <p className="desc-head">Please Sign In to continue</p>
        <form onSubmit={handleSubmit}>
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
          <div className="remember-me">
            <input
              type="checkbox"
              name="rememberMe"
              checked={rememberMe}
              onChange={() => dispatch(updateField({ field: 'rememberMe', value: !rememberMe }))}
            />
            <label>Remember me</label>
          </div>
          <button type="submit">Log in</button>
          <p>Don't have an account? <a href="/signup">Sign Up</a></p>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
