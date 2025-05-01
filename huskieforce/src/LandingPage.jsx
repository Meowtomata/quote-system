import React from 'react';
import { Link } from 'react-router-dom';

function LandingPage({setViewState}) {
  return (
    <div className="login-container">
      <h1>WELCOME!</h1>
      <h2>SELECT AN INTERFACE</h2>
      <div className="button-group">
        <Link to="/sales-associate" >
          <button onClick={() => setViewState("login")}>SALES ASSOCIATE</button>
        </Link>
        <Link to="/headquarters">
          <button onClick={() => setViewState("sanction")}>HEADQUARTERS</button>
        </Link>
        <Link to="/administrator">
          <button onClick={() => setViewState("admin")}>ADMINISTRATOR</button>
        </Link>
      </div>
    </div>
  );
}
export default LandingPage;
