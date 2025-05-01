import React from 'react';
import { Link } from 'react-router-dom';

function LandingPage({setViewState}) {
  return (
    <div className="login-container">
      <h1>Welcome!</h1>
      <h2>Which interface would you like to look at?</h2>
      <div className="button-group">
        <Link to="/sales-associate" >
          <button onClick={() => setViewState("login")}>Sales Associate</button>
        </Link>
        <Link to="/headquarters">
          <button onClick={() => setViewState("sanction")}>Headquarters</button>
        </Link>
        <Link to="/administrator">
          <button onClick={() => setViewState("admin")}>Administrator</button>
        </Link>
      </div>
    </div>
  );
}
export default LandingPage;
