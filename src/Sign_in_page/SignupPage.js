import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css'  // Changed from './App.css' to point to parent directory

const SignupPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [message, setMessage] = useState('');

  // Load username from localStorage if "Remember me" was previously checked
  useEffect(() => {
    const savedUsername = localStorage.getItem('rememberedUsername');
    if (savedUsername) {
      setUsername(savedUsername);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); // Clear previous messages

    try {
      const response = await fetch('http://127.0.0.1:5000/api/validate-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json(); // Get JSON response

      if (!response.ok) {
        throw new Error(result.message || 'Login failed');
      }

      if (result.success) {
        setMessage('✅ Login Successful');

        if (rememberMe) {
          localStorage.setItem('rememberedUsername', username);
        } else {
          localStorage.removeItem('rememberedUsername');
        }

        setTimeout(() => navigate('/Local_view'), 1000); // Delay navigation for UX
      } else {
        setMessage('❌ Invalid Username or Password');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setMessage(error.message || '❌ An error occurred. Please try again.');
    }
  };

  return (
    <div className="page-background">
      <div className="top-left-header">
        <img src="logo.png" alt="Logo" className="logos" />
        <h2>NEXT-GEN MONITORING AND CONTROL SOFTWARE</h2>
      </div>

      <div className="signup-container">
        <h2>Sign In</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="remember-me">
            <label>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember me
            </label>
          </div>

          <button type="submit">Log In</button>

          <div>
            <a href="#">Forgot password?</a>
          </div>
        </form>

        {message && <p className="login-message">{message}</p>}
      </div>
    </div>
  );
};

export default SignupPage;
