import React from 'react';
import './Login.css';

function Login() {
  return (
    <div className="Login">
      <header className="Login-header">
        <h1>New User Login</h1>
        <form>
          <div className="form-group" class="sr-only">
            <label htmlFor="username">Username:</label>
            <input type="text" id="username" name="username" placeholder="username" />
          </div>
          <div className="form-group" class="sr-only">
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" name="password" placeholder="password" />
          </div>
          <button type="submit">Login</button>
        </form>
      </header>
    </div>
  );
}

export default Login;
