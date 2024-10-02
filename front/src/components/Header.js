// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header>
      <div className="logo">Wage Wise</div>
      <nav>
        <ul>
        <li><Link to="/community">Community</Link></li>
          <li><Link to="/salary-calculator">Calculate Salary</Link></li> 
          <li><Link to="/job-trends">Job Trends</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
