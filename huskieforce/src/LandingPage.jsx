import React from 'react';
import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div className="login-container">
      <h1>Welcome!</h1>
      <h2>Which interface would you like to look at?</h2>
      <div className="button-group">
        <Link to="/sales-associate" >
          <button>Sales Associate</button>
        </Link>
        <Link to="/headquarters">
          <button>Headquarters</button>
        </Link>
        <Link to="/administrator">
          <button>Administrator</button>
        </Link>
      </div>
    </div>
  );
}
export default LandingPage;
