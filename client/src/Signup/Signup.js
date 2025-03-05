import React from 'react';
import './Signup.css';

function Signup() {
  return (
    <div className="Signup">
      <header className="Signup-header">
        <h1>New User Signup</h1>
        <form>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input type="text" id="username" name="username" placeholder="username" />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" name="password" placeholder="password" />
          </div>
          <div className="form-group">
            <label htmlFor="password_confirm">Confirmed Password:</label>
            <input type="password" id="password_confirm" name="password_confirm" placeholder="password confirmed" />
          </div>
          <div className="form-group">
            <label htmlFor="firstname">First Name:</label>
            <input type="text" id="firstname" name="firstname" placeholder="firstname" />
          </div>
          <div className="form-group">
            <label htmlFor="lastname">Last Name:</label>
            <input type="text" id="lastname" name="lastname" placeholder="lastname" />
          </div>
          <button type="submit">Signup</button>
        </form>
      </header>
    </div>
  );
}

export default Signup;
