import React, { useState, useEffect } from 'react';

const LoginInterface = ({ salesAssociates, setViewState, setSalesAssociateID }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    //  Crucial: Validate the input.  Never trust user input!
    if (!username || !password) {
      setError("Username and password are required.");
      return;
    }

    const matchingAssociate = salesAssociates.find(associate => associate.User_ID === username);

    if (matchingAssociate && matchingAssociate.Password == password) {
      setError("");
      setSalesAssociateID(matchingAssociate.SA_ID);
      setViewState('draft');
    }
    else
    {
      console.log(matchingAssociate);
      setError('Invalid username or password'); 
    }

     // Clear inputs after validation.  Good UX.
    setUsername('');
    setPassword('');
  };


  return (
    <div>
      <h1>Login</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/*Display errors */}
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label><br/>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label><br/>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginInterface;
