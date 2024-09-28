// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import SignUpForm from './components/SignUpForm';
import UserProfile from './components/UserProfile';
import QuestionnaireForm from './components/QuestionnaireForm'; // Import Questionnaire form
import ChangePassword from './components/changepass';
import SalaryCalculator from './components/salarycal'; 


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
        <Route path="/Profile" element={<UserProfile />} />
        <Route path="/" element={<LoginForm />} />
         
        <Route path="/salary-calculator" element={<SalaryCalculator />}/>
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/questionnaire" element={<QuestionnaireForm />} /> {/* Add this route */}
          <Route path="/change-password" element={<ChangePassword />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
