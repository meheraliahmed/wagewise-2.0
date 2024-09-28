// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header>
      <div className="logo">Wage Wise</div>
      <nav>
        <ul>
          <li><Link to="/community">Community</Link></li> {/* Replace href with Link */}
          <li><Link to="/salary-calculator">Calculate Salary</Link></li> {/* Updated this line */}
          <li><Link to="/job-trends">Job Trends</Link></li> {/* Replace href with Link */}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
